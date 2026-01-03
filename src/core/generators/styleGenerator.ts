import type { Analysis, Section } from "../../schemas/analysis";
import {
	translateToEnglish,
	translateArray,
	translateChordFeel,
	translateDynamics,
} from "../../utils/translations";

/**
 * Suno v5 Style Prompt Generator
 *
 * Based on suno-vocabulary.md knowledge:
 * - Style of Music field: 200 char limit (Genre + Mood + Instrumentation + Vocal Style + Structure Hints)
 * - Full style prompt: structured sections for detailed control
 * - v5 best practices: top-anchor style, 1-2 word tags, 2-4 instruments
 * - All output MUST be in English for optimal Suno results
 */

/**
 * Generate Suno style prompt from analysis
 * Output format: Structured sections optimized for Suno v5
 */
export function generateStyle(analysis: Analysis): string {
	const sections: string[] = [];

	// Genre section (v5: 2-4 genres max)
	const genres = analysis.arrangement.genre_tags.slice(0, 4);
	sections.push(`Genre:\n${genres.join(", ")}`);

	// Style section - v5 enhanced with mood
	sections.push(generateStyleSection(analysis));

	// Tempo section - v5 vocabulary
	sections.push(generateTempoSection(analysis));

	// Harmony section
	sections.push(generateHarmonySection(analysis));

	// Length / Structure section
	sections.push(generateStructureSection(analysis));

	// Arrangement section - v5 enhanced with instruments
	sections.push(generateArrangementSection(analysis));

	// Vocals section - v5 vocal control
	sections.push(generateVocalsSection(analysis));

	// Lyrics section
	sections.push(generateLyricsSection(analysis));

	return sections.join("\n\n");
}

/**
 * Generate Style section with v5 mood support
 * All output is translated to English
 */
function generateStyleSection(analysis: Analysis): string {
	const lines: string[] = [];

	// Main style description (always in English for Suno)
	const lang = analysis.lyrics_design.language === "ja" ? "Japanese" : "English";
	const dynamics = analysis.arrangement.dynamics ?? "energetic";
	// Translate dynamics if it contains Japanese
	const dynamicsEn = translateDynamics(dynamics);
	lines.push(`${capitalize(dynamicsEn)} ${lang} song.`);

	// Mood (v5 feature)
	if (analysis.arrangement.mood && analysis.arrangement.mood.length > 0) {
		const moodEn = translateArray(analysis.arrangement.mood);
		lines.push(`${moodEn.map(capitalize).join(", ")} mood.`);
	}

	// Energy curve description
	if (analysis.music_structure.energy_curve === "wave") {
		lines.push("Strong contrast between restrained verses and explosive choruses.");
	} else if (analysis.music_structure.energy_curve === "build") {
		lines.push("Continuous build-up toward climactic moments.");
	}

	// Emotion expression
	if (analysis.lyrics_design.emotion_expression) {
		const emotionEn = translateToEnglish(analysis.lyrics_design.emotion_expression);
		lines.push(`${capitalize(emotionEn)} expression.`);
	}

	// Texture (v5 feature)
	if (analysis.arrangement.texture) {
		const textureEn = translateToEnglish(analysis.arrangement.texture);
		lines.push(`${capitalize(textureEn)} texture.`);
	}

	return `Style:\n${lines.join("\n")}`;
}

/**
 * Generate Tempo section with v5 vocabulary
 * Based on suno-vocabulary.md tempo expressions
 */
function generateTempoSection(analysis: Analysis): string {
	const bpm = analysis.music_structure.tempo_bpm;
	const description = getTempoDescription(bpm);
	return `Tempo:\n${description}.`;
}

/**
 * Get tempo description from BPM
 * Aligned with suno-vocabulary.md
 */
function getTempoDescription(bpm: number): string {
	if (bpm < 60) return `Very slow, relaxed tempo (${bpm} BPM)`;
	if (bpm < 80) return `Slow, laid-back tempo (${bpm} BPM)`;
	if (bpm < 100) return `Moderate tempo (${bpm} BPM)`;
	if (bpm < 120) return `Medium tempo, groovy (${bpm} BPM)`;
	if (bpm < 140) return `Upbeat tempo (${bpm} BPM)`;
	if (bpm < 160) return `Fast, driving tempo (${bpm} BPM)`;
	return `Very fast, aggressive tempo (${bpm} BPM)`;
}

/**
 * Generate Harmony section
 * Chord progression feel is translated to English
 */
