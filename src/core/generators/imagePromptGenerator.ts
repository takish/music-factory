import type { Analysis } from "../../schemas/analysis";
import {
	translateToEnglish,
	translateDynamics,
	translateConceptKeywords,
} from "../../utils/translations";

/**
 * Generate image prompt for YouTube thumbnail (16:9, no text)
 * All output is in English for optimal image generation
 */
export function generateImagePrompt(analysis: Analysis): string {
	const parts: string[] = [];

	// Base requirements
	parts.push("16:9 aspect ratio");
	parts.push("no text");
	parts.push("no typography");
	parts.push("no letters");

	// Visual style based on genre
	const genreStyle = getVisualStyleFromGenre(analysis.arrangement.genre_tags);
	parts.push(genreStyle);

	// Mood from arrangement (translated)
	if (analysis.arrangement.dynamics) {
		const dynamicsEn = translateDynamics(analysis.arrangement.dynamics);
		parts.push(`${dynamicsEn} atmosphere`);
	}

	// Concept keywords (translated to English imagery)
	if (analysis.concept_keywords && analysis.concept_keywords.length > 0) {
		const keywordsEn = translateConceptKeywords(analysis.concept_keywords);
		parts.push(keywordsEn.join(", "));
	}

	// Theme visualization
	if (analysis.lyrics_design.theme && analysis.lyrics_design.theme.length > 0) {
		const themeVisual = visualizeTheme(analysis.lyrics_design.theme);
		if (themeVisual) {
			parts.push(themeVisual);
		}
	}

	// Scenery if available (translated)
	if (analysis.lyrics_design.scenery) {
		const sceneryEn = translateToEnglish(analysis.lyrics_design.scenery);
		parts.push(sceneryEn);
	}

	// Energy curve visualization
	const energyVisual = visualizeEnergy(analysis.music_structure.energy_curve ?? "flat");
	parts.push(energyVisual);

	// Art style
	parts.push("anime-inspired illustration style");
	parts.push("high quality digital art");
	parts.push("cinematic composition");

	return parts.join(", ");
}

/**
 * Get visual style from genre tags
 */
function getVisualStyleFromGenre(genreTags: string[]): string {
	const genreStr = genreTags.join(" ").toLowerCase();

	if (genreStr.includes("rock") || genreStr.includes("alternative")) {
		return "urban nightscape, city lights, moody lighting";
	}

	if (genreStr.includes("pop") && genreStr.includes("k-pop")) {
		return "bright pastel colors, modern aesthetic, soft glow";
	}

	if (genreStr.includes("indie")) {
		return "nostalgic film grain, warm tones, golden hour light";
	}

	if (genreStr.includes("ballad")) {
		return "soft focus, dreamy atmosphere, ethereal light";
	}

	// Default
	return "soft ambient lighting, aesthetic composition";
}

/**
 * Visualize theme keywords
 * Maps Japanese and English themes to visual descriptions
 */
function visualizeTheme(themes: string[]): string | null {
	const visuals: string[] = [];

	for (const theme of themes) {
		const themeLower = theme.toLowerCase();

		if (themeLower.includes("夏") || themeLower.includes("summer")) {
			visuals.push("summer sky", "golden sunlight");
		}
		if (themeLower.includes("夜") || themeLower.includes("night")) {
			visuals.push("starry night", "moonlight");
		}
		if (themeLower.includes("記憶") || themeLower.includes("memory")) {
			visuals.push("faded photograph effect", "nostalgic atmosphere");
		}
		if (themeLower.includes("別れ") || themeLower.includes("farewell")) {
			visuals.push("distant silhouette", "melancholic mood");
		}
		if (themeLower.includes("恋") || themeLower.includes("love")) {
			visuals.push("warm colors", "soft bokeh");
		}
		// Additional theme mappings
		if (
			themeLower.includes("愛されるため") ||
			themeLower.includes("演技") ||
			themeLower.includes("虚構")
		) {
			visuals.push("dramatic lighting", "mirror reflection", "stage spotlight");
		}
		if (themeLower.includes("本音") || themeLower.includes("ズレ")) {
			visuals.push("contrasting shadows", "double exposure effect");
		}
		if (themeLower.includes("孤独") || themeLower.includes("solitude")) {
			visuals.push("lone figure", "vast empty space");
		}
		if (themeLower.includes("葛藤") || themeLower.includes("conflict")) {
			visuals.push("dark contrasting colors", "split composition");
		}
		if (themeLower.includes("反逆") || themeLower.includes("rebellion")) {
			visuals.push("bold dynamic angles", "fiery colors");
		}
	}

	return visuals.length > 0 ? visuals.join(", ") : null;
}

/**
 * Visualize energy curve
 */
function visualizeEnergy(energy: string): string {
	switch (energy) {
		case "build":
			return "dynamic composition, ascending perspective";
		case "wave":
			return "flowing movement, rhythmic patterns";
		default:
			return "calm serene atmosphere, balanced composition";
	}
}
