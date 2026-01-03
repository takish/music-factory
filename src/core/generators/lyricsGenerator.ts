import type { Analysis, Section, VocalStyle } from "../../schemas/analysis";

/**
 * Suno v5 Lyrics Template Generator
 *
 * Based on suno-vocabulary.md and suno-structure.md knowledge:
 * - Section tags: [Verse 1], [Pre-Chorus], [Chorus], etc.
 * - v5 control tags: [Vocal Style: ...], [Energy: ...], [Mood: ...]
 * - Vocal modifiers: (breathy), (powerfully), (whispered verse), etc.
 * - Effects: (breath), (crowd sings), [applause], etc.
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
 * Aligned with suno-structure.md standard pattern (~70% of songs)
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
 * Default 4-minute structure sections (with more repeats)
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
 * Generate lyrics template with v5 section markers and control tags
 */
export function generateLyrics(analysis: Analysis): string {
	const sections = ensureFullStructure(analysis);
	const lines: string[] = [];
	const lang = analysis.lyrics_design.language;
	const themes = analysis.lyrics_design.theme ?? [];
	const perspective = analysis.lyrics_design.perspective ?? "first_person";
	const wordDensity = analysis.lyrics_design.word_density ?? "medium";
	const vocal = analysis.lyrics_design.vocal_style;

	// Header comment with guidance
	lines.push("# Lyrics Template (Suno v5)");
	lines.push(`# Language: ${lang === "ja" ? "Japanese" : "English"}`);
	lines.push(`# Perspective: ${perspective}`);
	lines.push(`# Themes: ${themes.join(", ") || "unspecified"}`);
	lines.push(`# Word Density: ${wordDensity}`);
	if (vocal) {
		lines.push(`# Vocal: ${formatVocalSummary(vocal)}`);
	}
	lines.push("");

	let verseCount = 0;
	let chorusCount = 0;
	let preChorusCount = 0;

	for (const section of sections) {
		const sectionName = SECTION_MAP[section];

		// Track counts
		if (section.startsWith("Verse")) verseCount++;
		if (section.includes("Chorus")) chorusCount++;
		if (section === "PreChorus") preChorusCount++;

		// Add section tag
		lines.push(`[${sectionName}]`);

		// Add v5 control tags for key sections
		const controlTags = getV5ControlTags(section, analysis, chorusCount);
		if (controlTags) {
			lines.push(controlTags);
		}

		// Generate section content/placeholder
		const content = getSectionContent(section, analysis, {
			verseCount,
			chorusCount,
			preChorusCount,
		});
		lines.push(content);
		lines.push("");
	}

	return lines.join("\n").trim();
}

/**
 * Format vocal style summary for header
 */
function formatVocalSummary(vocal: VocalStyle): string {
	const parts: string[] = [];
	if (vocal.gender && vocal.gender !== "unspecified") parts.push(vocal.gender);
	if (vocal.range) parts.push(`${vocal.range}-range`);
	if (vocal.character) parts.push(vocal.character.join(", "));
	return parts.join(", ") || "unspecified";
}

/**
 * Get v5 control tags for specific sections
 * Based on suno-vocabulary.md v5 高度なメタタグ
 */
function getV5ControlTags(
	section: Section,
	analysis: Analysis,
	chorusCount: number,
): string | null {
	const vocal = analysis.lyrics_design.vocal_style;
	const energyCurve = analysis.music_structure.energy_curve;

	switch (section) {
		case "Intro":
			return null; // Intro typically has no vocal tags

		case "Verse1":
			if (vocal?.character?.includes("breathy") || vocal?.character?.includes("soft")) {
				return "[Vocal Style: Soft, intimate]";
			}
			return "[Energy: Low→Medium]";

		case "Verse2":
			return "[Energy: Medium]";

		case "Verse3":
			return "[Energy: Medium→High]";

		case "PreChorus":
			return "(building up)";

		case "Chorus":
			if (chorusCount === 1) {
				return "[Energy: High]\n(powerfully)";
			}
			return "(powerfully)";

		case "PostChorus":
			return "(lingering)";

		case "Instrumental":
			return null;

		case "Drop":
			return "[Energy: Peak]\n(vocal chop)";

		case "Breakdown":
			return "[Energy: Low]\n(sparse arrangement)";

		case "Bridge":
			if (analysis.arrangement.texture) {
				return `[Texture: ${analysis.arrangement.texture}]\n(perspective shift)`;
			}
			return "(perspective shift)";

		case "FinalChorus":
			if (energyCurve === "build") {
				return "[Energy: Peak]\n(explosive chorus)\n[modulate up a key]";
			}
			return "[Energy: Peak]\n(explosive chorus)";

		case "FinalChorusRepeat":
			return "(ad-libs)\n(harmonies)";

		case "Outro":
			return "(fade out)";

		default:
			return null;
	}
}

