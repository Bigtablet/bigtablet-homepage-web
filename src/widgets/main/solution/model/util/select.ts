import {SOURCES} from "src/widgets/main/solution/model/video/sources";

// 배열 중 하나를 랜덤으로 정합니다.
const pickOne = <T>(arr: T[]): T =>
    arr[Math.floor(Math.random() * arr.length)];

/**
 * @description
 * 위 배열에서 정리한 영상들을 각 솔루션 카드에 업로드 합니다.
 * 이는 새로고침마다 배열이 바뀝니다.
 */
export const buildInitialSelected = (): Record<number, string> => {
    const next: Record<number, string> = {};
    for (const [k, urls] of Object.entries(SOURCES)) {
        const id = Number(k);
        next[id] = urls.length > 1 ? pickOne(urls) : urls[0];
    }
    return next;
};