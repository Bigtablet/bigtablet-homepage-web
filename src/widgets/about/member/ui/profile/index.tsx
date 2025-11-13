"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./style.module.scss";

interface MemberProfileProps {
    name: string;
    position: string;
    description: string;
    imageSrc: string;
    links?: { linkedin?: string; github?: string };
}

const Profile = ({ name, position, description, imageSrc, links }: MemberProfileProps) => {
    return (
        <aside className={styles.profile} aria-label="Profile">
            <div className={styles.profile_image}>
                {imageSrc ? (
                    <Image src={imageSrc} alt={name} fill sizes="360px" />
                ) : (
                    <div className={styles.profile_image_fallback} aria-hidden />
                )}
            </div>

            <div className={styles.profile_content}>
                <div className={styles.profile_info}>
                    <p className={styles.profile_position}>{position}</p>
                    <h1 className={styles.profile_name}>{name}</h1>
                </div>

                <p className={styles.profile_description}>{description}</p>

                <div className={styles.profile_links}>
                    {links?.linkedin && (
                        <Link href={links.linkedin} className={styles.profile_link} target="_blank" aria-label="LinkedIn">
                            in
                        </Link>
                    )}
                    {links?.github && (
                        <Link href={links.github} className={styles.profile_link} target="_blank" aria-label="GitHub">
                            gh
                        </Link>
                    )}
                </div>
            </div>
        </aside>
    );
};

export default Profile;