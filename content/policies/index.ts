import enAccessibility from "./en/accessibility";
import enCookies from "./en/cookies";
import enPrivacy from "./en/privacy";
import enTerms from "./en/terms";
import koAccessibility from "./ko/accessibility";
import koCookies from "./ko/cookies";
import koPrivacy from "./ko/privacy";
import koTerms from "./ko/terms";

export const policyContent: Record<string, Record<string, string>> = {
	ko: {
		privacy: koPrivacy,
		terms: koTerms,
		cookies: koCookies,
		accessibility: koAccessibility,
	},
	en: {
		privacy: enPrivacy,
		terms: enTerms,
		cookies: enCookies,
		accessibility: enAccessibility,
	},
};
