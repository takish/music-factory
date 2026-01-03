import { join } from "node:path";
import { generateImagePrompt } from "../core/generators/imagePromptGenerator";
import { generateLyrics } from "../core/generators/lyricsGenerator";
import {
	generateStyle,
	getStyleCharCount,
	isStyleWithinLimit,
} from "../core/generators/styleGenerator";
import {
	type ParsedAnalysis,
	parseAnalysisMarkdown,
} from "../core/parsers/analysisMarkdownParser";
import { type Analysis, type Section, analysisSchema } from "../schemas/analysis";
import type { GenerateSunoPackInput, GenerateSunoPackOutput } from "../schemas/output";
import { extractSlug, getConfig, resolveDataPath } from "../utils/config";
import { readText, readYaml, writeText } from "../utils/fileIO";

/**
 * Map section name from markdown to Section enum
 */
function mapSectionName(name: string): Section | null {
	const normalized = name
		.replace(/\s+/g, "")
		.replace(/\d+$/, "")
		.replace(/[/-]/g, "");

	const mapping: Record<string, Section> = {
		intro: "Intro",
		verse: "Verse1",
		verse1: "Verse1",
		verse2: "Verse2",
		verse3: "Verse3",
		prechorus: "PreChorus",
		chorus: "Chorus",
		postchorus: "PostChorus",
		instrumental: "Instrumental",
		drop: "Drop",
		breakdown: "Breakdown",
		bridge: "Bridge",
		finalchorus: "FinalChorus",
		finalchorusrepeat: "FinalChorusRepeat",
		outro: "Outro",
	};

	return mapping[normalized.toLowerCase()] ?? null;
}

/**
 * Map energy curve from markdown to enum
 */
function mapEnergyCurve(curve: string): "flat" | "build" | "wave" {
	const lower = curve.toLowerCase();
	if (lower.includes("flat") || lower.includes("一定")) return "flat";
	if (lower.includes("build") || lower.includes("上昇")) return "build";
	return "wave";
}

/**
 * Map word density from markdown to enum
 */
function mapWordDensity(density: string): "low" | "medium" | "high" {
	const lower = density.toLowerCase();
	if (lower.includes("高") || lower.includes("high")) return "high";
	if (lower.includes("低") || lower.includes("low")) return "low";
	return "medium";
}

/**
 * Estimate tempo from target length
 */
function estimateTempo(targetLength: string): number {
	// Default tempos based on typical song lengths
	if (targetLength.includes("5")) return 90;
	if (targetLength.includes("4")) return 110;
	return 130; // 3min
}

/**
 * Convert ParsedAnalysis to Analysis type
 */
function convertParsedToAnalysis(parsed: ParsedAnalysis): Analysis {
	// Map sections
	const sections: Section[] = parsed.structure.sections
		.map((s) => mapSectionName(s))
		.filter((s): s is Section => s !== null);

	// Ensure at least some sections
	if (sections.length === 0) {
		sections.push("Intro", "Verse1", "Chorus", "Verse2", "Chorus", "Bridge", "FinalChorus", "Outro");
	}

	// Build chord progression
	const chordProgression: Analysis["chord_progression"] = {
		notation: "roman_numerals",
	};

	for (const [key, value] of Object.entries(parsed.chordProgression.sections)) {
		const sectionKey = key.toLowerCase() as keyof typeof chordProgression;
		if (sectionKey === "verse" || sectionKey === "prechorus" || sectionKey === "chorus" || sectionKey === "bridge") {
			chordProgression[sectionKey] = {
				feel: value.feel,
				pattern: value.pattern,
			};
		}
	}

	return {
		source_song: {
			title: parsed.title,
			artist: parsed.artist,
		},
		music_structure: {
			target_length: "3min",
			tempo_bpm: estimateTempo(parsed.structure.targetLength),
			key_mode: parsed.chordProgression.keyMode,
			energy_curve: mapEnergyCurve(parsed.structure.energyCurve),
			sections,
		},
		chord_progression: chordProgression,
		arrangement: {
			genre_tags: parsed.arrangement.genreTags.length > 0
				? parsed.arrangement.genreTags.slice(0, 4)
				: ["Japanese Pop"],
			center: parsed.arrangement.instruments[0]?.instrument,
			instruments: parsed.arrangement.instruments.map((i) => i.instrument),
			rhythm: parsed.arrangement.instruments.find((i) => i.part === "リズム")?.instrument,
			bass: parsed.arrangement.instruments.find((i) => i.part === "ベース")?.instrument,
			density: {
				verse: mapDensityValue(parsed.arrangement.density.verse),
				chorus: mapDensityValue(parsed.arrangement.density.chorus),
				final: mapDensityValue(parsed.arrangement.density.finalChorus),
			},
			dynamics: parsed.arrangement.design,
			ear_candy: parsed.arrangement.instruments
				.filter((i) => i.part === "効果")
				.map((i) => i.instrument)
				.join(", "),
		},
		lyrics_design: {
			language: parsed.lyricsDesign.language,
			perspective: parsed.lyricsDesign.perspective,
			emotion_expression: parsed.lyricsDesign.emotionHandling,
			word_density: mapWordDensity(parsed.lyricsDesign.wordDensity),
			theme: parsed.lyricsDesign.themes,
		},
		concept_keywords: parsed.conceptKeywords,
	};
}

