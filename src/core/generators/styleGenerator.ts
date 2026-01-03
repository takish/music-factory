import type { Analysis } from "../../schemas/analysis";

/**
 * Generate Suno style prompt from analysis
 * Output format: Structured sections (Genre, Style, Tempo, Harmony, etc.)
 */
export function generateStyle(analysis: Analysis): string {
	const sections: string[] = [];

	// Genre section
	sections.push(`Genre:\n${analysis.arrangement.genre_tags.join(", ")}`);

	// Style section
	const styleLines: string[] = [];
	if (analysis.arrangement.dynamics) {
		styleLines.push(`${capitalize(analysis.arrangement.dynamics)} Japanese song.`);
	}
	if (analysis.lyrics_design.emotion_expression) {
		styleLines.push(`${capitalize(analysis.lyrics_design.emotion_expression)} expression.`);
	}
	if (analysis.music_structure.energy_curve === "wave") {
		styleLines.push("Strong contrast between restrained verses and explosive choruses.");
	} else if (analysis.music_structure.energy_curve === "build") {
		styleLines.push("Continuous build-up toward climactic moments.");
	}
	sections.push(`Style:\n${styleLines.join("\n")}`);

	// Tempo section
	const tempoDescription = getTempoDescription(analysis.music_structure.tempo_bpm);
	sections.push(`Tempo:\n${tempoDescription} (${analysis.music_structure.tempo_bpm} BPM).`);

	// Harmony section
	const harmonyLines: string[] = [];
	harmonyLines.push(`${capitalize(analysis.music_structure.key_mode)} key.`);
	if (analysis.chord_progression) {
		if (analysis.chord_progression.verse?.pattern) {
			harmonyLines.push(
				`Verse: ${analysis.chord_progression.verse.feel ?? ""} (${analysis.chord_progression.verse.pattern}).`,
			);
		}
		if (analysis.chord_progression.chorus?.pattern) {
			harmonyLines.push(
				`Chorus: ${analysis.chord_progression.chorus.feel ?? ""} (${analysis.chord_progression.chorus.pattern}).`,
			);
		}
		if (analysis.chord_progression.bridge?.pattern) {
			harmonyLines.push(
				`Bridge: ${analysis.chord_progression.bridge.feel ?? ""} (${analysis.chord_progression.bridge.pattern}).`,
			);
		}
	}
	sections.push(`Harmony:\n${harmonyLines.join("\n")}`);

	// Length / Structure section
	const structureLines: string[] = [];
	structureLines.push(
		`Aim for about ${analysis.music_structure.target_length.replace("min", " minutes")}.`,
	);
	structureLines.push(formatSections(analysis.music_structure.sections));
	sections.push(`Length / Structure:\n${structureLines.join("\n")}`);

	// Arrangement section
	const arrangementLines: string[] = [];
	if (analysis.arrangement.center) {
		arrangementLines.push(`${capitalize(analysis.arrangement.center)} centered.`);
	}
	if (analysis.arrangement.rhythm) {
		arrangementLines.push(`${capitalize(analysis.arrangement.rhythm)}.`);
	}
	if (analysis.arrangement.bass) {
		arrangementLines.push(`${capitalize(analysis.arrangement.bass)}.`);
	}
	if (analysis.arrangement.density) {
		const density = analysis.arrangement.density;
		arrangementLines.push(
			`Density: verse ${density.verse}, chorus ${density.chorus}, final ${density.final}.`,
		);
	}
	if (analysis.arrangement.ear_candy) {
		arrangementLines.push(`Ear candy: ${analysis.arrangement.ear_candy}.`);
	}
	sections.push(`Arrangement:\n${arrangementLines.join("\n")}`);

	// Melody section
	const melodyLines: string[] = [];
	if (analysis.lyrics_design.word_density === "high") {
		melodyLines.push("Rapid-fire delivery in verses.");
	} else if (analysis.lyrics_design.word_density === "low") {
		melodyLines.push("Spacious phrasing with room to breathe.");
	} else {
		melodyLines.push("Balanced melodic phrasing.");
	}
	if (analysis.lyrics_design.chorus_hook_rule?.repeat_short_phrase) {
		melodyLines.push("Chorus should be catchy and repeatable.");
	}
	sections.push(`Melody:\n${melodyLines.join("\n")}`);

	// Lyrics section
	const lyricsLines: string[] = [];
	const lang = analysis.lyrics_design.language === "ja" ? "Japanese" : "English";
	lyricsLines.push(`${lang}.`);
	if (analysis.lyrics_design.perspective) {
		lyricsLines.push(`${capitalize(analysis.lyrics_design.perspective)}.`);
	}
	if (analysis.lyrics_design.theme && analysis.lyrics_design.theme.length > 0) {
		lyricsLines.push(`Theme: ${analysis.lyrics_design.theme.join(", ")}.`);
	}
	if (analysis.lyrics_design.scenery) {
		lyricsLines.push(`${capitalize(analysis.lyrics_design.scenery)} scenery.`);
	}
	if (analysis.lyrics_design.chorus_hook_rule?.avoid_direct_emotion_words) {
		lyricsLines.push("Avoid direct emotion words; use imagery instead.");
	}
	sections.push(`Lyrics:\n${lyricsLines.join("\n")}`);

	return sections.join("\n\n");
}

/**
 * Format sections array into readable structure
 */
function formatSections(sections: string[]): string {
	const sectionMap: Record<string, string> = {
		Intro: "Intro",
		Verse1: "Verse1",
		Verse2: "Verse2",
		PreChorus: "Pre-Chorus",
		Chorus: "Chorus",
		PostChorus: "Post-Chorus",
		Instrumental: "Instrumental",
		Bridge: "Bridge",
		FinalChorus: "Final Chorus",
		FinalChorusRepeat: "Final Chorus (repeat)",
		Outro: "Outro",
	};

	const formatted = sections.map((s) => sectionMap[s] ?? s);

	// Group into lines of ~4 sections
	const lines: string[] = [];
	for (let i = 0; i < formatted.length; i += 4) {
		const chunk = formatted.slice(i, i + 4);
		lines.push(chunk.join(" → "));
	}

	return lines.join("\n→ ");
}

/**
 * Get tempo description from BPM
 */
function getTempoDescription(bpm: number): string {
	if (bpm < 80) return "Slow, relaxed tempo";
	if (bpm < 100) return "Moderate tempo";
	if (bpm < 120) return "Upbeat tempo";
	if (bpm < 140) return "Fast tempo";
	if (bpm < 160) return "Driving tempo";
	return "Fast, aggressive tempo";
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
 * Check if style is within limit
 */
export function isStyleWithinLimit(style: string, limit = 1000): boolean {
	return style.length <= limit;
}
