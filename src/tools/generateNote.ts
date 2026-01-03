import { parse as parseYaml } from "yaml";
import {
	type ParsedAnalysis,
	parseAnalysisMarkdown,
} from "../core/parsers/analysisMarkdownParser";
import type { Analysis, Section } from "../schemas/analysis";
import type { GenerateNoteInput, GenerateNoteOutput } from "../schemas/output";
import { getConfig, resolveDataPath } from "../utils/config";
import { readText, writeText } from "../utils/fileIO";

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
	if (targetLength.includes("5")) return 90;
	if (targetLength.includes("4")) return 110;
	return 130;
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
 * Convert ParsedAnalysis to Analysis type
 */
function convertParsedToAnalysis(parsed: ParsedAnalysis): Analysis {
	const sections: Section[] = parsed.structure.sections
		.map((s) => mapSectionName(s))
		.filter((s): s is Section => s !== null);

	if (sections.length === 0) {
		sections.push("Intro", "Verse1", "Chorus", "Verse2", "Chorus", "Bridge", "FinalChorus", "Outro");
	}

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
 * Load analysis from file (supports .md and .yaml)
 */
async function loadAnalysis(analysisPath: string): Promise<Analysis> {
	const content = await readText(analysisPath);

	if (analysisPath.endsWith(".md")) {
		const parsed = parseAnalysisMarkdown(content);
		return convertParsedToAnalysis(parsed);
	}

	// YAML format
	return parseYaml(content) as Analysis;
}

/**
 * Generate note.com article draft from analysis
 *
 * Creates a markdown file with:
 * - Song metadata
 * - Structure overview
 * - Arrangement details
 * - Production notes
 */
export async function generateNote(input: GenerateNoteInput): Promise<GenerateNoteOutput> {
	const config = getConfig();

	// Read and parse analysis
	const analysisFullPath = resolveDataPath(config, input.analysis_path);
	const analysis = await loadAnalysis(analysisFullPath);

	// Extract slug from analysis_path
	const slug = input.analysis_path
		.replace(/^analysis\//, "")
		.replace(/\.(yaml|md)$/, "");

	// Build note content
	const noteContent = buildNoteContent(analysis, slug);

	// Write note file
	const notePath = `notes/${slug}.md`;
	const noteFullPath = resolveDataPath(config, notePath);
	await writeText(noteFullPath, noteContent);

	// Generate preview
	const preview = noteContent.split("\n").slice(0, 20).join("\n");

	// Suggest next actions
	const nextActions: string[] = [
		`generate_suno_pack({ analysis_path: "${input.analysis_path}" })`,
		"Edit the note draft to add personal insights and context",
	];

	return {
		note_path: notePath,
		slug,
		preview,
		next_actions: nextActions,
	};
}

/**
 * Build markdown content for note.com article
 */
function buildNoteContent(analysis: Analysis, slug: string): string {
	const lines: string[] = [];

	// Frontmatter
	lines.push("---");
	lines.push(`title: "${analysis.source_song.title}" 風の曲を作る`);
	lines.push(`slug: ${slug}`);
	lines.push("tags: [AI音楽, Suno, 作曲]");
	lines.push("---");
	lines.push("");

	// Introduction
	lines.push(`# 「${analysis.source_song.title}」風の曲を作る`);
	lines.push("");
	if (analysis.source_song.artist) {
		lines.push(`${analysis.source_song.artist}の「${analysis.source_song.title}」を参考に、曲を作成してみました。`);
	} else {
		lines.push(`「${analysis.source_song.title}」を参考に、曲を作成してみました。`);
	}
	lines.push("");

	// Structure section
	lines.push("## 構成");
	lines.push("");
	lines.push(`- **曲の長さ**: ${analysis.music_structure.target_length}`);
	lines.push(`- **テンポ**: ${analysis.music_structure.tempo_bpm} BPM`);
	lines.push(`- **キー**: ${analysis.music_structure.key_mode}`);
	lines.push(`- **エネルギーカーブ**: ${analysis.music_structure.energy_curve}`);
	lines.push("");

	// Sections
	lines.push("### セクション構成");
	lines.push("");
	lines.push("```");
	lines.push(analysis.music_structure.sections.join(" → "));
	lines.push("```");
	lines.push("");

	// Arrangement section
	lines.push("## アレンジ");
	lines.push("");
	lines.push(`- **ジャンル**: ${analysis.arrangement.genre_tags.join(", ")}`);
	if (analysis.arrangement.center) {
		lines.push(`- **中心楽器**: ${analysis.arrangement.center}`);
	}
	if (analysis.arrangement.rhythm) {
		lines.push(`- **リズム**: ${analysis.arrangement.rhythm}`);
	}
	if (analysis.arrangement.bass) {
		lines.push(`- **ベース**: ${analysis.arrangement.bass}`);
	}
	if (analysis.arrangement.dynamics) {
		lines.push(`- **ダイナミクス**: ${analysis.arrangement.dynamics}`);
	}
	lines.push("");

	// Density
	if (typeof analysis.arrangement.density === "object") {
		lines.push("### 音の密度");
		lines.push("");
		if (analysis.arrangement.density.verse) {
			lines.push(`- Verse: ${analysis.arrangement.density.verse}`);
		}
		if (analysis.arrangement.density.chorus) {
			lines.push(`- Chorus: ${analysis.arrangement.density.chorus}`);
		}
		if (analysis.arrangement.density.final) {
			lines.push(`- Final: ${analysis.arrangement.density.final}`);
		}
		lines.push("");
	}

	// Chord progression section
	if (analysis.chord_progression) {
		lines.push("## コード進行");
		lines.push("");
		lines.push("（Roman numerals表記の推定値）");
		lines.push("");
		if (analysis.chord_progression.verse) {
			lines.push(`- **Verse**: ${analysis.chord_progression.verse.pattern}`);
		}
		if (analysis.chord_progression.prechorus) {
			lines.push(`- **Pre-Chorus**: ${analysis.chord_progression.prechorus.pattern}`);
		}
		if (analysis.chord_progression.chorus) {
			lines.push(`- **Chorus**: ${analysis.chord_progression.chorus.pattern}`);
		}
		if (analysis.chord_progression.bridge) {
			lines.push(`- **Bridge**: ${analysis.chord_progression.bridge.pattern}`);
		}
		lines.push("");
	}

	// Lyrics design section
	lines.push("## 歌詞デザイン");
	lines.push("");
	lines.push(`- **言語**: ${analysis.lyrics_design.language}`);
	if (analysis.lyrics_design.perspective) {
		lines.push(`- **視点**: ${analysis.lyrics_design.perspective}`);
	}
	if (analysis.lyrics_design.scenery) {
		lines.push(`- **情景描写**: ${analysis.lyrics_design.scenery}`);
	}
	if (analysis.lyrics_design.emotion_expression) {
		lines.push(`- **感情表現**: ${analysis.lyrics_design.emotion_expression}`);
	}
	if (analysis.lyrics_design.word_density) {
		lines.push(`- **言語密度**: ${analysis.lyrics_design.word_density}`);
	}
	lines.push("");

	if (analysis.lyrics_design.theme && analysis.lyrics_design.theme.length > 0) {
		lines.push("### テーマ");
		lines.push("");
		lines.push(analysis.lyrics_design.theme.map((t) => `- ${t}`).join("\n"));
		lines.push("");
	}

	// Concept keywords
	if (analysis.concept_keywords && analysis.concept_keywords.length > 0) {
		lines.push("## コンセプトキーワード");
		lines.push("");
		lines.push(analysis.concept_keywords.map((k) => `\`${k}\``).join(" "));
		lines.push("");
	}

	// Footer
	lines.push("---");
	lines.push("");
	lines.push("*この記事はAI分析ツールを使用して作成されました。*");
	lines.push("");

	return lines.join("\n");
}
