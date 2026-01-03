import type { Analysis, Section } from "../../schemas/analysis";

/**
 * Map internal section names to Suno-friendly format
 */
const SECTION_MAP: Record<Section, string> = {
	Intro: "Intro",
	Verse1: "Verse 1",
	Verse2: "Verse 2",
	PreChorus: "Pre-Chorus",
	Chorus: "Chorus",
	PostChorus: "Post-Chorus",
	Instrumental: "Instrumental",
	Bridge: "Bridge",
	FinalChorus: "Final Chorus",
	FinalChorusRepeat: "Final Chorus Repeat",
	Outro: "Outro",
};

/**
 * Default 3-minute structure sections
 */
const DEFAULT_3MIN_SECTIONS: Section[] = [
	"Intro",
	"Verse1",
	"PreChorus",
	"Chorus",
	"PostChorus",
	"Verse2",
	"PreChorus",
	"Chorus",
	"Instrumental",
	"Bridge",
	"FinalChorus",
	"FinalChorusRepeat",
	"Outro",
];

/**
 * Generate lyrics template with section markers
 */
export function generateLyrics(analysis: Analysis): string {
	const sections = ensureFullStructure(analysis.music_structure.sections);
	const lines: string[] = [];

	for (const section of sections) {
		const sectionName = SECTION_MAP[section];
		lines.push(`[${sectionName}]`);
		lines.push(getSectionPlaceholder(section, analysis));
		lines.push("");
	}

	return lines.join("\n").trim();
}

/**
 * Ensure the structure includes all necessary sections for 3min target
 */
function ensureFullStructure(sections: Section[]): Section[] {
	// If sections are minimal, expand to default 3min structure
	if (sections.length < 8) {
		return DEFAULT_3MIN_SECTIONS;
	}

	// Ensure we have Verse2, Instrumental, Bridge, FinalChorus
	const required: Section[] = ["Verse2", "Instrumental", "Bridge", "FinalChorus"];
	const missing = required.filter((s) => !sections.includes(s));

	if (missing.length > 0) {
		// Insert missing sections at appropriate positions
		const result = [...sections];

		for (const section of missing) {
			const insertIndex = findInsertPosition(result, section);
			result.splice(insertIndex, 0, section);
		}

		return result;
	}

	return sections;
}

/**
 * Find appropriate position to insert a missing section
 */
function findInsertPosition(sections: Section[], section: Section): number {
	const order = DEFAULT_3MIN_SECTIONS;
	const targetIndex = order.indexOf(section);

	for (let i = sections.length - 1; i >= 0; i--) {
		const currentIndex = order.indexOf(sections[i] as Section);
		if (currentIndex < targetIndex) {
			return i + 1;
		}
	}

	return 0;
}

/**
 * Get placeholder content for a section
 */
function getSectionPlaceholder(section: Section, analysis: Analysis): string {
	const lang = analysis.lyrics_design.language;
	const theme = analysis.lyrics_design.theme?.join(", ") ?? "";

	switch (section) {
		case "Intro":
			return lang === "ja" ? "(ギターのみ)" : "(Guitar intro)";

		case "Verse1":
		case "Verse2":
			return lang === "ja" ? `(${theme}を描写する歌詞)` : `(Lyrics describing ${theme})`;

		case "PreChorus":
			return lang === "ja" ? "(サビへの導入)" : "(Building to chorus)";

		case "Chorus":
		case "FinalChorus":
		case "FinalChorusRepeat":
			return lang === "ja" ? "(キャッチーなフック、繰り返し可)" : "(Catchy hook, repeatable)";

		case "PostChorus":
			return lang === "ja" ? "(余韻、ハミング可)" : "(Lingering, humming ok)";

		case "Instrumental":
			return lang === "ja" ? "(間奏、楽器ソロ)" : "(Instrumental break, solo)";

		case "Bridge":
			return lang === "ja" ? "(転調または視点の変化)" : "(Key change or perspective shift)";

		case "Outro":
			return lang === "ja" ? "(フェードアウト)" : "(Fade out)";

		default:
			return "";
	}
}

/**
 * Extract sections from lyrics text
 */
export function extractSections(lyrics: string): string[] {
	const regex = /\[([^\]]+)\]/g;
	const sections: string[] = [];

	for (const match of lyrics.matchAll(regex)) {
		if (match[1]) {
			sections.push(match[1]);
		}
	}

	return sections;
}
