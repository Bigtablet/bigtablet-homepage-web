import {redirect} from 'next/navigation';
import {defaultLocale} from 'src/i18n/navigation';

export default function Page() {
    redirect(`/${defaultLocale}/main`);
}