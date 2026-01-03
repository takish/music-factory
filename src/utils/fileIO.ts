import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { parse as parseYaml } from "yaml";

/**
 * Read a YAML file and parse it
 */
export async function readYaml<T>(path: string): Promise<T> {
	const content = await readFile(path, "utf-8");
	return parseYaml(content) as T;
}

/**
 * Read a text file
 */
export async function readText(path: string): Promise<string> {
	return readFile(path, "utf-8");
}

/**
 * Write content to a file, creating parent directories if needed
 */
export async function writeText(path: string, content: string): Promise<void> {
	await mkdir(dirname(path), { recursive: true });
	await writeFile(path, content, "utf-8");
}

/**
 * Check if a file exists
 */
export async function fileExists(path: string): Promise<boolean> {
	try {
		await readFile(path);
		return true;
	} catch {
		return false;
	}
}
