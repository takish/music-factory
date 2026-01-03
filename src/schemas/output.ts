import { z } from "zod";

// Suno output validation
export const sunoStyleSchema = z.string().max(1000, "Suno style must be 1000 characters or less");

export const sunoLyricsSectionSchema = z.enum([
	"Intro",
	"Verse 1",
	"Verse 2",
	"Pre-Chorus",
	"Chorus",
	"Post-Chorus",
	"Instrumental",
	"Bridge",
	"Final Chorus",
	"Final Chorus Repeat",
	"Outro",
]);

// Required sections for 3min structure
export const requiredSections = [
	"Verse 1",
	"Verse 2",
	"Chorus",
	"Instrumental",
	"Bridge",
	"Final Chorus",
] as const;

// Generate suno pack input
export const generateSunoPackInputSchema = z.object({
	analysis_path: z.string().min(1, "analysis_path is required"),
	target_length: z.enum(["3min", "4min", "5min"]).optional().default("3min"),
	include_image_prompt: z.boolean().optional().default(true),
});

// Generate suno pack output
export const generateSunoPackOutputSchema = z.object({
	slug: z.string(),
	files: z.object({
		title: z.string(),
		suno_style: z.string(),
		suno_lyrics: z.string(),
		image_prompt: z.string().optional(),
	}),
	checks: z.object({
		suno_style_chars: z.number(),
		within_1000_chars: z.boolean(),
	}),
});

// Validate suno pack input
export const validateSunoPackInputSchema = z.object({
	output_dir: z.string().min(1, "output_dir is required"),
});

// Style length check
export const styleLengthCheckSchema = z.object({
	ok: z.boolean(),
	chars: z.number(),
	limit: z.literal(1000),
});

// Lyrics sections check
export const lyricsSectionsCheckSchema = z.object({
	ok: z.boolean(),
	found: z.array(z.string()),
	required: z.array(z.string()),
});

// Structure complete check
export const structureCompleteCheckSchema = z.object({
	ok: z.boolean(),
	missing: z.array(z.string()),
});

// Validate suno pack output
export const validateSunoPackOutputSchema = z.object({
	valid: z.boolean(),
	checks: z.object({
		style_length: styleLengthCheckSchema,
		lyrics_sections: lyricsSectionsCheckSchema,
		structure_complete: structureCompleteCheckSchema,
	}),
});

// Generate note from analysis input
export const generateNoteInputSchema = z.object({
	analysis_path: z.string().min(1, "analysis_path is required"),
});

// Generate note from analysis output
export const generateNoteOutputSchema = z.object({
	note_path: z.string(),
	slug: z.string(),
	preview: z.string().describe("First 20 lines of generated note"),
	next_actions: z.array(z.string()).describe("Suggested next tools to call"),
});

// Export types
export type GenerateSunoPackInput = z.infer<typeof generateSunoPackInputSchema>;
export type GenerateSunoPackOutput = z.infer<typeof generateSunoPackOutputSchema>;
export type ValidateSunoPackInput = z.infer<typeof validateSunoPackInputSchema>;
export type ValidateSunoPackOutput = z.infer<typeof validateSunoPackOutputSchema>;
export type GenerateNoteInput = z.infer<typeof generateNoteInputSchema>;
export type GenerateNoteOutput = z.infer<typeof generateNoteOutputSchema>;
