import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
	generateNoteInputSchema,
	generateSunoPackInputSchema,
	validateSunoPackInputSchema,
} from "./schemas/output";
import { generateNote } from "./tools/generateNote";
import { generateSunoPack } from "./tools/generateSunoPack";
import { saveSongAnalysis, saveSongAnalysisInputSchema } from "./tools/saveSongAnalysis";
import { validateSunoPack } from "./tools/validateSunoPack";
import { getConfig, resolveDataPath } from "./utils/config";
import { readText } from "./utils/fileIO";

const server = new McpServer({
	name: "music-factory",
	version: "0.2.0",
});

// Tool: save_song_analysis
server.tool(
	"save_song_analysis",
	`Save a song analysis as a markdown file.

Use this tool after analyzing a song. The markdown should follow the analysis guide format:
- Frontmatter with title and artist
- 曲の本質 (essence)
- Music Structure with sections and design intent
- Harmony / Chord Progression with Roman numerals
- Arrangement with instrument table and density
- Lyrics Design
- 設計のポイント (design points)
- 概念キーワード (keywords)

Call get_analysis_guide first to see the expected format.`,
	{
		slug: z
			.string()
			.regex(/^[a-z0-9_-]+$/)
			.describe("File name without extension (e.g., 'yoasobi_idol')"),
		markdown: z.string().min(100).describe("Analysis markdown content"),
	},
	async (args) => {
		try {
			const input = saveSongAnalysisInputSchema.parse(args);
			const result = await saveSongAnalysis(input);

			return {
				content: [
					{
						type: "text",
						text: JSON.stringify(result, null, 2),
					},
				],
			};
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			return {
				content: [
					{
						type: "text",
						text: `Error: ${message}`,
					},
				],
				isError: true,
			};
		}
	},
);

// Tool: get_analysis_guide
server.tool(
	"get_analysis_guide",
	"Get the song analysis markdown format guide. Call this before analyzing a song to understand the expected format.",
	{},
	async () => {
		try {
			const config = getConfig();
			const guidePath = resolveDataPath(config, "../prompts/analysis-guide.md");
			const guide = await readText(guidePath);

			return {
				content: [
					{
						type: "text",
						text: guide,
					},
				],
			};
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			return {
				content: [
					{
						type: "text",
						text: `Error reading analysis guide: ${message}`,
					},
				],
				isError: true,
			};
		}
	},
);

// Tool: generate_suno_pack
server.tool(
	"generate_suno_pack",
	`Generate Suno-compatible output files from a song analysis.

Supports both .md (markdown) and .yaml analysis files.
Reads prompts/suno-vocabulary.md and prompts/suno-structure.md for Suno formatting rules.

Outputs:
- title.txt: New song title (non-similar to original)
- suno_style.txt: Style prompt (under 1000 chars)
- suno_lyrics.txt: Lyrics with [Section] markers
- image_prompt.txt: YouTube thumbnail prompt (optional)`,
	{
		analysis_path: z
			.string()
			.describe("Path to analysis file (e.g., analysis/yoasobi_idol.md or analysis/sample.yaml)"),
		target_length: z
			.enum(["3min", "4min", "5min"])
			.optional()
			.describe("Target song length (default: 3min)"),
		include_image_prompt: z
			.boolean()
			.optional()
			.describe("Generate image prompt for YouTube thumbnail (default: true)"),
	},
	async (args) => {
		try {
			const input = generateSunoPackInputSchema.parse(args);
			const result = await generateSunoPack(input);

			return {
				content: [
					{
						type: "text",
						text: JSON.stringify(result, null, 2),
					},
				],
			};
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			return {
				content: [
					{
						type: "text",
						text: `Error: ${message}`,
					},
				],
				isError: true,
			};
		}
	},
);

// Tool: validate_suno_pack
server.tool(
	"validate_suno_pack",
	"Validate a generated Suno pack (style length, lyrics sections, structure)",
	{
		output_dir: z.string().describe("Path to output directory (e.g., outputs/sample)"),
	},
	async (args) => {
		try {
			const input = validateSunoPackInputSchema.parse(args);
			const result = await validateSunoPack(input);

			return {
				content: [
					{
						type: "text",
						text: JSON.stringify(result, null, 2),
					},
				],
			};
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			return {
				content: [
					{
						type: "text",
						text: `Error: ${message}`,
					},
				],
				isError: true,
			};
		}
	},
);

// Tool: generate_note_from_analysis
server.tool(
	"generate_note_from_analysis",
	"Generate note.com article draft from analysis (supports .md and .yaml)",
	{
		analysis_path: z.string().describe("Path to analysis file (e.g., analysis/yoasobi_idol.md)"),
	},
	async (args) => {
		try {
			const input = generateNoteInputSchema.parse(args);
			const result = await generateNote(input);

			return {
				content: [
					{
						type: "text",
						text: JSON.stringify(result, null, 2),
					},
				],
			};
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			return {
				content: [
					{
						type: "text",
						text: `Error: ${message}`,
					},
				],
				isError: true,
			};
		}
	},
);

// Start server
async function main() {
	const transport = new StdioServerTransport();
	await server.connect(transport);
	console.error("music-factory MCP server started");
}

main().catch((error) => {
	console.error("Failed to start server:", error);
	process.exit(1);
});
