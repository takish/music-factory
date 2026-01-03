import { join } from "node:path";

export interface Config {
	dataPath: string;
	promptsPath: string;
}

/**
 * Get configuration from environment variables or use defaults
 */
export function getConfig(): Config {
	// Default to repo-relative data directory
	const repoRoot = join(import.meta.dir, "../..");
	const dataPath = process.env.DATA_PATH ?? join(repoRoot, "data");
	const promptsPath = join(repoRoot, "prompts");

	return {
		dataPath,
		promptsPath,
	};
}

/**
 * Resolve a path relative to the data directory
 */
export function resolveDataPath(config: Config, ...paths: string[]): string {
	return join(config.dataPath, ...paths);
}

/**
 * Resolve a path relative to the prompts directory
 */
export function resolvePromptsPath(config: Config, ...paths: string[]): string {
	return join(config.promptsPath, ...paths);
}

/**
 * Extract slug from analysis path
 * e.g., "vault/analysis/yorushika_tadakiminihare.yaml" -> "yorushika_tadakiminihare"
 */
export function extractSlug(analysisPath: string): string {
	const filename = analysisPath.split("/").pop() ?? "";
	return filename.replace(/\.(yaml|yml)$/, "");
}
