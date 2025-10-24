import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {ACCESS_TOKEN} from "src/constants/token/token.constants";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies();
    const token = cookieStore.get(ACCESS_TOKEN)?.value;

    if (!token) {
        redirect('/admin/auth/signin')
    }

    return <>{children}</>;
}