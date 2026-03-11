import type { MetadataRoute } from "next";

const LAST_MODIFIED = "2026-03-11";

export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl = "https://bigtablet.co.kr";

	return [
		{
			url: `${baseUrl}/main`,
			lastModified: LAST_MODIFIED,
			changeFrequency: "monthly",
			priority: 1,
		},
		{
			url: `${baseUrl}/about`,
			lastModified: LAST_MODIFIED,
			changeFrequency: "monthly",
			priority: 0.8,
		},
		{
			url: `${baseUrl}/blog`,
			lastModified: LAST_MODIFIED,
			changeFrequency: "weekly",
			priority: 0.8,
		},
		{
			url: `${baseUrl}/news`,
			lastModified: LAST_MODIFIED,
			changeFrequency: "weekly",
			priority: 0.8,
		},
		{
			url: `${baseUrl}/recruit`,
			lastModified: LAST_MODIFIED,
			changeFrequency: "weekly",
			priority: 0.7,
		},
	];
}
