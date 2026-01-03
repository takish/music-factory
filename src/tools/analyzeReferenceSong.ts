import { stringify as stringifyYaml } from "yaml";
import { getCoreTypePattern, listCoreTypes } from "../core/types/patterns";
import type { Analysis, Section } from "../schemas/analysis";
import type {
	AnalyzeReferenceSongInput,
	AnalyzeReferenceSongOutput,
	ConfidenceLevel,
} from "../schemas/analyze";
import { getConfig, resolveVaultPath } from "../utils/config";
import { writeText } from "../utils/fileIO";

/**
 * Japanese to romaji mapping for common characters
 */
const ROMAJI_MAP: Record<string, string> = {
	// Common artist/song name words
	あいみょん: "aimyon",
	ヨルシカ: "yorushika",
	マリーゴールド: "marigold",
	紅蓮華: "gurenka",
	// Hiragana
	あ: "a",
	い: "i",
	う: "u",
	え: "e",
	お: "o",
	か: "ka",
	き: "ki",
	く: "ku",
	け: "ke",
	こ: "ko",
	// Add more as needed
};

/**
 * Convert Japanese text to ASCII-safe slug
 * Falls back to core_type + sanitized title if conversion fails
 */
function toAsciiSlug(text: string): string {
	let result = text.toLowerCase();

	// Apply known romaji mappings
	for (const [jp, romaji] of Object.entries(ROMAJI_MAP)) {
		result = result.replace(new RegExp(jp, "g"), romaji);
	}

	// Remove any remaining non-ASCII characters
	result = result.replace(/[^a-z0-9]+/g, "_");

	// Clean up underscores
	result = result.replace(/^_+|_+$/g, "").replace(/_+/g, "_");

	return result;
}

/**
 * Generate ASCII-only slug from artist and title
 * Format: {artist}_{title} or {core_type}_{sanitized_title}
 */
function generateSlug(artist: string, title: string, coreType: string): string {
	const artistSlug = toAsciiSlug(artist);
	const titleSlug = toAsciiSlug(title);

	// If both converted successfully, use them
	if (artistSlug.length >= 2 && titleSlug.length >= 2) {
		return `${artistSlug}_${titleSlug}`.slice(0, 50);
	}

	// Fallback: use core_type + whatever we got
	const fallback = `${coreType}_${titleSlug || artistSlug || "song"}`;
	return fallback.slice(0, 50);
}

/**
 * Estimate tempo from notes or use pattern default
 */
function estimateTempo(
	input: AnalyzeReferenceSongInput,
	patternTempo: { min: number; max: number; typical: number },
): number {
	const notes = input.notes?.toLowerCase() ?? "";

	if (notes.includes("slow") || notes.includes("ゆっくり") || notes.includes("バラード")) {
		return patternTempo.min;
	}
	if (notes.includes("fast") || notes.includes("速い") || notes.includes("アップテンポ")) {
		return patternTempo.max;
	}

	return patternTempo.typical;
}

/**
 * Select appropriate sections based on notes
 */
function adjustSections(baseSections: Section[], notes?: string): Section[] {
	const n = notes?.toLowerCase() ?? "";

	// If notes mention short/minimal, reduce sections
	if (n.includes("short") || n.includes("短い") || n.includes("シンプル")) {
		return baseSections.filter(
			(s) => !["PostChorus", "Instrumental", "FinalChorusRepeat"].includes(s),
		);
	}

	// If notes mention long/extended, keep all
	if (n.includes("long") || n.includes("長い")) {
		return baseSections;
	}

	return baseSections;
}

/**
 * Generate concept keywords from pattern and notes
 */
function generateKeywords(patternKeywords: string[], notes?: string): string[] {
	const keywords = [...patternKeywords];

	// Extract potential keywords from notes
	if (notes) {
		const noteWords = notes.split(/[、,\s]+/).filter((w) => w.length >= 2 && w.length <= 6);
		keywords.push(...noteWords.slice(0, 3));
	}

	// Limit to 10 unique keywords
	return [...new Set(keywords)].slice(0, 10);
}

/**
 * Analyze a reference song and generate analysis.yaml
 *
 * IMPORTANT: This function does NOT access copyrighted content.
 * It generates analysis based on:
 * - core_type patterns (abstracted from general style knowledge)
 * - User-provided metadata (title, artist, genre_tags, notes)
 *
 * All chord progressions are:
 * - Expressed in Roman numerals (functional harmony)
 * - Marked as "estimates" in confidence output
 */
