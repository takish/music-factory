import type { Section } from "../../schemas/analysis";

/**
 * Core type pattern definitions
 * Each pattern is an abstraction for a specific artist/style
 */

export interface ChordPattern {
	feel: string;
	pattern: string; // Roman numeral notation
}

export interface DensityPattern {
	verse: string;
	chorus: string;
	final: string;
}

export interface CoreTypePattern {
	name: string;
	description: string;
	// Structure
	defaultSections: Section[];
	tempoRange: { min: number; max: number; typical: number };
	keyMode: "major" | "minor" | "both";
	energyCurve: "flat" | "build" | "wave";
	// Chords (functional, roman numerals)
	chordPatterns: {
		verse: ChordPattern;
		prechorus: ChordPattern;
		chorus: ChordPattern;
		bridge: ChordPattern;
	};
	// Arrangement
	arrangement: {
		center: string;
		rhythm: string;
		bass: string;
		density: DensityPattern;
		dynamics: string;
		earCandy: string;
	};
	// Lyrics
	lyricsDesign: {
		perspective: string;
		scenery: string;
		emotionExpression: string;
		wordDensity: string;
		chorusHookRule: string[];
	};
	// Typical themes
	typicalThemes: string[];
	typicalKeywords: string[];
}

/**
 * Pattern dictionary by core_type
 */
