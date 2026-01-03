import { requiredSections } from "../../schemas/output";
import { extractSections } from "../generators/lyricsGenerator";
import { getStyleCharCount, isStyleWithinLimit } from "../generators/styleGenerator";

export interface StyleLengthCheck {
	ok: boolean;
	chars: number;
	limit: 1000;
}

export interface LyricsSectionsCheck {
	ok: boolean;
	found: string[];
	required: string[];
}

export interface StructureCompleteCheck {
	ok: boolean;
	missing: string[];
}

export interface ValidationResult {
	valid: boolean;
	checks: {
		style_length: StyleLengthCheck;
		lyrics_sections: LyricsSectionsCheck;
		structure_complete: StructureCompleteCheck;
	};
}

/**
 * Validate style length (1000 char limit)
 */
export function validateStyleLength(style: string): StyleLengthCheck {
	const chars = getStyleCharCount(style);
	return {
		ok: isStyleWithinLimit(style),
		chars,
		limit: 1000,
	};
}

/**
 * Validate lyrics sections
 */
export function validateLyricsSections(lyrics: string): LyricsSectionsCheck {
	const found = extractSections(lyrics);
	const required = [...requiredSections];

	// Check if all required sections are present
	const missingRequired = required.filter((r) => !found.some((f) => f.includes(r)));
	const ok = missingRequired.length === 0;

	return {
		ok,
		found,
		required,
	};
}

/**
 * Validate 3-minute structure completeness
 */
export function validateStructureComplete(lyrics: string): StructureCompleteCheck {
	const found = extractSections(lyrics);

	// Critical sections for 3min structure
	const criticalSections = [
		"Verse 1",
		"Verse 2",
		"Chorus",
		"Instrumental",
		"Bridge",
		"Final Chorus",
	];

	const missing = criticalSections.filter((s) => !found.some((f) => f.includes(s)));

	return {
		ok: missing.length === 0,
		missing,
	};
}

/**
 * Full validation of Suno pack
 */
export function validateSunoPack(style: string, lyrics: string): ValidationResult {
	const styleLength = validateStyleLength(style);
	const lyricsSections = validateLyricsSections(lyrics);
	const structureComplete = validateStructureComplete(lyrics);

	const valid = styleLength.ok && lyricsSections.ok && structureComplete.ok;

	return {
		valid,
		checks: {
			style_length: styleLength,
			lyrics_sections: lyricsSections,
			structure_complete: structureComplete,
		},
	};
}
