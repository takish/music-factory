/**
 * Analysis Markdown Parser
 *
 * Parses song analysis markdown files into structured data
 * for use by generate_suno_pack and generate_note tools.
 */

export interface InstrumentEntry {
	part: string;
	instrument: string;
	role: string;
}

export interface ChordSection {
	pattern: string;
	feel: string;
	designIntent?: string;
}

export interface ParsedAnalysis {
	// Frontmatter
	title: string;
	artist: string;
	analyzedAt?: string;

	// Core essence
	essence: string[];

	// Structure
	structure: {
		targetLength: string;
		energyCurve: string;
		sections: string[];
		designIntent: string;
	};

	// Harmony
	chordProgression: {
		key: string;
		keyMode: "major" | "minor";
		sections: Record<string, ChordSection>;
	};

	// Arrangement
	arrangement: {
		genreTags: string[];
		characteristics: string[];
		design: string;
		instruments: InstrumentEntry[];
		density: {
			verse: string;
			chorus: string;
			drop?: string;
			finalChorus: string;
		};
	};

	// Lyrics
	lyricsDesign: {
		language: "ja" | "en" | "mixed";
		perspective: string;
		themes: string[];
		wordDensity: string;
		expressionStyle: string;
		emotionHandling: string;
	};

	// Design insights
	designPoints: string[];
	conceptKeywords: string[];
}

/**
 * Extract YAML frontmatter from markdown
 */
function extractFrontmatter(markdown: string): Record<string, string> {
	const frontmatterMatch = markdown.match(/^---\n([\s\S]*?)\n---/);
	if (!frontmatterMatch?.[1]) return {};

	const frontmatter: Record<string, string> = {};
	const lines = frontmatterMatch[1].split("\n");

	for (const line of lines) {
		const colonIndex = line.indexOf(":");
		if (colonIndex > 0) {
			const key = line.slice(0, colonIndex).trim();
			const value = line.slice(colonIndex + 1).trim();
			frontmatter[key] = value;
		}
	}

	return frontmatter;
}

/**
 * Split markdown into sections by ## headers
 */
