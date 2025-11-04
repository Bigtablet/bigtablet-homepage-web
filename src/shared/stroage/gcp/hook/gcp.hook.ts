import { useGcpUploadMutation } from "src/shared/stroage/gcp/query/gcp.query";

export const useGcpUpload = (options?: Parameters<typeof useGcpUploadMutation>[0]) => {
    const m = useGcpUploadMutation(options);

    const upload = async (file: File) => {
        const res = await m.mutateAsync(file);
        return res.data;
    };

    return { upload, ...m };
};