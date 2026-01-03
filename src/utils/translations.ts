/**
 * Japanese to English translations for Suno output
 * This ensures all Suno prompts are in English for optimal results
 */

/**
 * Common Japanese music terms to English
 */
const MUSIC_TERMS: Record<string, string> = {
	// Instruments
	ピアノ: "piano",
	シンセ: "synth",
	ギター: "guitar",
	アコギ: "acoustic guitar",
	エレキ: "electric guitar",
	ベース: "bass",
	ドラム: "drums",
	ストリングス: "strings",
	オーケストラ: "orchestra",
	ブラス: "brass",
	"808ベース": "808 bass",
	"808": "808",
	打ち込み: "programmed ",
	生: "live",
	シンセベース: "synth bass",
	シンセアルペジオ: "synth arpeggio",

	// Effects and techniques
	ボーカルチョップ: "vocal chop",
	シンセスタブ: "synth stab",
	グリッチ: "glitch",
	リバーブ: "reverb",
	ディレイ: "delay",
	フィルター: "filter",
	サイドチェイン: "sidechain",
	ハイハット: "hi-hat",
	キック: "kick",
	スネア: "snare",
	アルペジオ: "arpeggio",

	// Dynamics and mood
	サビ: "chorus",
	バース: "verse",
	ブリッジ: "bridge",
	イントロ: "intro",
	アウトロ: "outro",
	ドロップ: "drop",
	ビルドアップ: "buildup",
	軽快: "lively",
	切迫感: "urgency",
	疾走感: "driving energy",

	// Descriptions
	爆発: "explosive",
	解決: "resolution",
	不安定: "unstable",
	安定: "stable",
	上昇: "ascending",
	下降: "descending",
	期待: "anticipation",
	違和感: "unease",
	開放: "release",
	緊張: "tension",
	高密度: "dense",
	低密度: "sparse",
	中密度: "medium density",
	静寂: "silence",
	覚悟: "determination",
	メランコリック: "melancholic",
	ポップ: "pop",

	// Emotion
	語る: "narrate",
	救う: "save",
	救わない: "without salvation",
	宣言: "declaration",
	執着: "obsession",
	焦燥: "anxiety",
	切なさ: "longing",
	届かない: "unreachable",
	苦しさ: "anguish",

	// Concept keywords
	完璧: "perfection",
	嘘: "lies",
	愛されたい: "desire to be loved",
	虚構: "illusion",
	演技: "performance",
	光: "light",
	影: "shadow",
	光と影: "light and shadow",
	孤独: "solitude",
	仮面: "mask",
	本音: "true feelings",
	夜: "night",
	駆ける: "running",
	追いかける: "chasing",
	手を伸ばす: "reaching out",
	希望: "hope",
	絶望: "despair",
	命: "life",
	瀬戸際: "edge",
	呼びかけ: "calling out",

	// Perspective
	一人称: "first person",
	二人称: "second person",
	三人称: "third person",

	// Mood
	明るい: "bright",
	暗い: "dark",
	切ない: "bittersweet",
	熱い: "passionate",
	冷たい: "cold",

	// Structure
	短尺: "short form",
	長尺: "long form",
	ループ: "loop",
	リピート: "repeat",

	// Common phrases
	軽快なのに切迫感がある: "lively yet urgent",
	一瞬の: "momentary ",
	ポップだが少しメランコリックなマイナー感: "pop with a melancholic minor feel",
	命の瀬戸際にいる人への呼びかけ: "calling out to someone on the edge",
	追いかける焦燥: "desperate chase",
	"焦燥、切なさ、届かない苦しさ": "anxiety, longing, unreachable anguish",
	"焦燥, 切なさ, 届かない苦しさ": "anxiety, longing, unreachable anguish",
};

/**
 * Check if string contains Japanese characters
 */
export function containsJapanese(str: string): boolean {
	return /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(str);
}

/**
 * Translate Japanese music terms to English
 * Handles full strings and compound terms
 */
export function translateToEnglish(text: string): string {
	if (!containsJapanese(text)) {
		return text;
	}

	let result = text;

	// Sort by length (longest first) to handle compound terms correctly
	const sortedTerms = Object.entries(MUSIC_TERMS).sort((a, b) => b[0].length - a[0].length);

	for (const [ja, en] of sortedTerms) {
		result = result.replaceAll(ja, en);
	}

	// Clean up common patterns
	result = result
		.replace(/\s*\+\s*/g, " + ")
		.replace(/\s*（/g, " (")
		.replace(/）\s*/g, ")")
		.replace(/、/g, ", ")
		.replace(/。/g, ".")
		// Handle remaining particles and connectors
		.replace(/の/g, " of ")
		.replace(/にいる/g, " at ")
		.replace(/への/g, " to ")
		.replace(/人/g, " person ")
		.replace(/側/g, " perspective")
		// Clean up whitespace
		.replace(/\s+/g, " ")
		.trim();

	return result;
}

/**
 * Translate an array of strings
 */
export function translateArray(items: string[]): string[] {
	return items.map(translateToEnglish);
}

/**
 * Generate English description for chord progression feel
 */
export function translateChordFeel(feel: string): string {
	// Common patterns
	const feelMappings: Record<string, string> = {
		"不安定なマイナーループ、期待と違和感を同時に作る":
			"Unstable minor loop creating both anticipation and unease",
		上昇感を作る: "Creating ascending tension",
		一時的な開放: "Temporary release",
		解決しない: "Without resolution",
		ダーク: "Dark",
		明るい: "Bright",
		ポップだが少しメランコリックなマイナー感: "Pop with a melancholic minor feel",
		上昇する期待感と焦燥: "Rising anticipation and anxiety",
		"一瞬の静寂、覚悟": "Momentary silence, determination",
	};

	// Check for exact match first
	if (feelMappings[feel]) {
		return feelMappings[feel];
	}

	// Otherwise translate terms
	return translateToEnglish(feel);
}

/**
 * Translate dynamics description
 */
export function translateDynamics(dynamics: string): string {
	const dynamicsMappings: Record<string, string> = {
		"サビで爆発させるが、解決はしない": "Explosive choruses without resolution",
		"語るが、救わない": "Narrating without salvation",
		軽快なのに切迫感がある: "Lively yet urgent",
		激しい: "Intense",
		穏やか: "Calm",
		ドラマチック: "Dramatic",
		エネルギッシュ: "Energetic",
	};

	if (dynamicsMappings[dynamics]) {
		return dynamicsMappings[dynamics];
	}

	return translateToEnglish(dynamics);
}

/**
 * Translate concept keywords to English imagery
 */
export function translateConceptKeywords(keywords: string[]): string[] {
	const keywordMappings: Record<string, string> = {
		完璧: "perfection",
		嘘: "deception",
		愛されたい: "longing for love",
		虚構: "facade",
		演技: "act",
		光と影: "light and shadow",
		孤独: "isolation",
		仮面: "mask behind the smile",
		本音: "hidden truth",
		反逆: "rebellion",
		叫び: "scream",
		内省: "introspection",
		葛藤: "inner conflict",
		記憶: "memories",
		別れ: "farewell",
		夏: "summer",
		夜: "night",
		駆ける: "running through",
		追いかける: "chasing",
		手を伸ばす: "reaching out",
		届かない: "unreachable",
		焦燥: "desperation",
		希望: "hope",
		絶望: "despair",
		光: "radiant light",
	};

	return keywords.map((kw) => {
		if (keywordMappings[kw]) {
			return keywordMappings[kw];
		}
		return translateToEnglish(kw);
	});
}