function splitIntoSections(markdown: string): Record<string, string> {
	const sections: Record<string, string> = {};

	// Remove frontmatter
	const content = markdown.replace(/^---\n[\s\S]*?\n---\n?/, "");

	// Split by ## headers
	const sectionMatches = content.split(/^## /m);

	for (const section of sectionMatches) {
		if (!section.trim()) continue;

		const newlineIndex = section.indexOf("\n");
		if (newlineIndex === -1) continue;

		const header = section.slice(0, newlineIndex).trim();
		const body = section.slice(newlineIndex + 1).trim();

		// Normalize header (remove parenthetical notes)
		const normalizedHeader = header.replace(/（.*?）|\(.*?\)/g, "").trim();
		sections[normalizedHeader] = body;
	}

	return sections;
}

/**
 * Parse bullet points into array
 */
function parseBulletPoints(text: string): string[] {
	const points: string[] = [];
	const lines = text.split("\n");

	for (const line of lines) {
		const match = line.match(/^[-*]\s+(.+)/);
		if (match?.[1]) {
			points.push(match[1].trim());
		}
	}

	return points;
}

/**
 * Parse numbered list into array
 */
function parseNumberedList(text: string): string[] {
	const items: string[] = [];
	const lines = text.split("\n");

	for (const line of lines) {
		const match = line.match(/^\d+\.\s+(.+)/);
		if (match?.[1]) {
			items.push(match[1].trim());
		}
	}

	return items;
}

/**
 * Extract key-value pairs from bullet points
 */
function parseKeyValueBullets(text: string): Record<string, string> {
	const result: Record<string, string> = {};
	const lines = text.split("\n");

	for (const line of lines) {
		// Match: - **Key**: Value or - **Key**: Value
		const match = line.match(/^[-*]\s+\*\*(.+?)\*\*:\s*(.+)/);
		if (match?.[1] && match[2]) {
			result[match[1].trim()] = match[2].trim();
		}
	}

	return result;
}

/**
 * Extract bold key-value from text
 */
function extractBoldValue(text: string, key: string): string | undefined {
	const regex = new RegExp(`\\*\\*${key}\\*\\*:\\s*(.+)`, "i");
	const match = text.match(regex);
	return match?.[1]?.trim();
}

/**
 * Parse instrument table
 */
function parseInstrumentTable(text: string): InstrumentEntry[] {
	const instruments: InstrumentEntry[] = [];
	const lines = text.split("\n");

	let inTable = false;
	let headerPassed = false;

	for (const line of lines) {
		if (line.includes("|") && line.includes("パート")) {
			inTable = true;
			continue;
		}

		if (inTable && line.match(/^\|[-|]+\|$/)) {
			headerPassed = true;
			continue;
		}

		if (inTable && headerPassed && line.includes("|")) {
			const cells = line
				.split("|")
				.map((c) => c.trim())
				.filter((c) => c);
			if (cells.length >= 3 && cells[0] && cells[1] && cells[2]) {
				instruments.push({
					part: cells[0],
					instrument: cells[1],
					role: cells[2],
				});
			}
		}
	}

	return instruments;
}

/**
 * Parse chord section (### subsections)
 */
function parseChordSections(text: string): Record<string, ChordSection> {
	const sections: Record<string, ChordSection> = {};

	// Split by ### headers
	const subsections = text.split(/^### /m);

	for (const subsection of subsections) {
		if (!subsection.trim()) continue;

		const newlineIndex = subsection.indexOf("\n");
		if (newlineIndex === -1) continue;

		const sectionName = subsection.slice(0, newlineIndex).trim();
		const body = subsection.slice(newlineIndex + 1).trim();

		const kv = parseKeyValueBullets(body);

		sections[sectionName.toLowerCase()] = {
			pattern: kv.パターン || kv.Pattern || "",
			feel: kv.雰囲気 || kv.Feel || "",
			designIntent: kv.設計意図 || kv["Design Intent"],
		};
	}

	return sections;
}

/**
 * Parse density section
 */
function parseDensity(text: string): ParsedAnalysis["arrangement"]["density"] {
	const result: ParsedAnalysis["arrangement"]["density"] = {
		verse: "medium",
		chorus: "high",
		finalChorus: "very high",
	};

	const lines = text.split("\n");
	for (const line of lines) {
		const lower = line.toLowerCase();
		if (lower.includes("verse")) {
			const match = line.match(/[:：]\s*(.+)/);
			if (match?.[1]) result.verse = match[1].trim();
		}
		if (lower.includes("chorus") && !lower.includes("final")) {
			const match = line.match(/[:：]\s*(.+)/);
			if (match?.[1]) result.chorus = match[1].trim();
		}
		if (lower.includes("drop")) {
			const match = line.match(/[:：]\s*(.+)/);
			if (match?.[1]) result.drop = match[1].trim();
		}
		if (lower.includes("final")) {
			const match = line.match(/[:：]\s*(.+)/);
			if (match?.[1]) result.finalChorus = match[1].trim();
		}
	}

	return result;
}

/**
 * Detect key mode from text
 */
function detectKeyMode(text: string): "major" | "minor" {
	const lower = text.toLowerCase();
	if (lower.includes("minor") || lower.includes("マイナー")) {
		return "minor";
	}
	return "major";
}

/**
 * Detect language from text
 */
function detectLanguage(text: string): "ja" | "en" | "mixed" {
	const lower = text.toLowerCase();
	if (lower.includes("mixed") || lower.includes("ミックス")) {
		return "mixed";
	}
	if (lower.includes("english") || lower.includes("英語")) {
		return "en";
	}
	return "ja";
}

/**
 * Parse concept keywords (comma or space separated)
 */
function parseKeywords(text: string): string[] {
	// Remove bullet point if present
	const cleaned = text.replace(/^[-*]\s*/, "").trim();

	// Split by comma, 、, or multiple spaces
	return cleaned
		.split(/[,、]\s*|\s{2,}/)
		.map((k) => k.trim())
		.filter((k) => k.length > 0);
}

/**
 * Main parser function
 */
export function parseAnalysisMarkdown(markdown: string): ParsedAnalysis {
	const frontmatter = extractFrontmatter(markdown);
	const sections = splitIntoSections(markdown);

	// Parse essence section
	const essenceSection = sections.曲の本質 || sections.Essence || "";
	const essence = parseBulletPoints(essenceSection);

	// Parse structure section
	const structureSection = sections["Music Structure"] || sections.曲展開 || "";
	const structureKV = parseKeyValueBullets(structureSection);
	const structureSections = parseNumberedList(structureSection);

	// Parse chord progression
	const chordSection =
		sections["Harmony / Chord Progression"] || sections.Harmony || sections.コード進行 || "";
	const keyText = extractBoldValue(chordSection, "Key") || "";
	const chordSections = parseChordSections(chordSection);

	// Parse arrangement
	const arrangementSection = sections.Arrangement || sections.アレンジ || "";
	const arrangementKV = parseKeyValueBullets(arrangementSection);
	const instruments = parseInstrumentTable(arrangementSection);

	// Parse density from ### 密度設計 subsection
	const densityMatch = arrangementSection.match(/### 密度設計[\s\S]*?(?=###|$)/);
	const density = densityMatch
		? parseDensity(densityMatch[0])
		: {
				verse: arrangementKV.Verse || "medium",
				chorus: arrangementKV.Chorus || "high",
				finalChorus: arrangementKV["Final Chorus"] || "very high",
			};

	// Parse lyrics design
	const lyricsSection = sections["Lyrics Design"] || sections.歌詞設計 || "";
	const lyricsKV = parseKeyValueBullets(lyricsSection);

	// Parse design points
	const designPointsSection = sections.設計のポイント || sections["Design Points"] || "";
	const designPoints = parseBulletPoints(designPointsSection);

	// Parse keywords
	const keywordsSection = sections.概念キーワード || sections["Concept Keywords"] || "";
	const conceptKeywords = parseKeywords(keywordsSection);

	// Extract genre tags from arrangement
	const genreText = arrangementKV.ジャンル || arrangementKV.Genre || "";
	const genreTags = genreText
		.split(/[×x,]/)
		.map((g) => g.trim())
		.filter((g) => g);

	return {
		title: frontmatter.title || "",
		artist: frontmatter.artist || "",
		analyzedAt: frontmatter.analyzed_at,

		essence,

		structure: {
			targetLength:
				structureKV["Target Length"] ||
				extractBoldValue(structureSection, "Target Length") ||
				"~3:00",
			energyCurve:
				structureKV["Energy Curve"] ||
				extractBoldValue(structureSection, "Energy Curve") ||
				"build",
			sections: structureSections,
			designIntent: structureKV.設計意図 || extractBoldValue(structureSection, "設計意図") || "",
		},

		chordProgression: {
			key: keyText.replace(/\s*\(.*\)/, "").trim(),
			keyMode: detectKeyMode(keyText),
			sections: chordSections,
		},

		arrangement: {
			genreTags,
			characteristics: parseBulletPoints(arrangementSection).filter(
				(p) => !p.startsWith("ジャンル") && !p.startsWith("Genre") && !p.includes("|"),
			),
			design: arrangementKV.設計 || arrangementKV.Design || "",
			instruments,
			density,
		},

		lyricsDesign: {
			language: detectLanguage(lyricsKV.言語 || lyricsKV.Language || "ja"),
			perspective: lyricsKV.視点 || lyricsKV.Perspective || "",
			themes: (lyricsKV.主題 || lyricsKV.Themes || "")
				.split(/[、,]/)
				.map((t) => t.trim())
				.filter((t) => t),
			wordDensity: lyricsKV.言語密度 || lyricsKV["Word Density"] || "medium",
			expressionStyle: lyricsKV.断定表現 || lyricsKV["Expression Style"] || "",
			emotionHandling: lyricsKV.感情 || lyricsKV.Emotion || "",
		},

		designPoints,
		conceptKeywords,
	};
}

/**
 * Validate that required fields are present
 */
export function validateParsedAnalysis(parsed: ParsedAnalysis): {
	valid: boolean;
	errors: string[];
} {
	const errors: string[] = [];

	if (!parsed.title) errors.push("title is required in frontmatter");
	if (!parsed.artist) errors.push("artist is required in frontmatter");
	if (parsed.structure.sections.length === 0) {
		errors.push("at least one section is required in Music Structure");
	}

	return {
		valid: errors.length === 0,
		errors,
	};
}
