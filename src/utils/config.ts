import { join } from "node:path";

export interface Config {
	vaultPath: string;
	promptsPath: string;
}

/**
 * Get configuration from environment variables
 */
export function getConfig(): Config {
	const vaultPath = process.env.VAULT_PATH;
	if (!vaultPath) {
		throw new Error("VAULT_PATH environment variable is required");
	}

	// prompts are in the repo, relative to the source file
	const promptsPath = join(import.meta.dir, "../../prompts");

	return {
		vaultPath,
		promptsPath,
	};
}

/**
 * Resolve a path relative to the vault
 */
export function resolveVaultPath(config: Config, ...paths: string[]): string {
	return join(config.vaultPath, ...paths);
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
