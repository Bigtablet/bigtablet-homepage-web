"use client";

import Image from "next/image";
import Link from "next/link";
import "./style.scss";

interface MemberProfileProps {
    name: string;
    position: string;
    description: string;
    imageSrc: string;
    links?: { linkedin?: string; github?: string };
};

const Profile = ({ name, position, description, imageSrc, links }: MemberProfileProps) => {
    return (
        <aside className="profile" aria-label="Profile">
            <div className="profile__image">
                {imageSrc ? (
                    <Image src={imageSrc} alt={name} fill sizes="360px" />
                ) : (
                    <div className="profile__image-fallback" aria-hidden />
                )}
            </div>

            <div className="profile__content">
                <div className="profile__info">
                    <p className="profile__position">{position}</p>
                    <h1 className="profile__name">{name}</h1>
                </div>

                <p className="profile__description">{description}</p>

                <div className="profile__links">
                    {links?.linkedin && (
                        <Link href={links.linkedin} className="profile__link" target="_blank" aria-label="LinkedIn">
                            in
                        </Link>
                    )}
                    {links?.github && (
                        <Link href={links.github} className="profile__link" target="_blank" aria-label="GitHub">
                            gh
                        </Link>
                    )}
                </div>
            </div>
        </aside>
    );
};

export default Profile;