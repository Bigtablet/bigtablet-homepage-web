"use client";

import "./style.scss";
import Frame from "src/widgets/layout/template";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import Profile from "src/widgets/about/member/ui/profile";
import Interview from "src/widgets/about/member/ui/interview";
import {QaList} from "src/widgets/about/member/lib/qa";
import {isMemberSlug, SLUG_TO_MEMBER} from "src/entities/about/model/util/member.util";

const MemberDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const t = useTranslations();

    if (!isMemberSlug(id)) return notFound();
    const memberKey = SLUG_TO_MEMBER[id];

    const base = `about.team.members.${memberKey}`;

    const name = t(`${base}.name`);
    const position = t(`${base}.position`);
    const description = t(`${base}.description`);
    const imageSrc = `/images/member/${id}.png`;
    const links = {
        linkedin: t.has(`${base}.links.linkedin`) ? t(`${base}.links.linkedin`) : undefined,
        github: t.has(`${base}.links.github`) ? t(`${base}.links.github`) : undefined,
    };

    const qaList = QaList(t as any, memberKey, 20);

    return (
        <Frame>
            <section className="member-detail" aria-label="Team member detail">
                <div className="member-detail__inner">
                    <Profile
                        name={name}
                        position={position}
                        description={description}
                        imageSrc={imageSrc}
                        links={links}
                    />
                    <Interview items={qaList} />
                </div>

                <Link href="/about#team" className="member-detail__back">
                    Back to Team
                </Link>
            </section>
        </Frame>
    );
};

export default MemberDetailPage;