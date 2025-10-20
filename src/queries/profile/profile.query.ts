import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { getProfileApi } from "src/api/profile/profile.api";
import { QueryKey } from "src/queries/queryKey";
import type { ProfileType } from "src/types/profile/profile.type";

export const getProfileQuery = (
    options?: Omit<UseQueryOptions<ProfileType, Error, ProfileType>, "queryKey" | "queryFn">
) =>
    useQuery({
        queryKey: [QueryKey.profile.get],
        queryFn: ({ signal }) => getProfileApi(signal),
        staleTime: 60_000,
        ...options,
    });