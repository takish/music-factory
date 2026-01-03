import { join } from "node:path";
import { validateSunoPack as validate } from "../core/validators/sunoValidator";
import type { ValidateSunoPackInput, ValidateSunoPackOutput } from "../schemas/output";
import { getConfig, resolveDataPath } from "../utils/config";
import { fileExists, readText } from "../utils/fileIO";

/**
 * Validate an existing Suno pack
 */
export async function validateSunoPack(
	input: ValidateSunoPackInput,
): Promise<ValidateSunoPackOutput> {
	const config = getConfig();
	const outputDir = resolveDataPath(config, input.output_dir);

	// Read files
	const stylePath = join(outputDir, "suno_style.txt");
	const lyricsPath = join(outputDir, "suno_lyrics.txt");

	// Check files exist
	const styleExists = await fileExists(stylePath);
	const lyricsExists = await fileExists(lyricsPath);

	if (!styleExists || !lyricsExists) {
		const missing: string[] = [];
		if (!styleExists) missing.push("suno_style.txt");
		if (!lyricsExists) missing.push("suno_lyrics.txt");

		return {
			valid: false,
			checks: {
				style_length: { ok: false, chars: 0, limit: 1000 },
				lyrics_sections: { ok: false, found: [], required: [] },
				structure_complete: { ok: false, missing: [`Files not found: ${missing.join(", ")}`] },
			},
		};
	}

	const style = await readText(stylePath);
	const lyrics = await readText(lyricsPath);

	return validate(style, lyrics);
}
