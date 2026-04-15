"use client";

import { policyContent } from "content/policies";
import { useLocale } from "next-intl";
import PolicyContent from "src/widgets/policies/content";

const Cookies = () => {
	const locale = useLocale();
	return <PolicyContent content={policyContent[locale]?.cookies ?? policyContent.ko.cookies} />;
};

export default Cookies;
