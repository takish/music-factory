import { z } from "zod";

/**
 * Input schema for analyze_reference_song_to_analysis_yaml
 */
export const analyzeReferenceSongInputSchema = z.object({
	title: z.string().min(1, "title is required"),
	artist: z.string().min(1, "artist is required"),
	core_type: z.string().min(1, "core_type is required"),
	target_length: z.enum(["3min", "4min", "5min"]).optional().default("3min"),
	genre_tags: z.array(z.string()).optional(),
	notes: z.string().optional(),
});

/**
 * Confidence levels for analysis
 */
export const confidenceLevelSchema = z.enum(["high", "medium", "low"]);

/**
 * Output schema for analyze_reference_song_to_analysis_yaml
 */
export const analyzeReferenceSongOutputSchema = z.object({
	analysis_path: z.string(),
	slug: z.string(),
	confidence: z.object({
		structure: confidenceLevelSchema,
		arrangement: confidenceLevelSchema,
		chords_functional: confidenceLevelSchema,
		lyrics_design: confidenceLevelSchema,
	}),
	analysis_preview: z.string().describe("First 30 lines of generated YAML"),
	warnings: z.array(z.string()).describe("Notes and caveats about the analysis"),
	next_actions: z.array(z.string()).describe("Suggested next tools to call"),
});

// Export types
export type AnalyzeReferenceSongInput = z.infer<typeof analyzeReferenceSongInputSchema>;
export type AnalyzeReferenceSongOutput = z.infer<typeof analyzeReferenceSongOutputSchema>;
export type ConfidenceLevel = z.infer<typeof confidenceLevelSchema>;
