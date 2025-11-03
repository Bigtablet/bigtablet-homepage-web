
import {
    recruitListResponseSchema,
    type RecruitResponse,
    type RecruitListResponse,
} from "src/entities/recruit/model/schema/recruit.schema";
import {getParsed} from "src/shared/libs/api/zod";

/** @description 서버 검색 공통 엔드포인트 빌더 */
const pathOf = (
    kind: "title" | "department" | "education" | "recruitType",
    value: string
) => `/job/search/${kind}/${encodeURIComponent(value.trim())}`;

/** @description 제목 검색 */
export const searchJobByTitle = async (title: string): Promise<RecruitResponse[]> =>
    getParsed(pathOf("title", title), recruitListResponseSchema)
        .then((r: RecruitListResponse) => r.data ?? []);

/** @description 부서(직무) 검색 */
export const searchJobByDepartment = async (dept: string): Promise<RecruitResponse[]> =>
    getParsed(pathOf("department", dept), recruitListResponseSchema)
        .then((r: RecruitListResponse) => r.data ?? []);

/** @description 학력 검색 */
export const searchJobByEducation = async (edu: string): Promise<RecruitResponse[]> =>
    getParsed(pathOf("education", edu), recruitListResponseSchema)
        .then((r: RecruitListResponse) => r.data ?? []);

/** @description 채용 형태(경력/고용형태) 검색 */
export const searchJobByRecruitType = async (typ: string): Promise<RecruitResponse[]> =>
    getParsed(pathOf("recruitType", typ), recruitListResponseSchema)
        .then((r: RecruitListResponse) => r.data ?? []);