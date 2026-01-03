import type { Analysis, Section, VocalStyle } from "../../schemas/analysis";

/**
 * Suno v5 Lyrics Direction Sheet Generator
 *
 * Generates a direction sheet with:
 * - Section markers [Verse 1], [Chorus], etc.
 * - Control tags (powerfully), (building up), etc.
 * - Clear direction for each section
 *
 * The output is a Markdown file that serves as a blueprint
 * for writing actual lyrics.
 */

/**
 * Map internal section names to Suno v5 format
 */
const SECTION_MAP: Record<Section, string> = {
	Intro: "Intro",
	Verse1: "Verse 1",
	Verse2: "Verse 2",
	Verse3: "Verse 3",
	PreChorus: "Pre-Chorus",
	Chorus: "Chorus",
	PostChorus: "Post-Chorus",
	Instrumental: "Instrumental",
	Drop: "Drop",
	Breakdown: "Breakdown",
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
 * Default 4-minute structure sections
 */
const DEFAULT_4MIN_SECTIONS: Section[] = [
	"Intro",
	"Verse1",
	"PreChorus",
	"Chorus",
	"PostChorus",
	"Verse2",
	"PreChorus",
	"Chorus",
	"PostChorus",
	"Instrumental",
	"Bridge",
	"FinalChorus",
	"FinalChorusRepeat",
	"Outro",
];

/**
 * Generate lyrics direction sheet
 */
export function generateLyrics(analysis: Analysis): string {
	const sections = ensureFullStructure(analysis);
	const lines: string[] = [];
	const lang = analysis.lyrics_design.language;
	const themes = analysis.lyrics_design.theme ?? [];
	const perspective = analysis.lyrics_design.perspective ?? "一人称";
	const wordDensity = analysis.lyrics_design.word_density ?? "medium";
	const keywords = analysis.concept_keywords ?? [];

	// Header
	lines.push("# 歌詞ディレクションシート");
	lines.push("");
	lines.push("## 基本設定");
	lines.push(`- **言語**: ${lang === "ja" ? "日本語" : "English"}`);
	lines.push(`- **視点**: ${perspective}`);
	lines.push(`- **テーマ**: ${themes.join("、") || "未指定"}`);
	lines.push(
		`- **言語密度**: ${wordDensity === "high" ? "高（早口）" : wordDensity === "low" ? "低（ゆったり）" : "中"}`,
	);
	lines.push(`- **キーワード**: ${keywords.join("、") || "未指定"}`);
	lines.push("");
	lines.push("---");
	lines.push("");
	lines.push("## Suno用歌詞");
	lines.push("");
	lines.push("以下をコピーしてSunoに貼り付けてください。");
	lines.push("「ここに歌詞」の部分を実際の歌詞に置き換えてください。");
	lines.push("");
	lines.push("```");

	let verseCount = 0;
	let chorusCount = 0;

	for (const section of sections) {
		const sectionName = SECTION_MAP[section];

		// Track counts
		if (section.startsWith("Verse")) verseCount++;
		if (section.includes("Chorus")) chorusCount++;

		// Add section
		lines.push(`[${sectionName}]`);

		// Add control tags and direction
		const content = getSectionContent(section, analysis, verseCount, chorusCount);
		if (content) {
			lines.push(content);
		}
		lines.push("");
	}

	lines.push("```");
	lines.push("");
	lines.push("---");
	lines.push("");
	lines.push("## 各セクションの役割");
	lines.push("");
	lines.push("| セクション | 役割 | 行数目安 |");
	lines.push("|------------|------|----------|");
	lines.push("| Verse 1 | 状況設定・導入 | 4-6行 |");
	lines.push("| Pre-Chorus | サビへの期待を煽る | 2-4行 |");
	lines.push("| Chorus | キャッチーなフック | 4-6行 |");
	lines.push("| Verse 2 | 展開・深掘り | 4-6行 |");
	lines.push("| Bridge | 視点の変化・本音 | 2-4行 |");
	lines.push("| Final Chorus | クライマックス | 4-6行 |");

	return lines.join("\n");
}

/**
 * Get section content with control tags
 */
function getSectionContent(
	section: Section,
	analysis: Analysis,
	verseCount: number,
	chorusCount: number,
): string {
	const themes = analysis.lyrics_design.theme ?? [];
	const themeHint = themes.length > 0 ? themes[0] : "テーマ";

	switch (section) {
		case "Intro":
			return "(instrumental)";

		case "Verse1":
			return `(softly)\nここに歌詞：${themeHint}の導入`;

		case "Verse2":
			return `(building)\nここに歌詞：${themeHint}の展開`;

		case "Verse3":
			return `(intensifying)\nここに歌詞：${themeHint}のクライマックスへ`;

		case "PreChorus":
			return "(building up)\nここに歌詞：サビへの期待";

		case "Chorus":
			return "(powerfully)\nここに歌詞：キャッチーなフック";

		case "PostChorus":
			return "(lingering)\n(humming)";

		case "Instrumental":
			return "(instrumental break)";

		case "Drop":
			return "(bass drop)\n(vocal chop)";

		case "Breakdown":
			return "(sparse arrangement)\n(whispered)";

		case "Bridge": {
			const emotion = analysis.lyrics_design.emotion_expression ?? "本音";
			return `(perspective shift)\nここに歌詞：${emotion}`;
		}

		case "FinalChorus":
			return "(explosive chorus)\nここに歌詞：最も感情的な瞬間";

		case "FinalChorusRepeat":
			return "(ad-libs)\n(harmonies)\nここに歌詞：繰り返し";

		case "Outro":
			return "(fade out)\n(breath)";

		default:
			return "";
	}
}

/**
 * Ensure full structure from analysis
 */
function ensureFullStructure(analysis: Analysis): Section[] {
	const sections = analysis.music_structure.sections;
	const targetLength = analysis.music_structure.target_length;

	if (!sections || sections.length === 0) {
		return targetLength === "4min" || targetLength === "5min"
			? DEFAULT_4MIN_SECTIONS
			: DEFAULT_3MIN_SECTIONS;
	}

	return sections;
}

/**
 * Format vocal style summary
 */
function formatVocalSummary(vocal: VocalStyle): string {
	const parts: string[] = [];
	if (vocal.gender && vocal.gender !== "unspecified") parts.push(vocal.gender);
	if (vocal.range) parts.push(`${vocal.range}-range`);
	if (vocal.character) parts.push(vocal.character.join(", "));
	return parts.join(", ") || "unspecified";
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

/**
 * Count total sections in lyrics
 */
export function countSections(lyrics: string): number {
	return extractSections(lyrics).length;
}