function generateHarmonySection(analysis: Analysis): string {
	const lines: string[] = [];

	// Key mode
	lines.push(`${capitalize(analysis.music_structure.key_mode)} key.`);

	// Chord progressions
	if (analysis.chord_progression) {
		const cp = analysis.chord_progression;
		if (cp.verse?.pattern) {
			const feel = cp.verse.feel ? `${translateChordFeel(cp.verse.feel)} ` : "";
			lines.push(`Verse: ${feel}(${cp.verse.pattern}).`);
		}
		if (cp.chorus?.pattern) {
			const feel = cp.chorus.feel ? `${translateChordFeel(cp.chorus.feel)} ` : "";
			lines.push(`Chorus: ${feel}(${cp.chorus.pattern}).`);
		}
		if (cp.bridge?.pattern) {
			const feel = cp.bridge.feel ? `${translateChordFeel(cp.bridge.feel)} ` : "";
			lines.push(`Bridge: ${feel}(${cp.bridge.pattern}).`);
		}
	}

	return `Harmony:\n${lines.join("\n")}`;
}

/**
 * Generate Structure section
 */
function generateStructureSection(analysis: Analysis): string {
	const lines: string[] = [];

	// Target length
	const lengthStr = analysis.music_structure.target_length.replace("min", " minutes");
	lines.push(`Aim for about ${lengthStr}.`);

	// Section flow
	lines.push(formatSectionFlow(analysis.music_structure.sections));

	return `Length / Structure:\n${lines.join("\n")}`;
}

/**
 * Format sections array into readable flow
 * Aligned with suno-structure.md
 */
function formatSectionFlow(sections: Section[]): string {
	const sectionMap: Record<Section, string> = {
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
		FinalChorusRepeat: "Final Chorus (repeat)",
		Outro: "Outro",
	};

	const formatted = sections.map((s) => sectionMap[s] ?? s);

	// Group into lines of ~4 sections for readability
	const lines: string[] = [];
	for (let i = 0; i < formatted.length; i += 4) {
		const chunk = formatted.slice(i, i + 4);
		lines.push(chunk.join(" → "));
	}

	return lines.join("\n→ ");
}

/**
 * Generate Arrangement section with v5 instrument support
 * All terms are translated to English
 */
function generateArrangementSection(analysis: Analysis): string {
	const lines: string[] = [];
	const arr = analysis.arrangement;

	// Main instrument (translated)
	if (arr.center) {
		const centerEn = translateToEnglish(arr.center);
		lines.push(`${capitalize(centerEn)}-centered production.`);
	}

	// Instruments (v5: 2-4 recommended, translated)
	if (arr.instruments && arr.instruments.length > 0) {
		const instruments = translateArray(arr.instruments.slice(0, 4));
		lines.push(`Instruments: ${instruments.join(", ")}.`);
	}

	// Rhythm (translated)
	if (arr.rhythm) {
		const rhythmEn = translateToEnglish(arr.rhythm);
		// Avoid duplication like "programmed drums rhythm"
		const rhythmLine =
			rhythmEn.toLowerCase().includes("drum") || rhythmEn.toLowerCase().includes("rhythm")
				? `${capitalize(rhythmEn)}.`
				: `${capitalize(rhythmEn)} rhythm.`;
		lines.push(rhythmLine);
	}

	// Bass (translated)
	if (arr.bass) {
		const bassEn = translateToEnglish(arr.bass);
		// Avoid duplication like "synth bass bass"
		const bassLine = bassEn.toLowerCase().includes("bass")
			? `${capitalize(bassEn)}.`
			: `${capitalize(bassEn)} bass.`;
		lines.push(bassLine);
	}

	// Density - v5 enhanced (translated)
	if (arr.density) {
		const d = arr.density;
		const parts: string[] = [];
		if (d.verse) parts.push(`verse: ${translateToEnglish(d.verse)}`);
		if (d.chorus) parts.push(`chorus: ${translateToEnglish(d.chorus)}`);
		if (d.final) parts.push(`final: ${translateToEnglish(d.final)}`);
		if (parts.length > 0) {
			lines.push(`Density: ${parts.join(", ")}.`);
		}
	}

	// Ear candy (translated)
	if (arr.ear_candy) {
		const earCandyEn = translateToEnglish(arr.ear_candy);
		lines.push(`Ear candy: ${earCandyEn}.`);
	}

	return `Arrangement:\n${lines.join("\n")}`;
}

/**
 * Generate Vocals section - v5 vocal control
 * Based on suno-vocabulary.md vocal modifiers
 */
