import { join } from "node:path";
import { generateImagePrompt } from "../core/generators/imagePromptGenerator";
import { generateLyrics } from "../core/generators/lyricsGenerator";
import {
	generateStyle,
	getStyleCharCount,
	isStyleWithinLimit,
} from "../core/generators/styleGenerator";
import { type Analysis, analysisSchema } from "../schemas/analysis";
import type { GenerateSunoPackInput, GenerateSunoPackOutput } from "../schemas/output";
import { extractSlug, getConfig, resolveVaultPath } from "../utils/config";
import { readYaml, writeText } from "../utils/fileIO";

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
 * Generate Suno pack from analysis
 */
export async function generateSunoPack(
	input: GenerateSunoPackInput,
): Promise<GenerateSunoPackOutput> {
	const config = getConfig();

	// Read and validate analysis
	const analysisPath = resolveVaultPath(config, input.analysis_path);
	const rawAnalysis = await readYaml<unknown>(analysisPath);
	const parseResult = analysisSchema.safeParse(rawAnalysis);

	if (!parseResult.success) {
		throw new Error(`Invalid analysis file: ${parseResult.error.message}`);
	}

	const analysis = parseResult.data;
	const slug = extractSlug(input.analysis_path);
	const outputDir = resolveVaultPath(config, "outputs", slug);

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
