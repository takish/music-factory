import { generateSunoPack } from "../src/tools/generateSunoPack";

const input = {
	analysis_path: "analysis/usseewa.yaml",
	target_length: "3min" as const,
	include_image_prompt: true,
};

const result = await generateSunoPack(input);
console.log(JSON.stringify(result, null, 2));
