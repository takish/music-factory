import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { generateSunoPackInputSchema, validateSunoPackInputSchema } from "./schemas/output";
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
