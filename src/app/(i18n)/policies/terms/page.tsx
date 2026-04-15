"use client";

import { policyContent } from "content/policies";
import { useLocale } from "next-intl";
import PolicyContent from "src/widgets/policies/content";

const Terms = () => {
	const locale = useLocale();
	return <PolicyContent content={policyContent[locale]?.terms ?? policyContent.ko.terms} />;
};

export default Terms;
