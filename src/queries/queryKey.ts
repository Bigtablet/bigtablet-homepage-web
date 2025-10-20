export const QueryKey = {
    auth: {
        signin: "/auth/signin",
        signup: "/auth/signup",
    },
    profile: {
        get: "/profile",
    },
    recruit: {
        list: "/recruit",
        detail: "/recruit/detail",
        apply: "/recruit/apply",
        applicantList: "/recruit/list",
        applicantDetail: "/recruit/detail",
        applicantAccept: "/recruit/accept",
        applicantReject: "/recruit/reject",
        delete: "recruit/delete",
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
        create: "/blog",
        update: "/blog",
        delete: "/blog/delete",
    },
    job: {
        post: "/job",
        list: "/job/list",
        detail: "/job/detail",
    },
} as const;