function generateVocalsSection(analysis: Analysis): string {
	const lines: string[] = [];
	const vocal = analysis.lyrics_design.vocal_style;
	const wordDensity = analysis.lyrics_design.word_density ?? "medium";

	// Gender and range
	if (vocal) {
		const parts: string[] = [];
		if (vocal.gender && vocal.gender !== "unspecified") {
			parts.push(capitalize(vocal.gender));
		}
		if (vocal.range) {
			parts.push(`${vocal.range}-range`);
		}
		if (parts.length > 0) {
			lines.push(`${parts.join(", ")} vocals.`);
		}

		// Character (v5: breathy, powerful, raspy, etc.)
		if (vocal.character && vocal.character.length > 0) {
			lines.push(`${vocal.character.map(capitalize).join(", ")} delivery.`);
		}

		// Techniques (v5: falsetto, vibrato, belting, etc.)
		if (vocal.techniques && vocal.techniques.length > 0) {
			lines.push(`Techniques: ${vocal.techniques.join(", ")}.`);
		}
	}

	// Melody phrasing based on word density
	if (wordDensity === "high") {
		lines.push("Rapid-fire delivery in verses.");
	} else if (wordDensity === "low") {
		lines.push("Spacious phrasing with room to breathe.");
	} else {
		lines.push("Balanced melodic phrasing.");
	}

	// Chorus hook rule
	const hookRule = analysis.lyrics_design.chorus_hook_rule;
	if (hookRule?.repeat_short_phrase) {
		lines.push("Catchy, repeatable chorus hook.");
	}

	return `Vocals:\n${lines.join("\n")}`;
}

/**
 * Generate Lyrics section
 * Themes are translated to English
 */
function generateLyricsSection(analysis: Analysis): string {
	const lines: string[] = [];
	const ld = analysis.lyrics_design;

	// Language
	const lang = ld.language === "ja" ? "Japanese" : ld.language === "en" ? "English" : "Mixed";
	lines.push(`${lang}.`);

	// Perspective (translated)
	if (ld.perspective) {
		const perspectiveEn = translateToEnglish(ld.perspective);
		lines.push(`${capitalize(perspectiveEn)}.`);
	}

	// Theme (translated)
	if (ld.theme && ld.theme.length > 0) {
		const themesEn = translateArray(ld.theme);
		lines.push(`Theme: ${themesEn.join(", ")}.`);
	}

	// Scenery (translated)
	if (ld.scenery) {
		const sceneryEn = translateToEnglish(ld.scenery);
		lines.push(`${capitalize(sceneryEn)} scenery.`);
	}

	// Hook rule: avoid direct emotion
	if (ld.chorus_hook_rule?.avoid_direct_emotion_words) {
		lines.push("Avoid direct emotion words; use imagery instead.");
	}

	return `Lyrics:\n${lines.join("\n")}`;
}

/**
 * Capitalize first letter
 */
function capitalize(str: string): string {
	if (!str) return "";
	return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Get style character count
 */
export function getStyleCharCount(style: string): number {
	return style.length;
}

/**
 * Check if style is within Suno's limit
 * Note: Style of Music field is 200 chars, but full prompt can be longer
 */
export function isStyleWithinLimit(style: string, limit = 1000): boolean {
	return style.length <= limit;
}

/**
 * Generate compact "Style of Music" field (200 char limit for v5)
 * Format: Genre + Mood + Instrumentation + Vocal Style + Structure Hints
 */
export function generateCompactStyle(analysis: Analysis): string {
	const parts: string[] = [];

	// Genres (1-2)
	const genres = analysis.arrangement.genre_tags.slice(0, 2);
	parts.push(genres.join(", "));

	// Mood (1)
	if (analysis.arrangement.mood?.[0]) {
		parts.push(analysis.arrangement.mood[0]);
	}

	// Main instrument
	if (analysis.arrangement.center) {
		parts.push(analysis.arrangement.center);
	}

	// Vocal style
	const vocal = analysis.lyrics_design.vocal_style;
	if (vocal?.gender && vocal.gender !== "unspecified") {
		const vocalDesc = vocal.character?.[0]
			? `${vocal.gender} ${vocal.character[0]} vocals`
			: `${vocal.gender} vocals`;
		parts.push(vocalDesc);
	}

	// Structure hint
	if (analysis.music_structure.energy_curve === "build") {
		parts.push("big chorus");
	}

	const result = parts.join(", ");

	// Warn if over limit
	if (result.length > 200) {
		console.warn(`Compact style exceeds 200 chars: ${result.length}`);
	}

	return result;
}
