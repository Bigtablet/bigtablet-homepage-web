import { ApplyEducationLevel } from "src/types/recruit/recruit.type";
import type { ApplyDegreeDetail } from "src/types/recruit/recruit.type";

/** 옵션 타입들 */
export type EducationOption = {
    value: ApplyEducationLevel;
    label: string;
};

export type DegreeOption = {
    value: ApplyDegreeDetail; // "BACHELOR" | "MASTER" | "DOCTOR"
    label: string;
};

/** 기본(학사만) 모드용 props */
type BaseProps = {
    /** 서버 전송용 enum 값 */
    value: ApplyEducationLevel;
    /** 학사 셀렉트 옵션 */
    options?: EducationOption[];
    /** 학사 변경 콜백 */
    onChange?: (v: ApplyEducationLevel) => void;
};

/** 석/박 UI 모드용 props */
type DegreeProps = {
    /** UI 표기용 (학사/석사/박사) */
    degreeDetail?: ApplyDegreeDetail;
    /** 석/박 포함 변경 콜백 */
    onDegreeChange?: (v: ApplyDegreeDetail) => void;
    /** 석/박 옵션 */
    degreeOptions?: DegreeOption[];
};

/**
 * 두 모드(Base or Degree)를 모두 지원
 * - degreeDetail && onDegreeChange 가 있으면 석/박 UI 모드로 렌더
 * - 아니면 Base 모드로 렌더
 */
type Props = BaseProps & DegreeProps;

const DEFAULT_DEGREE_OPTIONS: DegreeOption[] = [
    { value: "BACHELOR", label: "대학교 (4년제) 졸업" },
    { value: "MASTER", label: "석사 졸업" },
    { value: "DOCTOR", label: "박사 졸업" },
];

const EducationFields = ({
                             value,
                             options,
                             onChange,
                             degreeDetail,
                             onDegreeChange,
                             degreeOptions = DEFAULT_DEGREE_OPTIONS,
                         }: Props) => {
    const handleBaseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const v = e.target.value as ApplyEducationLevel;
        onChange?.(v);
    };

    const handleDegreeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const v = e.target.value as ApplyDegreeDetail;
        onDegreeChange?.(v);
    };

    const isDegreeMode = Boolean(degreeDetail && onDegreeChange);

    return (
        <div className="field">
            <label>최종 학력*</label>

            <div className="row gap8">
                {isDegreeMode ? (
                    // 석/박 UI 모드
                    <select
                        name="eduLevelDetail"
                        value={degreeDetail}
                        onChange={handleDegreeChange}
                        required
                    >
                        {degreeOptions.map((o) => (
                            <option key={`${o.value}-${o.label}`} value={o.value}>
                                {o.label}
                            </option>
                        ))}
                    </select>
                ) : (
                    // 기본(학사만) 모드
                    <select
                        name="eduLevel"
                        value={value}
                        onChange={handleBaseChange}
                        required
                    >
                        {(options ?? [{ value: ApplyEducationLevel.BACHELOR, label: "대학교 (4년제) 졸업" }]).map(
                            (o) => (
                                <option key={`${o.value}-${o.label}`} value={o.value}>
                                    {o.label}
                                </option>
                            )
                        )}
                    </select>
                )}

                <input name="eduSchool" placeholder="학교명" />
            </div>

            <div className="row gap8">
                <input name="eduStart" type="month" placeholder="입학년도(YYYY-MM)" />
                <input name="eduEnd" type="month" placeholder="졸업년도(YYYY-MM)" />
            </div>

            <input name="eduMajor" placeholder="계열 (학과)" />
        </div>
    );
};

export default EducationFields;