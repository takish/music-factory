import type { Analysis } from "../../schemas/analysis";

/**
 * Generate image prompt for YouTube thumbnail (16:9, no text)
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

	// Mood from arrangement
	if (analysis.arrangement.dynamics) {
		parts.push(`${analysis.arrangement.dynamics} atmosphere`);
	}

	// Concept keywords
	if (analysis.concept_keywords && analysis.concept_keywords.length > 0) {
		parts.push(analysis.concept_keywords.join(", "));
	}

	// Theme visualization
	if (analysis.lyrics_design.theme && analysis.lyrics_design.theme.length > 0) {
		const themeVisual = visualizeTheme(analysis.lyrics_design.theme);
		if (themeVisual) {
			parts.push(themeVisual);
		}
	}

	// Scenery if available
	if (analysis.lyrics_design.scenery) {
		parts.push(analysis.lyrics_design.scenery);
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
