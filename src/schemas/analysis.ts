import { z } from "zod";

// Chord section schema
const chordSectionSchema = z.object({
	feel: z.string().optional(),
	pattern: z.string().optional(),
});

// Section enum - Suno v5 compatible
const sectionEnum = z.enum([
	"Intro",
	"Verse1",
	"Verse2",
	"Verse3",
	"PreChorus",
	"Chorus",
	"PostChorus",
	"Instrumental",
	"Drop",
	"Breakdown",
	"Bridge",
	"FinalChorus",
	"FinalChorusRepeat",
	"Outro",
]);

// Source song schema
const sourceSongSchema = z.object({
	title: z.string().min(1),
	artist: z.string().optional(),
});

// Music structure schema
const musicStructureSchema = z.object({
	target_length: z.enum(["3min", "4min", "5min"]).default("3min"),
	tempo_bpm: z.number().min(40).max(300),
	key_mode: z.enum(["major", "minor"]),
	energy_curve: z.enum(["flat", "build", "wave"]).default("wave"),
	sections: z.array(sectionEnum).min(1),
});

// Chord progression schema
const chordProgressionSchema = z.object({
	notation: z.enum(["roman_numerals", "chord_names"]).default("roman_numerals"),
	verse: chordSectionSchema.optional(),
	prechorus: chordSectionSchema.optional(),
	chorus: chordSectionSchema.optional(),
	bridge: chordSectionSchema.optional(),
});

// Density schema
const densitySchema = z.object({
	verse: z.enum(["sparse", "medium", "dense"]).optional(),
	chorus: z.enum(["sparse", "medium", "dense"]).optional(),
	final: z.enum(["sparse", "medium", "dense"]).optional(),
});

// Vocal style schema - v5 enhanced
const vocalStyleSchema = z.object({
	gender: z.enum(["male", "female", "mixed", "unspecified"]).optional(),
	range: z.enum(["low", "mid", "high"]).optional(),
	character: z.array(z.string()).optional(), // e.g., ["breathy", "powerful", "raspy"]
	techniques: z.array(z.string()).optional(), // e.g., ["falsetto", "vibrato", "belting"]
});

// Arrangement schema - v5 enhanced
const arrangementSchema = z.object({
	genre_tags: z.array(z.string()).min(1).max(4), // v5: 2-4 genres recommended
	mood: z.array(z.string()).optional(), // e.g., ["dark", "uplifting", "melancholic"]
	center: z.string().optional(), // main instrument
	instruments: z.array(z.string()).optional(), // v5: 2-4 instruments recommended
	rhythm: z.string().optional(),
	bass: z.string().optional(),
	density: densitySchema.optional(),
	dynamics: z.string().optional(),
	ear_candy: z.string().optional(),
	texture: z.string().optional(), // e.g., "tape-saturated", "clean digital"
});

// Chorus hook rule schema
const chorusHookRuleSchema = z.object({
	repeat_short_phrase: z.boolean().optional(),
	avoid_direct_emotion_words: z.boolean().optional(),
});

// Lyrics design schema - v5 enhanced
const lyricsDesignSchema = z.object({
	language: z.enum(["ja", "en", "mixed"]),
	perspective: z.string().optional(),
	scenery: z.string().optional(),
	emotion_expression: z.string().optional(),
	word_density: z.enum(["low", "medium", "high"]).optional(),
	theme: z.array(z.string()).optional(),
	chorus_hook_rule: chorusHookRuleSchema.optional(),
	vocal_style: vocalStyleSchema.optional(), // v5 vocal control
});

// Main analysis schema
export const analysisSchema = z.object({
	source_song: sourceSongSchema,
	core_type: z.string().optional(),
	music_structure: musicStructureSchema,
	chord_progression: chordProgressionSchema.optional(),
	arrangement: arrangementSchema,
	lyrics_design: lyricsDesignSchema,
	concept_keywords: z.array(z.string()).optional(),
});

// Export types
export type Analysis = z.infer<typeof analysisSchema>;
export type Section = z.infer<typeof sectionEnum>;
export type MusicStructure = z.infer<typeof musicStructureSchema>;
export type Arrangement = z.infer<typeof arrangementSchema>;
export type LyricsDesign = z.infer<typeof lyricsDesignSchema>;
export type ChordProgression = z.infer<typeof chordProgressionSchema>;
export type VocalStyle = z.infer<typeof vocalStyleSchema>;
