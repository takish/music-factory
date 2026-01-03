/**
 * Save Song Analysis Tool
 *
 * Saves a song analysis markdown file to the analysis directory.
 * Parses and validates the markdown structure before saving.
 */

import { z } from "zod";
import {
	parseAnalysisMarkdown,
	validateParsedAnalysis,
} from "../core/parsers/analysisMarkdownParser";
import { getConfig, resolveDataPath } from "../utils/config";
import { writeText } from "../utils/fileIO";

/**
 * Input schema for save_song_analysis
 */
export const saveSongAnalysisInputSchema = z.object({
	slug: z
		.string()
		.min(1)
		.regex(/^[a-z0-9_-]+$/, "slug must be lowercase alphanumeric with underscores or hyphens")
		.describe("File name without extension (e.g., 'yoasobi_idol')"),
	markdown: z.string().min(100).describe("Analysis markdown content"),
});

export type SaveSongAnalysisInput = z.infer<typeof saveSongAnalysisInputSchema>;

/**
 * Output schema for save_song_analysis
 */
export interface SaveSongAnalysisOutput {
	analysis_path: string;
	parsed_summary: {
		title: string;
		artist: string;
		key: string;
		key_mode: "major" | "minor";
		sections_count: number;
		keywords_count: number;
	};
	validation: {
		valid: boolean;
		warnings: string[];
	};
	next_actions: string[];
}

/**
 * Save song analysis markdown to file
 */
export async function saveSongAnalysis(
	input: SaveSongAnalysisInput,
): Promise<SaveSongAnalysisOutput> {
	const config = getConfig();

	// Parse the markdown to validate structure
	const parsed = parseAnalysisMarkdown(input.markdown);
	const validation = validateParsedAnalysis(parsed);

	// Generate warnings (non-fatal issues)
	const warnings: string[] = [];

	if (!validation.valid) {
		warnings.push(...validation.errors);
	}

	if (parsed.essence.length === 0) {
		warnings.push("曲の本質セクションが空です");
	}

	if (parsed.conceptKeywords.length === 0) {
		warnings.push("概念キーワードが空です");
	}

	if (parsed.arrangement.instruments.length === 0) {
		warnings.push("楽器構成テーブルが見つかりません");
	}

	if (Object.keys(parsed.chordProgression.sections).length === 0) {
		warnings.push("コード進行セクションが見つかりません");
	}

	// Write the markdown file
	const analysisPath = `analysis/${input.slug}.md`;
	const fullPath = resolveDataPath(config, analysisPath);
	await writeText(fullPath, input.markdown);

	// Build output
	const output: SaveSongAnalysisOutput = {
		analysis_path: analysisPath,
		parsed_summary: {
			title: parsed.title,
			artist: parsed.artist,
			key: parsed.chordProgression.key,
			key_mode: parsed.chordProgression.keyMode,
			sections_count: parsed.structure.sections.length,
			keywords_count: parsed.conceptKeywords.length,
		},
		validation: {
			valid: validation.valid,
			warnings,
		},
		next_actions: [
			`generate_suno_pack({ analysis_path: "${analysisPath}" })`,
			`generate_note_from_analysis({ analysis_path: "${analysisPath}" })`,
		],
	};

	return output;
}
