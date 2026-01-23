"use client";

import { useUpload } from "src/features/upload/model/use-upload";
import type { ApplyFormProps } from "./type";
import styles from "./style.module.scss";
import { ContactSection } from "src/features/recruit/apply/form/ui/sections/contact";
import { PortfolioSection } from "src/features/recruit/apply/form/ui/sections/portfolio";
import { EducationSection } from "src/features/recruit/apply/form/ui/sections/education";
import { MilitarySection } from "src/features/recruit/apply/form/ui/sections/military";
import { LinksSection } from "src/features/recruit/apply/form/ui/sections/links";
import { ProfileSection } from "src/features/recruit/apply/form/ui/sections/profile";
import { Button, useAlert } from "@bigtablet/design-system";

const ApplyForm = ({ form, email, onSubmit }: ApplyFormProps) => {
    const {
        formState: { errors, isSubmitting },
        handleSubmit,
    } = form;

	const { upload, isPending: isUploading } = useUpload();
    const { showAlert } = useAlert();

    const handleSubmitWithConfirm = (values: any) => {
        showAlert({
            title: "제출 확인",
            message: "지원서를 제출하시겠습니까?",
            showCancel: true,
            confirmText: "제출하기",
            cancelText: "취소",
            onConfirm: () => onSubmit(values),
        });
    };

    return (
        <form
            className={styles.apply_form}
            noValidate
            onSubmit={handleSubmit(handleSubmitWithConfirm)}
        >
            <div className={styles.apply_grid}>
                <div className={styles.apply_left}>
                    <ContactSection form={form} email={email} />
                    <PortfolioSection form={form} upload={upload} isUploading={isUploading} />
                    <EducationSection form={form} />
                    <MilitarySection form={form} />
                    <LinksSection form={form} />

                    {errors.root?.message && (
                        <p className={styles.form_error}>{errors.root.message as string}</p>
                    )}

                    <Button
                        className={styles.apply_submit}
                        type="submit"
                        size="lg"
                        disabled={isSubmitting || isUploading}
                    >
                        제출하기
                    </Button>

                    <p className={styles.apply_footer}>
                        기타 채용 관련 문의사항은{" "}
                        <a href="mailto:recruit@bigtablet.com">recruit@bigtablet.com</a>{" "}
                        으로 연락 바랍니다
                    </p>
                </div>

                <div className={styles.apply_right}>
                    <ProfileSection form={form} upload={upload} isUploading={isUploading} />
                </div>
            </div>
        </form>
    );
};

export default ApplyForm;