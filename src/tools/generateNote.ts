import { parse as parseYaml } from "yaml";
import type { Analysis } from "../schemas/analysis";
import type { GenerateNoteInput, GenerateNoteOutput } from "../schemas/output";
import { getConfig, resolveDataPath } from "../utils/config";
import { readText, writeText } from "../utils/fileIO";

/**
 * Generate note.com article draft from analysis.yaml
 *
 * Creates a markdown file with:
 * - Song metadata
 * - Structure overview
 * - Arrangement details
 * - Production notes
 */
export async function generateNote(input: GenerateNoteInput): Promise<GenerateNoteOutput> {
	const config = getConfig();

	// Read and parse analysis YAML
	const analysisFullPath = resolveDataPath(config, input.analysis_path);
	const analysisContent = await readText(analysisFullPath);
	const analysis = parseYaml(analysisContent) as Analysis;

	// Extract slug from analysis_path
	const slug = input.analysis_path.replace(/^analysis\//, "").replace(/\.yaml$/, "");

	// Build note content
	const noteContent = buildNoteContent(analysis, slug);

	// Write note file
	const notePath = `notes/${slug}.md`;
	const noteFullPath = resolveDataPath(config, notePath);
	await writeText(noteFullPath, noteContent);

	// Generate preview
	const preview = noteContent.split("\n").slice(0, 20).join("\n");

	// Suggest next actions
	const nextActions: string[] = [
		`generate_suno_pack({ analysis_path: "${input.analysis_path}" })`,
		"Edit the note draft to add personal insights and context",
	];

	return {
		note_path: notePath,
		slug,
		preview,
		next_actions: nextActions,
	};
}

/**
 * Build markdown content for note.com article
 */
function buildNoteContent(analysis: Analysis, slug: string): string {
	const lines: string[] = [];

	// Frontmatter
	lines.push("---");
	lines.push(`title: "${analysis.source_song.title}" 風の曲を作る`);
	lines.push(`slug: ${slug}`);
	lines.push(`tags: [AI音楽, Suno, 作曲, ${analysis.core_type}]`);
	lines.push("---");
	lines.push("");

	// Introduction
	lines.push(`# 「${analysis.source_song.title}」風の曲を作る`);
	lines.push("");
	lines.push(`${analysis.source_song.artist}の「${analysis.source_song.title}」を参考に、`);
	lines.push(`${analysis.core_type}スタイルで曲を作成してみました。`);
	lines.push("");

	// Structure section
	lines.push("## 構成");
	lines.push("");
	lines.push(`- **曲の長さ**: ${analysis.music_structure.target_length}`);
	lines.push(`- **テンポ**: ${analysis.music_structure.tempo_bpm} BPM`);
	lines.push(`- **キー**: ${analysis.music_structure.key_mode}`);
	lines.push(`- **エネルギーカーブ**: ${analysis.music_structure.energy_curve}`);
	lines.push("");

	// Sections
	lines.push("### セクション構成");
	lines.push("");
	lines.push("```");
	lines.push(analysis.music_structure.sections.join(" → "));
	lines.push("```");
	lines.push("");

	// Arrangement section
	lines.push("## アレンジ");
	lines.push("");
	lines.push(`- **ジャンル**: ${analysis.arrangement.genre_tags.join(", ")}`);
	lines.push(`- **中心楽器**: ${analysis.arrangement.center}`);
	lines.push(`- **リズム**: ${analysis.arrangement.rhythm}`);
	lines.push(`- **ベース**: ${analysis.arrangement.bass}`);
	lines.push(`- **ダイナミクス**: ${analysis.arrangement.dynamics}`);
	lines.push("");

	// Density
	if (typeof analysis.arrangement.density === "object") {
		lines.push("### 音の密度");
		lines.push("");
		lines.push(`- Verse: ${analysis.arrangement.density.verse}`);
		lines.push(`- Chorus: ${analysis.arrangement.density.chorus}`);
		lines.push(`- Final: ${analysis.arrangement.density.final}`);
		lines.push("");
	}

	// Chord progression section
	if (analysis.chord_progression) {
		lines.push("## コード進行");
		lines.push("");
		lines.push("（Roman numerals表記の推定値）");
		lines.push("");
		if (analysis.chord_progression.verse) {
			lines.push(`- **Verse**: ${analysis.chord_progression.verse.pattern}`);
		}
		if (analysis.chord_progression.prechorus) {
			lines.push(`- **Pre-Chorus**: ${analysis.chord_progression.prechorus.pattern}`);
		}
		if (analysis.chord_progression.chorus) {
			lines.push(`- **Chorus**: ${analysis.chord_progression.chorus.pattern}`);
		}
		if (analysis.chord_progression.bridge) {
			lines.push(`- **Bridge**: ${analysis.chord_progression.bridge.pattern}`);
		}
		lines.push("");
	}

	// Lyrics design section
	lines.push("## 歌詞デザイン");
	lines.push("");
	lines.push(`- **言語**: ${analysis.lyrics_design.language}`);
	lines.push(`- **視点**: ${analysis.lyrics_design.perspective}`);
	lines.push(`- **情景描写**: ${analysis.lyrics_design.scenery}`);
	lines.push(`- **感情表現**: ${analysis.lyrics_design.emotion_expression}`);
	lines.push(`- **言語密度**: ${analysis.lyrics_design.word_density}`);
	lines.push("");

	if (analysis.lyrics_design.theme && analysis.lyrics_design.theme.length > 0) {
		lines.push("### テーマ");
		lines.push("");
		lines.push(analysis.lyrics_design.theme.map((t) => `- ${t}`).join("\n"));
		lines.push("");
	}

	// Concept keywords
	if (analysis.concept_keywords && analysis.concept_keywords.length > 0) {
		lines.push("## コンセプトキーワード");
		lines.push("");
		lines.push(analysis.concept_keywords.map((k) => `\`${k}\``).join(" "));
		lines.push("");
	}

	// Footer
	lines.push("---");
	lines.push("");
	lines.push("*この記事はAI分析ツールを使用して作成されました。*");
	lines.push("");

	return lines.join("\n");
}
