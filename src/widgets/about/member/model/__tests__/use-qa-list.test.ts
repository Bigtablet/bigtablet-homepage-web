import { describe, expect, it } from "vitest";
import { QaList } from "src/widgets/about/member/model/use-qa-list";

const makeTranslator = (keys: Record<string, string>) => ({
	get: (k: string) => keys[k] ?? "",
	has: (k: string) => k in keys,
});

describe("QaList", () => {
	it("번역 키가 없으면 빈 배열 반환", () => {
		const t = makeTranslator({});
		expect(QaList(t, "sangmin")).toEqual([]);
	});

	it("q/a 쌍이 모두 있는 항목만 포함", () => {
		const t = makeTranslator({
			"about.team.members.sangmin.qa1.q": "질문1",
			"about.team.members.sangmin.qa1.a": "답변1",
			"about.team.members.sangmin.qa2.q": "질문2",
			// qa2.a 없음 → 제외
		});
		const result = QaList(t, "sangmin");
		expect(result).toHaveLength(1);
		expect(result[0]).toEqual({ q: "질문1", a: "답변1" });
	});

	it("max 개수만큼만 탐색", () => {
		const keys: Record<string, string> = {};
		for (let i = 1; i <= 25; i++) {
			keys[`about.team.members.jiho.qa${i}.q`] = `Q${i}`;
			keys[`about.team.members.jiho.qa${i}.a`] = `A${i}`;
		}
		const result = QaList(makeTranslator(keys), "jiho", 5);
		expect(result).toHaveLength(5);
	});

	it("번호 순서대로 반환", () => {
		const t = makeTranslator({
			"about.team.members.minho.qa1.q": "Q1",
			"about.team.members.minho.qa1.a": "A1",
			"about.team.members.minho.qa2.q": "Q2",
			"about.team.members.minho.qa2.a": "A2",
		});
		const result = QaList(t, "minho");
		expect(result[0].q).toBe("Q1");
		expect(result[1].q).toBe("Q2");
	});
});
