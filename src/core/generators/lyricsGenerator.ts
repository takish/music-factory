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
	FinalChorusRepeat: "Final Chorus",
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
 * Generate lyrics template with section markers and guidance
 * This generates a structured template that can be:
 * 1. Used directly with Suno (with placeholder guidance)
 * 2. Filled in manually
 * 3. Used as input for LLM-based lyrics generation
 */
export function generateLyrics(analysis: Analysis): string {
	const sections = ensureFullStructure(analysis.music_structure.sections);
	const lines: string[] = [];
	const lang = analysis.lyrics_design.language;
	const themes = analysis.lyrics_design.theme ?? [];
	const perspective = analysis.lyrics_design.perspective ?? "first_person";
	const wordDensity = analysis.lyrics_design.word_density ?? "medium";

	// Add header comment with guidance
	lines.push("# Lyrics Template");
	lines.push(`# Language: ${lang === "ja" ? "Japanese" : "English"}`);
	lines.push(`# Perspective: ${perspective}`);
	lines.push(`# Themes: ${themes.join(", ") || "unspecified"}`);
	lines.push(`# Word Density: ${wordDensity}`);
	lines.push("");

	let verseCount = 0;
	let chorusCount = 0;

	for (const section of sections) {
		const sectionName = SECTION_MAP[section];
		lines.push(`[${sectionName}]`);

		// Generate appropriate placeholder/guidance for each section type
		const content = getSectionContent(section, analysis, {
			verseCount: section.startsWith("Verse") ? ++verseCount : verseCount,
			chorusCount: section.includes("Chorus") ? ++chorusCount : chorusCount,
		});

		lines.push(content);
		lines.push("");
	}

	return lines.join("\n").trim();
}

interface SectionContext {
	verseCount: number;
	chorusCount: number;
}

/**
 * Get content/placeholder for a section based on analysis
 */
function getSectionContent(section: Section, analysis: Analysis, context: SectionContext): string {
	const lang = analysis.lyrics_design.language;
	const themes = analysis.lyrics_design.theme ?? [];
	const themeStr = themes.slice(0, 2).join("、");
	const wordDensity = analysis.lyrics_design.word_density ?? "medium";
	const hookRule = analysis.lyrics_design.chorus_hook_rule;

	// Determine line count based on word density
	const lineCount = wordDensity === "high" ? 6 : wordDensity === "low" ? 3 : 4;

	switch (section) {
		case "Intro":
			return lang === "ja" ? "（楽器のみ / ボーカルなし）" : "(Instrumental intro / No vocals)";

		case "Verse1":
			return generateVersePlaceholder(1, lang, themeStr, lineCount, "setup");

		case "Verse2":
			return generateVersePlaceholder(2, lang, themeStr, lineCount, "development");

		case "PreChorus":
			return lang === "ja"
				? `（${themeStr}への気持ちが高まる）\n（サビへの期待を煽る ${lineCount - 2}〜${lineCount}行）`
				: `(Building anticipation toward chorus)\n(${lineCount - 2}-${lineCount} lines of rising tension)`;

		case "Chorus":
		case "FinalChorus":
		case "FinalChorusRepeat":
			return generateChorusPlaceholder(
				lang,
				hookRule,
				section === "FinalChorus" || section === "FinalChorusRepeat",
			);

		case "PostChorus":
			return lang === "ja"
				? "（余韻 / ハミング / 短いフレーズの繰り返し）"
				: "(Lingering / Humming / Short phrase repetition)";

		case "Instrumental":
			return lang === "ja"
				? "（間奏 / ギターソロ or シンセブレイク）\n（Drop / Vocal chop も可）"
				: "(Instrumental break / Guitar solo or Synth break)\n(Drop / Vocal chop optional)";

		case "Bridge":
			return generateBridgePlaceholder(lang, analysis.lyrics_design.emotion_expression);

		case "Outro":
			return lang === "ja"
				? "（フェードアウト / 最後の一言 / 息を吸う音）"
				: "(Fade out / Final word / Breath sound)";

		default:
			return "";
	}
}

/**
 * Generate verse placeholder with guidance
 */
function generateVersePlaceholder(
	verseNum: number,
	lang: string,
	themeStr: string,
	lineCount: number,
	role: "setup" | "development",
): string {
	if (lang === "ja") {
		const roleDesc = role === "setup" ? "状況設定・導入" : "展開・深掘り";
		return `（${roleDesc}）\n（${themeStr}を描写する ${lineCount}行）\n\n# TODO: ここに日本語歌詞を記入\n# 例:\n# 朝から晩まで\n# 同じ顔して\n# 決められたルール\n# 守ってばかり`;
	}
	const roleDesc =
		role === "setup" ? "Scene setting / Introduction" : "Development / Deeper exploration";
	return `(${roleDesc})\n(${lineCount} lines describing ${themeStr})\n\n# TODO: Write lyrics here`;
}

/**
 * Generate chorus placeholder with guidance
 */
function generateChorusPlaceholder(
	lang: string,
	hookRule: Analysis["lyrics_design"]["chorus_hook_rule"],
	isFinal: boolean,
): string {
	const lines: string[] = [];

	if (lang === "ja") {
		if (isFinal) {
			lines.push("（クライマックス / 最も感情的な瞬間）");
		}
		lines.push("（キャッチーなフック / 繰り返し可能なフレーズ）");

		if (hookRule?.repeat_short_phrase) {
			lines.push("（短いフレーズを繰り返す）");
		}
		if (hookRule?.avoid_direct_emotion_words) {
			lines.push("（直接的な感情語を避け、イメージで表現）");
		}

		lines.push("");
		lines.push("# TODO: ここにサビの歌詞を記入");
		lines.push("# 例:");
		lines.push("# 愛して 愛して");
		lines.push("# 私だけを見て");
		lines.push("# 本当のことは");
		lines.push("# 聞かなくていい");
	} else {
		if (isFinal) {
			lines.push("(Climax / Most emotional moment)");
		}
		lines.push("(Catchy hook / Repeatable phrase)");
		lines.push("");
		lines.push("# TODO: Write chorus lyrics here");
	}

	return lines.join("\n");
}

/**
 * Generate bridge placeholder with guidance
 */
function generateBridgePlaceholder(lang: string, emotionExpression?: string): string {
	if (lang === "ja") {
		const emotion = emotionExpression ?? "転換";
		return `（${emotion} / 視点の変化 / 本音）\n（2〜4行の短いセクション）\n\n# TODO: ここにブリッジの歌詞を記入`;
	}
	return "(Perspective shift / Revelation / Key change)\n(2-4 lines, short section)\n\n# TODO: Write bridge lyrics here";
}

/**
 * Ensure the structure includes all necessary sections for target length
 */
function ensureFullStructure(sections: Section[]): Section[] {
	// If sections are minimal, expand to default 3min structure
	if (sections.length < 8) {
		return DEFAULT_3MIN_SECTIONS;
	}

	// Ensure we have key sections
	const required: Section[] = ["Verse2", "Instrumental", "Bridge", "FinalChorus"];
	const missing = required.filter((s) => !sections.includes(s));

	if (missing.length > 0) {
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

/**
 * Check if lyrics have all required sections
 */
export function hasRequiredSections(lyrics: string): boolean {
	const sections = extractSections(lyrics);
	const required = ["Verse 1", "Chorus", "Bridge", "Final Chorus"];
	return required.every((r) => sections.some((s) => s.includes(r.replace(" ", "")) || s === r));
}
