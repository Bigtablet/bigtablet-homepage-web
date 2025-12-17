"use client";

import styles from "./style.module.scss";
import Template from "src/shared/ui/template";
import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import Profile from "src/widgets/about/member/profile";
import Interview from "src/widgets/about/member/interview";
import { QaList } from "src/widgets/about/member/model/use-qa-list";
import { isMemberSlug } from "src/entities/about/model/util/member.util";
import { BigtabletParams } from "src/shared/hooks/params";
import { BigtabletLink } from "src/shared/hooks/link";

const MemberDetailPage = () => {
    const { id } = BigtabletParams<{ id: string }>();
    const t = useTranslations();

    if (!isMemberSlug(id)) return notFound();

    const base = `about.team.members.${id}`;

    const name = t(`${base}.name`);
    const position = t(`${base}.position`);
    const description = t(`${base}.description`);
    const imageSrc = t.has(`${base}.image`)
        ? t(`${base}.image`)
        : `/images/member/${id}.png`;

    const links = {
        linkedin: t.has(`${base}.links.linkedin`)
            ? t(`${base}.links.linkedin`)
            : undefined,
        github: t.has(`${base}.links.github`)
            ? t(`${base}.links.github`)
            : undefined,
    };

    const qaList = QaList(t as any, id, 20);

    return (
        <Template>
            <section className={styles.member_detail} aria-label="Team member detail">
                <div className={styles.member_detail_inner}>
                    <Profile
                        name={name}
                        position={position}
                        description={description}
                        imageSrc={imageSrc}
                        links={links}
                    />
                    <Interview items={qaList} />
                </div>

                <BigtabletLink
                    href="/about#team"
                    className={styles.member_detail_back}
                >
                    Back to Team
                </BigtabletLink>
            </section>
        </Template>
    );
};

export default MemberDetailPage;