export const CORE_TYPE_PATTERNS: Record<string, CoreTypePattern> = {
	yorushika: {
		name: "yorushika",
		description: "ヨルシカ風の文学的なJ-Rock/Alternative Pop",
		defaultSections: [
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
			"Outro",
		],
		tempoRange: { min: 80, max: 130, typical: 95 },
		keyMode: "major",
		energyCurve: "flat",
		chordPatterns: {
			verse: { feel: "stable, gentle", pattern: "I - V - vi - IV" },
			prechorus: { feel: "slight lift", pattern: "IV - V - iii - vi" },
			chorus: { feel: "restrained lift", pattern: "I - V - IV - I" },
			bridge: { feel: "brief contrast", pattern: "vi - IV - I - V" },
		},
		arrangement: {
			center: "acoustic guitar",
			rhythm: "light",
			bass: "minimal",
			density: { verse: "low", chorus: "medium", final: "medium" },
			dynamics: "restrained",
			earCandy: "subtle string swells",
		},
		lyricsDesign: {
			perspective: "first_person",
			scenery: "rich",
			emotionExpression: "indirect",
			wordDensity: "medium",
			chorusHookRule: ["repeat_short_phrase", "avoid_direct_emotion_words"],
		},
		typicalThemes: ["memory", "time", "distance", "youth", "seasons"],
		typicalKeywords: ["夏", "空", "風", "光", "余韻", "窓", "夕暮れ"],
	},

	illit: {
		name: "illit",
		description: "ILLIT風のキュートでミニマルなK-Pop",
		defaultSections: [
			"Intro",
			"Verse1",
			"PreChorus",
			"Chorus",
			"PostChorus",
			"Verse2",
			"PreChorus",
			"Chorus",
			"PostChorus",
			"Bridge",
			"FinalChorus",
			"FinalChorusRepeat",
			"Outro",
		],
		tempoRange: { min: 100, max: 130, typical: 115 },
		keyMode: "major",
		energyCurve: "wave",
		chordPatterns: {
			verse: { feel: "airy, minimal", pattern: "I - V - vi - IV" },
			prechorus: { feel: "building tension", pattern: "IV - V - vi - I" },
			chorus: { feel: "catchy loop", pattern: "I - IV - vi - V" },
			bridge: { feel: "soft drop", pattern: "vi - IV - I - V" },
		},
		arrangement: {
			center: "soft synth pads",
			rhythm: "minimal 808",
			bass: "soft sub bass",
			density: { verse: "low", chorus: "medium", final: "medium-high" },
			dynamics: "consistent groove",
			earCandy: "sparkles, blips, whisper layers",
		},
		lyricsDesign: {
			perspective: "first_person",
			scenery: "minimal",
			emotionExpression: "direct but light",
			wordDensity: "low",
			chorusHookRule: ["ultra_catchy_phrase", "heavy_repetition", "onomatopoeia_welcome"],
		},
		typicalThemes: ["crush", "confidence", "playful mood"],
		typicalKeywords: ["heart", "dream", "shine", "cute", "butterfly"],
	},

	yoasobi: {
		name: "yoasobi",
		description: "YOASOBI風のストーリーテリングPop",
		defaultSections: [
			"Intro",
			"Verse1",
			"PreChorus",
			"Chorus",
			"Verse2",
			"PreChorus",
			"Chorus",
			"Bridge",
			"Instrumental",
			"FinalChorus",
			"FinalChorusRepeat",
			"Outro",
		],
		tempoRange: { min: 120, max: 180, typical: 150 },
		keyMode: "minor",
		energyCurve: "build",
		chordPatterns: {
			verse: { feel: "driving, tense", pattern: "i - VI - III - VII" },
			prechorus: { feel: "ascending", pattern: "iv - V - i - VII" },
			chorus: { feel: "explosive release", pattern: "i - VII - VI - V" },
			bridge: { feel: "dramatic shift", pattern: "VI - VII - i - V" },
		},
		arrangement: {
			center: "piano + synth",
			rhythm: "driving electronic",
			bass: "punchy synth bass",
			density: { verse: "medium", chorus: "high", final: "very high" },
			dynamics: "dramatic builds",
			earCandy: "piano runs, synth stabs",
		},
		lyricsDesign: {
			perspective: "first_person",
			scenery: "narrative",
			emotionExpression: "dramatic",
			wordDensity: "high",
			chorusHookRule: ["title_in_hook", "emotional_climax", "fast_syllables"],
		},
		typicalThemes: ["story", "fate", "night", "running", "dreams"],
		typicalKeywords: ["夜", "走る", "光", "明日", "物語", "瞬間"],
	},

	aimyon: {
		name: "aimyon",
		description: "あいみょん風の素直なアコースティックPop",
		defaultSections: [
			"Intro",
			"Verse1",
			"Verse2",
			"Chorus",
			"Verse1",
			"Verse2",
			"Chorus",
			"Bridge",
			"FinalChorus",
			"Outro",
		],
		tempoRange: { min: 70, max: 110, typical: 90 },
		keyMode: "major",
		energyCurve: "flat",
		chordPatterns: {
			verse: { feel: "warm, stable", pattern: "I - V - vi - IV" },
			prechorus: { feel: "gentle lift", pattern: "IV - I - V - vi" },
			chorus: { feel: "emotional but grounded", pattern: "I - V - IV - I" },
			bridge: { feel: "brief reflection", pattern: "vi - IV - V - I" },
		},
		arrangement: {
			center: "acoustic guitar",
			rhythm: "gentle strumming",
			bass: "warm, supportive",
			density: { verse: "low", chorus: "medium", final: "medium" },
			dynamics: "understated",
			earCandy: "subtle piano fills",
		},
		lyricsDesign: {
			perspective: "first_person",
			scenery: "minimal",
			emotionExpression: "direct, honest",
			wordDensity: "medium",
			chorusHookRule: ["simple_phrase", "relatable_emotion", "no_excessive_drama"],
		},
		typicalThemes: ["love", "everyday life", "nostalgia", "simple happiness"],
		typicalKeywords: ["君", "愛", "日々", "心", "笑顔", "花"],
	},

	gurenka: {
		name: "gurenka",
		description: "紅蓮華風のアニメロック（LiSA系）",
		defaultSections: [
			"Intro",
			"Verse1",
			"PreChorus",
			"Chorus",
			"Verse2",
			"PreChorus",
			"Chorus",
			"Instrumental",
			"Bridge",
			"FinalChorus",
			"FinalChorusRepeat",
			"Outro",
		],
		tempoRange: { min: 140, max: 180, typical: 160 },
		keyMode: "minor",
		energyCurve: "build",
		chordPatterns: {
			verse: { feel: "tension building", pattern: "i - VII - VI - VII" },
			prechorus: { feel: "ascending power", pattern: "VI - VII - i - V" },
			chorus: { feel: "explosive power", pattern: "i - VI - III - VII" },
			bridge: { feel: "emotional peak", pattern: "VI - VII - i" },
		},
		arrangement: {
			center: "distorted guitar",
			rhythm: "driving rock drums",
			bass: "heavy, aggressive",
			density: { verse: "medium", chorus: "high", final: "very high" },
			dynamics: "explosive",
			earCandy: "guitar riffs, drum fills",
		},
		lyricsDesign: {
			perspective: "first_person",
			scenery: "battle/struggle imagery",
			emotionExpression: "intense, passionate",
			wordDensity: "high",
			chorusHookRule: ["powerful_declaration", "title_repetition", "screaming_ok"],
		},
		typicalThemes: ["battle", "determination", "fate", "fire", "strength"],
		typicalKeywords: ["炎", "戦い", "運命", "強さ", "立ち上がる", "心"],
	},

	byoushin: {
		name: "byoushin",
		description: "病身（びょうしん）系の鬱ロック・感傷的ボカロ",
		defaultSections: [
			"Intro",
			"Verse1",
			"Verse2",
			"Chorus",
			"Verse1",
			"Verse2",
			"Chorus",
			"Instrumental",
			"Bridge",
			"FinalChorus",
			"Outro",
		],
		tempoRange: { min: 120, max: 160, typical: 140 },
		keyMode: "minor",
		energyCurve: "wave",
		chordPatterns: {
			verse: { feel: "melancholic loop", pattern: "i - VI - III - VII" },
			prechorus: { feel: "building despair", pattern: "iv - V - i - VII" },
			chorus: { feel: "cathartic release", pattern: "i - VII - VI - VII" },
			bridge: { feel: "introspective", pattern: "VI - iv - V - i" },
		},
		arrangement: {
			center: "clean/distorted guitar mix",
			rhythm: "syncopated, anxious",
			bass: "driving, dark",
			density: { verse: "medium", chorus: "high", final: "high" },
			dynamics: "emotional waves",
			earCandy: "glitch effects, reverse sounds",
		},
		lyricsDesign: {
			perspective: "first_person",
			scenery: "internal/abstract",
			emotionExpression: "raw, vulnerable",
			wordDensity: "high",
			chorusHookRule: ["repetitive_phrase", "self_deprecating_ok", "ironic_tone"],
		},
		typicalThemes: ["anxiety", "self-doubt", "isolation", "irony", "longing"],
		typicalKeywords: ["痛い", "消えたい", "嘘", "夜", "涙", "孤独"],
	},
};

/**
 * Get pattern by core_type, fallback to yorushika if not found
 */
export function getCoreTypePattern(coreType: string): CoreTypePattern {
	const pattern = CORE_TYPE_PATTERNS[coreType];
	if (pattern) {
		return pattern;
	}
	// Fallback to yorushika pattern
	const fallback = CORE_TYPE_PATTERNS.yorushika;
	if (!fallback) {
		throw new Error("Default pattern 'yorushika' not found");
	}
	return fallback;
}

/**
 * List available core types
 */
export function listCoreTypes(): string[] {
	return Object.keys(CORE_TYPE_PATTERNS);
}
