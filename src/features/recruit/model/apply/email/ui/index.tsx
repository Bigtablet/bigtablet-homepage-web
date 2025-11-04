"use client";

import {EmailFormProps} from "./type";

const EmailVerifyInline = ({
                               email,
                               authCode,
                               setAuthCode,
                               resendSec,
                               sendLoading,
                               checkLoading,
                               emailSent,
                               emailVerified,
                               onSend,
                               onVerify,
                           }: EmailFormProps) => {
    return (
        <div className="field">
            <label>이메일 인증</label>
            <div className="row gap8">
                <input
                    type="email"
                    value={email}
                    readOnly
                    className="is-readonly"
                />
                <input
                    type="text"
                    placeholder="인증 코드"
                    value={authCode}
                    onChange={(e) => setAuthCode(e.target.value)}
                />
                <button
                    type="button"
                    className="btn ghost"
                    onClick={onSend}
                    disabled={sendLoading || resendSec > 0}
                >
                    {sendLoading ? "전송 중..." : resendSec > 0 ? `재전송 ${resendSec}s` : "전송"}
                </button>
                <button
                    type="button"
                    className="btn ghost"
                    onClick={onVerify}
                    disabled={checkLoading}
                >
                    {checkLoading ? "확인 중..." : "확인"}
                </button>
            </div>

            <small className="help" aria-live="polite">
                {emailVerified
                    ? "✅ 이메일 인증이 완료되었습니다."
                    : emailSent
                        ? resendSec > 0
                            ? `이메일로 전송된 인증 코드를 입력 후 확인을 눌러주세요. (재전송 ${resendSec}s)`
                            : "이메일로 전송된 인증 코드를 입력 후 확인을 눌러주세요."
                        : "이메일 인증을 진행해주세요."}
            </small>
        </div>
    );
};

export default EmailVerifyInline;