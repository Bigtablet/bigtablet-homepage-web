export const QueryKey = {
    auth: {
        signin: "/auth/signin",
        signup: "/auth/signup",
    },
    recruit: {
        list: "/recruit",
        detail: "/recruit/detail",
        apply: "/recruit/apply",
    },
    gcp: {
        upload: "/gcp",
    },
    news: {
        list: "/news/list",
    },
    blog: {
        list: "/blog/list",
        detail: "/blog/detail",
    },
    job: {
        post: "/job",
        list: "/job/list",
        detail: "/job/detail",
    },
} as const;