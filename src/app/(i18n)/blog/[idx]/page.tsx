import { notFound } from "next/navigation";
import Template from "src/shared/ui/template";
import BlogDetailClient from "./client";

type PageProps = {
    params: { idx: string };
};

const BlogDetailPage = async ({ params }: PageProps) => {
    const {idx} = await params;
    const idNum = Number(idx);

    /**
     * URL 파라미터 자체 검증만 서버에서 처리
     * - 숫자가 아니거나
     * - 0 이하인 경우
     *
     * 데이터 존재 여부 / API 에러는
     * Client 컴포넌트에서 처리한다
     */
    if (!Number.isFinite(idNum) || idNum <= 0) notFound();

    return (
        <Template>
            <BlogDetailClient idx={idNum} />
        </Template>
    );
};

export default BlogDetailPage;