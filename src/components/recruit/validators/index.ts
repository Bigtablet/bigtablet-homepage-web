import { ApplyEducationLevel, ApplyMilitaryStatus } from "src/types/recruit/recruit.type";
import type { ApplyDegreeDetail, Gender } from "src/types/recruit/recruit.type";

/** === 상수 / 공통 === */
export const EMAIL_RESEND_COOLDOWN = 60;
export const MIN_EDU_LEVEL: ApplyEducationLevel = ApplyEducationLevel.BACHELOR;

/** UI에서 석/박 표기 지원(서버 전송용 아님) */
export const DEGREE_DETAIL: ApplyDegreeDetail[] = ["BACHELOR", "MASTER", "DOCTOR"];

/** 셀렉트 옵션: 페이지에서 바로 쓰도록 ApplyEducationLevel 기반으로 제공 */
export const ALLOWED_EDU_OPTIONS: { value: ApplyEducationLevel; label: string }[] = [
    { value: ApplyEducationLevel.BACHELOR, label: "대학교 (4년제) 졸업" },
    // 석/박은 서버 enum에 없으므로 BACHELOR로 노출/선택 → 서버는 그대로 BACHELOR 전송
    { value: ApplyEducationLevel.BACHELOR, label: "석사 졸업" },
    { value: ApplyEducationLevel.BACHELOR, label: "박사 졸업" },
];

/** 학력 enum 가드 + 매퍼 (문자 → ApplyEducationLevel) */
export const isEdu = (v: string): v is ApplyEducationLevel =>
    v === ApplyEducationLevel.GED ||
    v === ApplyEducationLevel.HIGH_SCHOOL ||
    v === ApplyEducationLevel.ASSOCIATE ||
    v === ApplyEducationLevel.BACHELOR;

export const mapEdu = (v: string): ApplyEducationLevel =>
    isEdu(v) ? (v as ApplyEducationLevel) : ApplyEducationLevel.BACHELOR;

/** 최소 학력 기준 비교
 * - detail은 UI에서 "BACHELOR | MASTER | DOCTOR"일 수도, 서버 enum일 수도 있어 union 처리
 * - 서버 스키마 상 최소 기준은 'BACHELOR(대졸 이상)'로 고정
 */
export type DegreeLike = ApplyEducationLevel | ApplyDegreeDetail;
export const isEduAllowed = (detail: DegreeLike, min: ApplyEducationLevel = MIN_EDU_LEVEL) => {
    const order: DegreeLike[] = [
        ApplyEducationLevel.GED,
        ApplyEducationLevel.HIGH_SCHOOL,
        ApplyEducationLevel.ASSOCIATE,
        ApplyEducationLevel.BACHELOR,
        "MASTER",
        "DOCTOR",
    ];
    const curIdx = order.indexOf(detail);
    const minIdx = order.indexOf(min);
    return curIdx >= minIdx && minIdx !== -1 && curIdx !== -1;
};

/** 전화번호 010 마스킹 */
export const handlePhoneMask010 = (raw: string) => {
    let digits = raw.replace(/\D/g, "");
    if (!digits.startsWith("010")) digits = digits.length >= 3 ? "010" + digits.slice(3) : "010";
    digits = digits.slice(0, 11);
    if (digits.length > 7) return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
    if (digits.length > 3) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return digits;
};

/** YYYY-MM 숫자 비교용 파서 */
export const parseYM = (s: string) => {
    const [y, m] = s.split("-").map(Number);
    if (!y || !m) return NaN;
    return y * 100 + m;
};

/** 병역 매핑 (여성 포함: NA → NOT_APPLICABLE) */
export const mapMil = (v: string): ApplyMilitaryStatus => {
    if (v === "DONE") return ApplyMilitaryStatus.COMPLETED;
    if (v === "PENDING") return ApplyMilitaryStatus.NOT_COMPLETED;
    if (v === "EXEMPT" || v === "" || v === "NA") return ApplyMilitaryStatus.NOT_APPLICABLE;
    if (
        v === ApplyMilitaryStatus.COMPLETED ||
        v === ApplyMilitaryStatus.NOT_COMPLETED ||
        v === ApplyMilitaryStatus.NOT_APPLICABLE
    )
        return v as ApplyMilitaryStatus;
    return ApplyMilitaryStatus.NOT_APPLICABLE;
};

/** 성별에 따른 병역 보정 */
export const normalizeMilitaryByGender = (
    gender: Gender | undefined,
    military: ApplyMilitaryStatus
): ApplyMilitaryStatus => {
    if (gender === "FEMALE") return ApplyMilitaryStatus.NOT_APPLICABLE;
    return military;
};

/** 기타 유틸 */
export const safeGet = (fd: FormData, name: string) => String(fd.get(name) || "").trim();
export const currentYearMonth = () => {
    const d = new Date();
    const m = `${d.getMonth() + 1}`.padStart(2, "0");
    return `${d.getFullYear()}-${m}`;
};

/** 이름: 한글 2~5자 */
export const NAME_KO_REGEX = /^[가-힣]{2,5}$/;