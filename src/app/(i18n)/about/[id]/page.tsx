"use client";

import {useParams, notFound} from "next/navigation";
import {useTranslations, useLocale} from "next-intl";
import Link from "next/link";
import {SLUG_TO_MEMBER, type MemberSlug} from "src/types/member/member.type";
import "./style.scss";
import Template from "src/components/common/template";

const MemberDetailPage = () => {
    const {id} = useParams<{ id: string }>();
    const t = useTranslations("about.team.members");
    const locale = useLocale();

    const key = SLUG_TO_MEMBER[id as MemberSlug];
    if (!key) return notFound();

    const qaList = Array.from({length: 20}, (_, i) => i + 1)
        .map((n) => ({q: `qa${n}.q`, a: `qa${n}.a`}))
        .filter(({q, a}) => t.has(`${key}.${q}`) && t.has(`${key}.${a}`));

    return (
        <Template>
            <section className="member-detail" aria-label="Team member detail">
                <div className="member-detail__inner">
                    <aside className="profile" aria-label="Profile">
                        <div className="profile__image">
                            <img src={`/images/member/${id}.png`} alt={t(`${key}.name`)}/>
                        </div>
                        <div className="profile__content">
                            <div className="profile__info">
                                <p className="profile__position">{t(`${key}.position`)}</p>
                                <h1 className="profile__name">{t(`${key}.name`)}</h1>
                            </div>
                            <p className="profile__description">{t(`${key}.description`)}</p>
                            <div className="profile__links">
                                {t.has(`${key}.links.linkedin`) && (
                                    <Link href={t(`${key}.links.linkedin`)} className="profile__link"
                                          target="_blank">in</Link>
                                )}
                                {t.has(`${key}.links.github`) && (
                                    <Link href={t(`${key}.links.github`)} className="profile__link"
                                          target="_blank">gh</Link>
                                )}
                            </div>
                        </div>
                    </aside>

                    <main className="interview" aria-label="Interview">
                        <div className="interview__scroll">
                            {qaList.length > 0 ? (
                                qaList.map(({q, a}, i) => (
                                    <article className="qa" key={i}>
                                        <h3 className="qa__q">{t(`${key}.${q}`)}</h3>
                                        <p className="qa__a">{t(`${key}.${a}`)}</p>
                                    </article>
                                ))
                            ) : (
                                <p className="interview__empty">No interview data available.</p>
                            )}
                        </div>
                    </main>
                </div>

                <Link href={`/about`} className="member-detail__back">
                    Back to Team
                </Link>
            </section>
        </Template>
    );
};

export default MemberDetailPage;