export const recruitKeys = {
    recruit: {
        list: ["recruit", "list"] as const,
        detail: (idx: number) => ["recruit", "detail", idx] as const,
        applicantList: ["recruit", "applicant-list"] as const,
    },
};