interface SectionContext {
	verseCount: number;
	chorusCount: number;
	preChorusCount: number;
}

/**
 * Get content/placeholder for a section based on analysis
 */
function getSectionContent(section: Section, analysis: Analysis, context: SectionContext): string {
	const lang = analysis.lyrics_design.language;
	const themes = analysis.lyrics_design.theme ?? [];
	const themeStr = themes.slice(0, 2).join(lang === "ja" ? "、" : ", ");
	const wordDensity = analysis.lyrics_design.word_density ?? "medium";
	const hookRule = analysis.lyrics_design.chorus_hook_rule;

	// Line count based on word density
	const lineCount = wordDensity === "high" ? 6 : wordDensity === "low" ? 3 : 4;

	switch (section) {
		case "Intro":
			return generateIntroContent(lang);

		case "Verse1":
			return generateVerseContent(1, lang, themeStr, lineCount, "setup");

		case "Verse2":
			return generateVerseContent(2, lang, themeStr, lineCount, "development");

		case "Verse3":
			return generateVerseContent(3, lang, themeStr, lineCount, "climax");

		case "PreChorus":
			return generatePreChorusContent(lang, lineCount);

		case "Chorus":
		case "FinalChorus":
		case "FinalChorusRepeat":
			return generateChorusContent(
				lang,
				hookRule,
				section === "FinalChorus" || section === "FinalChorusRepeat",
			);

		case "PostChorus":
			return generatePostChorusContent(lang);

		case "Instrumental":
			return generateInstrumentalContent(lang);

		case "Drop":
			return generateDropContent(lang);

		case "Breakdown":
			return generateBreakdownContent(lang);

		case "Bridge":
			return generateBridgeContent(lang, analysis.lyrics_design.emotion_expression);

		case "Outro":
			return generateOutroContent(lang);

		default:
			return "";
	}
}

/**
 * Generate Intro content
 */
function generateIntroContent(lang: string): string {
	if (lang === "ja") {
		return "（楽器のみ / ボーカルなし）";
	}
	return "(Instrumental / No vocals)";
}

/**
 * Generate Verse content with role-based guidance
 */
function generateVerseContent(
	verseNum: number,
	lang: string,
	themeStr: string,
	lineCount: number,
	role: "setup" | "development" | "climax",
): string {
	const roleMap = {
		setup: { ja: "状況設定・導入", en: "Scene setting, introduction" },
		development: { ja: "展開・深掘り", en: "Development, deeper exploration" },
		climax: { ja: "クライマックスへの布石", en: "Building toward climax" },
	};

	if (lang === "ja") {
		return [
			`（${roleMap[role].ja}）`,
			`（${themeStr || "テーマ"}を描写する ${lineCount}行）`,
			"",
			"# TODO: ここに日本語歌詞を記入",
			"# 1行 = 1フレーズ（息継ぎ位置）",
		].join("\n");
	}

	return [
		`(${roleMap[role].en})`,
		`(${lineCount} lines about ${themeStr || "theme"})`,
		"",
		"# TODO: Write lyrics here",
		"# One line = one phrase (breath point)",
	].join("\n");
}

/**
 * Generate Pre-Chorus content
 */
