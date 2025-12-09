import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    PostTalentApi,
    PostTalentOfferApi,
} from "../api/talent.api";

/**
 * 탤런트 생성 뮤테이션
 */
export const useTalentMutation = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: PostTalentApi,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["talent", "list"] });
        },
    });
};

/**
 * 탤런트 제안 생성 뮤테이션
 */
export const useTalentOfferMutation = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: PostTalentOfferApi,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["talent", "offer"] });
        },
    });
};