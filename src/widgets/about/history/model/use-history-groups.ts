/**
 * @description
 * History UI에서 사용되는 연도 그룹/선택 상태를 관리하는 훅입니다.
 *
 * - `groups`: 연도별 History 데이터 그룹
 * - `years`: 표시할 연도 목록
 * - `currentYear`: 현재 선택된 연도
 * - `activeGroup`: 선택된 연도의 상세 아이템 목록
 */

import { useEffect, useMemo, useState } from "react";
import { buildYearGroups, yearsFromGroups, YearGroup } from "src/entities/about/history/model/util/group";
import type { HistorySchema } from "src/entities/about/history/model/schema/history.schema";

export const useHistoryGroups = (items: HistorySchema[]) => {
    const groups: YearGroup[] = useMemo(() => buildYearGroups(items), [items]);
    const years = useMemo(() => yearsFromGroups(groups), [groups]);

    const [currentYear, setCurrentYear] = useState<number | null>(null);

    useEffect(() => {
        if (groups.length && currentYear === null) {
            setCurrentYear(groups[0].year);
        }
    }, [groups, currentYear]);

    const activeGroup = useMemo(
        () => (currentYear ? groups.find((g) => g.year === currentYear) ?? null : null),
        [currentYear, groups],
    );

    return {
        groups,
        years,
        currentYear,
        setCurrentYear,
        activeGroup,
    };
};