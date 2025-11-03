import { ApplyMilitaryStatus } from "src/entities/recruit/model/schema/recruit.schema";

export const currentYearMonth = () => {
    const d = new Date();
    const m = `${d.getMonth() + 1}`.padStart(2, "0");
    return `${d.getFullYear()}-${m}`;
};

export const formatPhone010 = (input: string) => {
    let digits = input.replace(/\D/g, "");
    if (!digits.startsWith("010")) {
        digits = digits.length >= 3 ? "010" + digits.slice(3) : "010";
    }
    digits = digits.slice(0, 11);
    if (digits.length > 3 && digits.length <= 7) return `${digits.slice(0,3)}-${digits.slice(3)}`;
    if (digits.length > 7) return `${digits.slice(0,3)}-${digits.slice(3,7)}-${digits.slice(7)}`;
    return digits;
};

export const mapMil = (v: string): ApplyMilitaryStatus => {
    if (v === "DONE") return ApplyMilitaryStatus.enum.COMPLETED;
    if (v === "PENDING") return ApplyMilitaryStatus.enum.NOT_COMPLETED;
    if (v === "EXEMPT" || v === "") return ApplyMilitaryStatus.enum.NOT_APPLICABLE;
    if (Object.values(ApplyMilitaryStatus).includes(v as ApplyMilitaryStatus)) {
        return v as ApplyMilitaryStatus;
    }
    return ApplyMilitaryStatus.enum.NOT_APPLICABLE;
};

export default { currentYearMonth, formatPhone010, mapMil };