/**
 * Map density string to enum
 */
function mapDensityValue(value: string): "sparse" | "medium" | "dense" {
	const lower = value.toLowerCase();
	if (lower.includes("低") || lower.includes("low") || lower.includes("sparse")) return "sparse";
	if (lower.includes("高") || lower.includes("high") || lower.includes("dense") || lower.includes("最高")) return "dense";
	return "medium";
}

/**
 * Generate title from analysis
 */
function generateTitle(analysis: Analysis): string {
	// Use source song title as base, but create a unique variation
	const base = analysis.source_song.title;

	// If there are concept keywords, use them for inspiration
	if (analysis.concept_keywords && analysis.concept_keywords.length > 0) {
		const keyword = analysis.concept_keywords[0];
		// Keep it short (2-8 chars recommended)
		if (keyword && keyword.length <= 8) {
			return keyword;
		}
	}

	// Use a short version of the title
	if (base.length <= 8) {
		return base;
	}

	// Extract first meaningful segment
	const segments = base.split(/[、。\s]/);
	if (segments[0] && segments[0].length <= 8) {
		return segments[0];
	}

	return base.slice(0, 8);
}

/**
 * Load analysis from file (supports .md and .yaml)
 */
async function loadAnalysis(analysisPath: string): Promise<Analysis> {
	const content = await readText(analysisPath);

	if (analysisPath.endsWith(".md")) {
		const parsed = parseAnalysisMarkdown(content);
		return convertParsedToAnalysis(parsed);
	}

	// YAML format
	const rawAnalysis = await readYaml<unknown>(analysisPath);
	const parseResult = analysisSchema.safeParse(rawAnalysis);

	if (!parseResult.success) {
		throw new Error(`Invalid analysis file: ${parseResult.error.message}`);
	}

	return parseResult.data;
}

/**
 * Generate Suno pack from analysis
 */
export async function generateSunoPack(
	input: GenerateSunoPackInput,
): Promise<GenerateSunoPackOutput> {
	const config = getConfig();

	// Read and validate analysis
	const analysisPath = resolveDataPath(config, input.analysis_path);
	const analysis = await loadAnalysis(analysisPath);

	const slug = extractSlug(input.analysis_path);
	const outputDir = resolveDataPath(config, "outputs", slug);

	// Generate content
	const title = generateTitle(analysis);
	const style = generateStyle(analysis);
	const lyrics = generateLyrics(analysis);

	// Write files
	const titlePath = join(outputDir, "title.txt");
	const stylePath = join(outputDir, "suno_style.txt");
	const lyricsPath = join(outputDir, "suno_lyrics.txt");

	await writeText(titlePath, title);
	await writeText(stylePath, style);
	await writeText(lyricsPath, lyrics);

	const result: GenerateSunoPackOutput = {
		slug,
		files: {
			title: titlePath,
			suno_style: stylePath,
			suno_lyrics: lyricsPath,
		},
		checks: {
			suno_style_chars: getStyleCharCount(style),
			within_1000_chars: isStyleWithinLimit(style),
		},
	};

	// Generate image prompt if requested
	if (input.include_image_prompt) {
		const imagePrompt = generateImagePrompt(analysis);
		const imagePromptPath = join(outputDir, "image_prompt.txt");
		await writeText(imagePromptPath, imagePrompt);
		result.files.image_prompt = imagePromptPath;
	}

	return result;
}
