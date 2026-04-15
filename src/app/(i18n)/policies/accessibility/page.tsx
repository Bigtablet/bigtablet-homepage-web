"use client";

import { policyContent } from "content/policies";
import { useLocale } from "next-intl";
import PolicyContent from "src/widgets/policies/content";

const Accessibility = () => {
	const locale = useLocale();
	return (
		<PolicyContent
			content={policyContent[locale]?.accessibility ?? policyContent.ko.accessibility}
		/>
	);
};

export default Accessibility;
