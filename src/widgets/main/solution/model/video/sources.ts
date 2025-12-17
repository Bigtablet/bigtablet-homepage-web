export interface Product { id: number; src: string }

/**
 * @description
 * 솔루션 영상에 사용되는 영상들입니다.
 * 이 영상들은 gcp를 통해 경량화 된 상태니 링크를 수정하지 마시고,
 * 추가로 영상을 삽입할 경우 gcp를 통해 링크로 변환 후, 삽입하시길 바랍니다.
 */
export const SOURCES: Record<number, string[]> = {
    1: ["https://storage.googleapis.com/bigtablet-homepage/e54c4886-77f5-4df2-b2e7-c721921845b9"],
    2: ["https://storage.googleapis.com/bigtablet-homepage/4125700b-ccda-42c8-9acb-705a3f93826b"],
    3: [
        "https://storage.googleapis.com/bigtablet-homepage/312d580d-7de2-457c-8194-a05cd527f469",
        "https://storage.googleapis.com/bigtablet-homepage/4c261808-87d4-4031-b3c5-9851a4f0c540",
        "https://storage.googleapis.com/bigtablet-homepage/8a827489-8161-4269-9d09-737b2ac8ff20",
        "https://storage.googleapis.com/bigtablet-homepage/d9779906-9811-46d8-9149-56e01e7e5368",
    ],
    4: [
        "https://storage.googleapis.com/bigtablet-homepage/8fc089a3-eff8-4e5f-b1e1-c73ba56594ca",
        "https://storage.googleapis.com/bigtablet-homepage/a6d95be7-5ad5-4a70-b609-4ecbd40766b3",
        "https://storage.googleapis.com/bigtablet-homepage/f20d9b1f-b553-4797-8427-5f789191a761",
    ],
    5: ["https://storage.googleapis.com/bigtablet-homepage/e5498153-4ebe-46de-aba3-b53ed5ddba7b"],
};