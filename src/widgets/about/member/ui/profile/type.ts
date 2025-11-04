export interface MemberProfileProps {
    name: string;
    position: string;
    description: string;
    imageSrc: string;
    links?: { linkedin?: string; github?: string };
};