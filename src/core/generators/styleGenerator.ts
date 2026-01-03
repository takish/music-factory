import type { Analysis } from "../../schemas/analysis";

const MAX_STYLE_LENGTH = 1000;

/**
 * 3-minute song structure template (in bars)
 */
const STRUCTURE_TEMPLATE_3MIN =
	"Intro(8) → Verse1(16) → Pre(8) → Chorus(16) → Post(8) → Verse2(16) → Pre(8) → Chorus(16) → Instrumental(8-16) → Bridge(8) → Final Chorus(16) + Repeat(16) → Outro(8)";

/**
 * Generate Suno style prompt from analysis
 */
export function generateStyle(analysis: Analysis): string {
	const parts: string[] = [];

	// Genre tags (required, first)
	parts.push(`Genre: ${analysis.arrangement.genre_tags.join(", ")}`);

	// Tempo and key
	parts.push(`${analysis.music_structure.tempo_bpm} BPM`);
	parts.push(`${analysis.music_structure.key_mode} key`);

	// Energy curve
	if (analysis.music_structure.energy_curve) {
		parts.push(`${analysis.music_structure.energy_curve} energy`);
	}

	// Arrangement details
	if (analysis.arrangement.center) {
		parts.push(`${analysis.arrangement.center} centered`);
	}
	if (analysis.arrangement.rhythm) {
		parts.push(`${analysis.arrangement.rhythm} rhythm`);
	}
	if (analysis.arrangement.dynamics) {
		parts.push(`${analysis.arrangement.dynamics} dynamics`);
	}

	// Chord progression hints
	if (analysis.chord_progression) {
		if (analysis.chord_progression.verse?.feel) {
			parts.push(`verse: ${analysis.chord_progression.verse.feel}`);
		}
		if (analysis.chord_progression.chorus?.feel) {
			parts.push(`chorus: ${analysis.chord_progression.chorus.feel}`);
		}
	}

	// Lyrics style
	const lang = analysis.lyrics_design.language === "ja" ? "Japanese" : "English";
	parts.push(`${lang} lyrics`);

	if (analysis.lyrics_design.perspective) {
		parts.push(`${analysis.lyrics_design.perspective} perspective`);
	}
	if (analysis.lyrics_design.word_density) {
		parts.push(`${analysis.lyrics_design.word_density} word density`);
	}

	// Structure instruction for 3 minutes
	if (analysis.music_structure.target_length === "3min") {
		parts.push(`Structure: ${STRUCTURE_TEMPLATE_3MIN}`);
	}

	// Join and truncate if needed
	let style = parts.join(", ");

	// Truncate to fit within limit
	if (style.length > MAX_STYLE_LENGTH) {
		style = truncateStyle(style, MAX_STYLE_LENGTH);
	}

	return style;
}

/**
 * Truncate style to fit within character limit
 */
function truncateStyle(style: string, maxLength: number): string {
	if (style.length <= maxLength) {
		return style;
	}

	// Find last comma before limit
	const truncated = style.slice(0, maxLength - 3);
	const lastComma = truncated.lastIndexOf(",");

	if (lastComma > 0) {
		return `${truncated.slice(0, lastComma)}...`;
	}

	return `${truncated}...`;
}

/**
 * Get style character count
 */
export function getStyleCharCount(style: string): number {
	return style.length;
}

/**
 * Check if style is within limit
 */
export function isStyleWithinLimit(style: string): boolean {
	return style.length <= MAX_STYLE_LENGTH;
}
