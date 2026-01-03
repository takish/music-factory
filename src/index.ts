import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { listCoreTypes } from "./core/types/patterns";
import { analyzeReferenceSongInputSchema } from "./schemas/analyze";
import { generateSunoPackInputSchema, validateSunoPackInputSchema } from "./schemas/output";
import { analyzeReferenceSong } from "./tools/analyzeReferenceSong";
import { generateSunoPack } from "./tools/generateSunoPack";
import { validateSunoPack } from "./tools/validateSunoPack";

const server = new McpServer({
	name: "music-factory",
	version: "0.1.0",
});

// Tool: generate_suno_pack
server.tool(
	"generate_suno_pack",
	"Generate Suno-compatible output files from a song analysis YAML",
	{
		analysis_path: z
			.string()
			.describe("Path to analysis YAML file relative to vault (e.g., analysis/sample.yaml)"),
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
		output_dir: z
			.string()
			.describe("Path to output directory relative to vault (e.g., outputs/sample)"),
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

// Tool: analyze_reference_song_to_analysis_yaml
server.tool(
	"analyze_reference_song_to_analysis_yaml",
	`Analyze a reference song and generate analysis.yaml.
This tool does NOT access copyrighted content - it generates analysis based on:
- core_type patterns (abstracted style knowledge)
- User-provided metadata

Available core_types: ${listCoreTypes().join(", ")}`,
	{
		title: z.string().describe("Song title"),
		artist: z.string().describe("Artist name"),
		core_type: z.string().describe(`Style type (${listCoreTypes().join(", ")})`),
		target_length: z
			.enum(["3min", "4min", "5min"])
			.optional()
			.describe("Target song length (default: 3min)"),
		genre_tags: z
			.array(z.string())
			.optional()
			.describe("Genre tags (e.g., ['Japanese Pop', 'Folk Pop'])"),
		notes: z
			.string()
			.optional()
			.describe("Additional notes about the song style (e.g., '情景少なめ、盛り上げ過ぎない')"),
	},
	async (args) => {
		try {
			const input = analyzeReferenceSongInputSchema.parse(args);
			const result = await analyzeReferenceSong(input);

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

// Tool: list_core_types
server.tool("list_core_types", "List available core_types for song analysis", {}, async () => {
	const types = listCoreTypes();
	return {
		content: [
			{
				type: "text",
				text: JSON.stringify({ available_types: types }, null, 2),
			},
		],
	};
});

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
