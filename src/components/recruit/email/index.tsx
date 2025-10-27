type EmailVerifierProps = {
    email: string;
    authCode: string;
    emailSent: boolean;
    emailVerified: boolean;
    sendLoading: boolean;
    checkLoading: boolean;
    resendSec: number;
    onChange: (patch: Partial<EmailVerifierProps & { emailSent: boolean }>) => void;
    api: {
        send: (email: string) => Promise<void>;
        check: (email: string, code: string) => Promise<void>;
    };
};

const EMAIL_RESEND_COOLDOWN = 60;

const EmailVerifier = ({
                           email,
                           authCode,
                           emailSent,
                           emailVerified,
                           sendLoading,
                           checkLoading,
                           resendSec,
                           onChange,
                           api,
                       }: EmailVerifierProps) => {
    const handleSend = async () => {
        if (!email) return alert("이메일을 입력해주세요.");
        if (resendSec > 0) return alert(`${resendSec}초 후 재전송 가능합니다.`);

        onChange({ sendLoading: true, emailSent: false, emailVerified: false });
        try {
            await api.send(email);
            onChange({ emailSent: true, resendSec: EMAIL_RESEND_COOLDOWN });
            alert("인증 코드가 전송되었습니다. 메일함을 확인해주세요.");
        } catch (error: any) {
            alert(error?.response?.data?.message || "이메일 전송 중 오류가 발생했습니다.");
        } finally {
            onChange({ sendLoading: false });
        }
    };

    const handleCheck = async () => {
        if (!email || !authCode) return alert("이메일과 인증 코드를 모두 입력해주세요.");

        onChange({ checkLoading: true });
        try {
            await api.check(email, authCode);
            onChange({ emailVerified: true });
            alert("이메일 인증이 완료되었습니다.");
        } catch (error: any) {
            onChange({ emailVerified: false });
            alert(error?.response?.data?.message || "이메일 인증 중 오류가 발생했습니다.");
        } finally {
            onChange({ checkLoading: false });
        }
    };

    return (
        <div className="field">
            <label>이메일*</label>
            <div className="row gap8">
                <input
                    name="email"
                    type="email"
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) =>
                        onChange({ email: e.target.value, resendSec: 0, emailSent: false, emailVerified: false, authCode: "" })
                    }
                    required
                />
                <input
                    name="authCode"
                    placeholder="인증코드"
                    value={authCode}
                    onChange={(e) => onChange({ authCode: e.target.value })}
                />
                <button
                    type="button"
                    className="btn ghost"
                    onClick={handleSend}
                    disabled={sendLoading || !email || resendSec > 0}
                >
                    {sendLoading ? "전송 중..." : resendSec > 0 ? `재전송 ${resendSec}s` : "전송"}
                </button>
                <button
                    type="button"
                    className="btn ghost"
                    onClick={handleCheck}
                    disabled={checkLoading || !email || !authCode}
                >
                    {checkLoading ? "확인 중..." : "확인"}
                </button>
            </div>
            <small className="help" aria-live="polite">
                {emailVerified
                    ? "이메일 인증이 완료되었습니다."
                    : emailSent
                        ? resendSec > 0
                            ? `이메일로 전송된 인증 코드를 입력 후 확인을 눌러주세요. (재전송 ${resendSec}s)`
                            : "이메일로 전송된 인증 코드를 입력 후 확인을 눌러주세요."
                        : "이메일 인증 부탁드립니다"}
            </small>
        </div>
    );
};

export default EmailVerifier;