import { z } from "zod";

// Chord section schema
const chordSectionSchema = z.object({
	feel: z.string().optional(),
	pattern: z.string().optional(),
});

// Section enum
const sectionEnum = z.enum([
	"Intro",
	"Verse1",
	"Verse2",
	"PreChorus",
	"Chorus",
	"PostChorus",
	"Instrumental",
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
	energy_curve: z.enum(["flat", "build", "wave"]).default("flat"),
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
	verse: z.string().optional(),
	chorus: z.string().optional(),
	final: z.string().optional(),
});

// Arrangement schema
const arrangementSchema = z.object({
	genre_tags: z.array(z.string()).min(1),
	center: z.string().optional(),
	rhythm: z.string().optional(),
	bass: z.string().optional(),
	density: densitySchema.optional(),
	dynamics: z.string().optional(),
	ear_candy: z.string().optional(),
});

// Chorus hook rule schema
const chorusHookRuleSchema = z.object({
	repeat_short_phrase: z.boolean().optional(),
	avoid_direct_emotion_words: z.boolean().optional(),
});

// Lyrics design schema
const lyricsDesignSchema = z.object({
	language: z.enum(["ja", "en", "mixed"]),
	perspective: z.string().optional(),
	scenery: z.string().optional(),
	emotion_expression: z.string().optional(),
	word_density: z.string().optional(),
	theme: z.array(z.string()).optional(),
	chorus_hook_rule: chorusHookRuleSchema.optional(),
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
