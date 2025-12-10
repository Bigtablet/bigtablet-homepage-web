import { useGcpUploadMutation } from "src/shared/gcp/mutation/gcp.query";

export const useGcpUpload = () => {
    const m = useGcpUploadMutation();

    const upload = async (file: File): Promise<string> => {
        const res = await m.mutateAsync(file);
        return res.data ?? "";
    };

    return { upload, ...m };
};