export async function analyzeReferenceSong(
	input: AnalyzeReferenceSongInput,
): Promise<AnalyzeReferenceSongOutput> {
	const config = getConfig();

	// Validate core_type
	const availableTypes = listCoreTypes();
	if (!availableTypes.includes(input.core_type)) {
		throw new Error(
			`Unknown core_type: ${input.core_type}. Available: ${availableTypes.join(", ")}`,
		);
	}

	// Get pattern for this core_type
	const pattern = getCoreTypePattern(input.core_type);

	// Generate ASCII-only slug
	const slug = generateSlug(input.artist, input.title, input.core_type);

	// Build analysis object (all values are abstractions, no copyrighted content)
	const analysis: Analysis = {
		source_song: {
			title: input.title,
			artist: input.artist,
		},
		core_type: input.core_type,
		music_structure: {
			target_length: input.target_length ?? "3min",
			tempo_bpm: estimateTempo(input, pattern.tempoRange),
			key_mode: pattern.keyMode === "both" ? "major" : pattern.keyMode,
			energy_curve: pattern.energyCurve,
			sections: adjustSections(pattern.defaultSections, input.notes),
		},
		chord_progression: {
			notation: "roman_numerals",
			verse: pattern.chordPatterns.verse,
			prechorus: pattern.chordPatterns.prechorus,
			chorus: pattern.chordPatterns.chorus,
			bridge: pattern.chordPatterns.bridge,
		},
		arrangement: {
			genre_tags: input.genre_tags ?? ["Japanese Pop"],
			center: pattern.arrangement.center,
			rhythm: pattern.arrangement.rhythm,
			bass: pattern.arrangement.bass,
			density: pattern.arrangement.density,
			dynamics: pattern.arrangement.dynamics,
			ear_candy: pattern.arrangement.earCandy,
		},
		lyrics_design: {
			language: "ja",
			perspective: pattern.lyricsDesign.perspective,
			scenery: pattern.lyricsDesign.scenery,
			emotion_expression: pattern.lyricsDesign.emotionExpression,
			word_density: pattern.lyricsDesign.wordDensity,
			theme: pattern.typicalThemes.slice(0, 3),
			chorus_hook_rule: {
				repeat_short_phrase: pattern.lyricsDesign.chorusHookRule.includes("repeat_short_phrase"),
				avoid_direct_emotion_words: pattern.lyricsDesign.chorusHookRule.includes(
					"avoid_direct_emotion_words",
				),
			},
		},
		concept_keywords: generateKeywords(pattern.typicalKeywords, input.notes),
	};

	// Write YAML file
	const analysisPath = `analysis/${slug}.yaml`;
	const fullPath = resolveVaultPath(config, analysisPath);
	const yamlContent = stringifyYaml(analysis);
	await writeText(fullPath, yamlContent);

	// Generate preview (first 30 lines)
	const analysisPreview = yamlContent.split("\n").slice(0, 30).join("\n");

	// Generate warnings based on confidence and input
	const warnings: string[] = [
		"chord_progressionはRoman numerals表記の推定値です。実際の曲とは異なる場合があります。",
	];
	if (!input.notes) {
		warnings.push("notesが未指定のため、デフォルトのパターン設定を使用しています。");
	}
	if (!input.genre_tags) {
		warnings.push("genre_tagsが未指定のため、デフォルトの'Japanese Pop'を使用しています。");
	}

	// Suggest next actions
	const nextActions: string[] = [
		`generate_suno_pack({ analysis_path: "${analysisPath}" })`,
		`generate_note_from_analysis({ analysis_path: "${analysisPath}" })`,
	];

	// Determine confidence levels
	// - structure: high (based on well-known patterns)
	// - arrangement: medium (abstracted, may vary)
	// - chords_functional: medium (roman numerals are estimates)
	// - lyrics_design: high (pattern-based abstraction)
	const confidence: Record<string, ConfidenceLevel> = {
		structure: "high",
		arrangement: "medium",
		chords_functional: "medium",
		lyrics_design: input.notes ? "high" : "medium",
	};

	return {
		analysis_path: analysisPath,
		slug,
		confidence: {
			structure: confidence.structure as ConfidenceLevel,
			arrangement: confidence.arrangement as ConfidenceLevel,
			chords_functional: confidence.chords_functional as ConfidenceLevel,
			lyrics_design: confidence.lyrics_design as ConfidenceLevel,
		},
		analysis_preview: analysisPreview,
		warnings,
		next_actions: nextActions,
	};
}