function generatePreChorusContent(lang: string, lineCount: number): string {
	if (lang === "ja") {
		return ["（サビへの期待を煽る）", `（${lineCount - 2}〜${lineCount}行で緊張感を高める）`].join(
			"\n",
		);
	}
	return [
		"(Building anticipation toward chorus)",
		`(${lineCount - 2}-${lineCount} lines of rising tension)`,
	].join("\n");
}

/**
 * Generate Chorus content with hook guidance
 */
function generateChorusContent(
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
		lines.push("# TODO: サビの歌詞");
		lines.push("# 耳に残るフレーズを意識");
	} else {
		if (isFinal) {
			lines.push("(Climax / Most emotional moment)");
		}
		lines.push("(Catchy hook / Repeatable phrase)");
		lines.push("");
		lines.push("# TODO: Write chorus lyrics");
		lines.push("# Focus on memorable hook");
	}

	return lines.join("\n");
}

/**
 * Generate Post-Chorus content
 */
function generatePostChorusContent(lang: string): string {
	if (lang === "ja") {
		return "（余韻 / ハミング / 短いフレーズの繰り返し）\n(humming)";
	}
	return "(Lingering / Humming / Short phrase repetition)\n(humming)";
}

/**
 * Generate Instrumental content
 */
function generateInstrumentalContent(lang: string): string {
	if (lang === "ja") {
		return [
			"（間奏 / ソロ）",
			"# ギターソロ、シンセブレイク、Drop等",
			"# (vocal chop) を入れても可",
		].join("\n");
	}
	return [
		"(Instrumental break / Solo)",
		"# Guitar solo, synth break, drop, etc.",
		"# (vocal chop) optional",
	].join("\n");
}

/**
 * Generate Drop content (EDM style)
 */
function generateDropContent(lang: string): string {
	if (lang === "ja") {
		return ["（ドロップ / ベース強調）", "(bass drop)", "# EDM的な落差・解放感"].join("\n");
	}
	return ["(Drop / Bass emphasis)", "(bass drop)", "# EDM-style release"].join("\n");
}

/**
 * Generate Breakdown content
 */
function generateBreakdownContent(lang: string): string {
	if (lang === "ja") {
		return ["（ブレイクダウン / 密度低下）", "(sparse arrangement)", "# 再構築への準備"].join("\n");
	}
	return [
		"(Breakdown / Reduced density)",
		"(sparse arrangement)",
		"# Preparation for rebuild",
	].join("\n");
}

/**
 * Generate Bridge content
 */
function generateBridgeContent(lang: string, emotionExpression?: string): string {
	if (lang === "ja") {
		const emotion = emotionExpression ?? "転換";
		return [
			`（${emotion} / 視点の変化 / 本音）`,
			"（2〜4行の短いセクション）",
			"",
			"# TODO: ブリッジの歌詞",
			"# 新しい視点や気づきを表現",
		].join("\n");
	}
	return [
		"(Perspective shift / Revelation)",
		"(2-4 lines, short section)",
		"",
		"# TODO: Write bridge lyrics",
		"# New perspective or realization",
	].join("\n");
}

/**
 * Generate Outro content
 */
function generateOutroContent(lang: string): string {
	if (lang === "ja") {
		return ["（フェードアウト / 最後の余韻）", "(breath)", "# または最後の一言"].join("\n");
	}
	return ["(Fade out / Final moment)", "(breath)", "# Or final word"].join("\n");
}

/**
 * Ensure the structure includes all necessary sections for target length
 */
function ensureFullStructure(analysis: Analysis): Section[] {
	const sections = analysis.music_structure.sections;
	const targetLength = analysis.music_structure.target_length;

	// If sections are minimal, use default structure
	if (sections.length < 8) {
		return targetLength === "4min" || targetLength === "5min"
			? DEFAULT_4MIN_SECTIONS
			: DEFAULT_3MIN_SECTIONS;
	}

	// Ensure key sections exist
	const required: Section[] = ["Verse2", "Bridge", "FinalChorus"];
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

/**
 * Count total sections in lyrics
 */
export function countSections(lyrics: string): number {
	return extractSections(lyrics).length;
}
