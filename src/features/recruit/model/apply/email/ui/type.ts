export interface EmailFormProps {
    email: string;
    authCode: string;
    setAuthCode: (v: string) => void;
    resendSec: number;
    sendLoading: boolean;
    checkLoading: boolean;
    emailSent: boolean;
    emailVerified: boolean;
    onSend: () => void;
    onVerify: () => void;
}
