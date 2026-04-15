"use client";

import { policyContent } from "content/policies";
import { useLocale } from "next-intl";
import PolicyContent from "src/widgets/policies/content";

const Privacy = () => {
	const locale = useLocale();
	return <PolicyContent content={policyContent[locale]?.privacy ?? policyContent.ko.privacy} />;
};

export default Privacy;
