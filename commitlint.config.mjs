/** @type {import('@commitlint/types').UserConfig} */
export default {
	rules: {
		// git-workflow.md 기준 허용 라벨
		"type-enum": [
			2,
			"always",
			[
				"feat",
				"fix",
				"bug",
				"merge",
				"deploy",
				"docs",
				"delete",
				"note",
				"style",
				"config",
				"etc",
				"tada",
			],
		],
		"type-empty": [2, "never"],
		"subject-empty": [2, "never"],
		"subject-case": [0], // 대소문자 제한 없음 (camelCase 허용)
		"header-max-length": [2, "always", 100],
	},
	// "type: subject" 형식 파싱
	parserPreset: {
		parserOpts: {
			headerPattern: /^(\w+):\s(.+)$/,
			headerCorrespondence: ["type", "subject"],
		},
	},
};
