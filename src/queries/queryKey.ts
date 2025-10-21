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
        update: "recruit/update",
    },
    gcp: {
        upload: "/gcp",
    },
    news: {
        list: "/news/list",
        detail: "/news/detail",
        create: "/news",
        update: "/news",
        delete: "/news/delete",
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