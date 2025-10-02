import "server-only";
import {readdirSync} from "fs";
import path from "path";

const ALLOWED = [".png", ".jpg", ".jpeg", ".webp", ".svg"];

export const getCollaborationLogos = (): string[] => {
    try {
        const dir = path.join(process.cwd(), "public", "images", "collaborations");
        const files = readdirSync(dir);
        return files.reduce<string[]>((acc, file) => {
            if (file.startsWith(".")) return acc;
            const ext = path.extname(file).toLowerCase();
            if (ALLOWED.includes(ext)) acc.push(`/images/collaborations/${file}`);
            return acc;
        }, []);
    } catch {
        return [];
    }
};