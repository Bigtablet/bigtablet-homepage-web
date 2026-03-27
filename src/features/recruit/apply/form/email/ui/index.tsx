"use client";

import { Button, TextField } from "@bigtablet/design-system";
import styles from "./style.module.scss";

interface EmailFormProps {
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
		<div className={styles.field}>
			<span className={styles.label}>이메일 인증</span>

			<div className={styles.row}>
				<TextField value={email} readOnly size="sm" fullWidth />
				<TextField
					placeholder="인증 코드"
					value={authCode}
					onChangeAction={setAuthCode}
					size="sm"
					fullWidth
				/>
				<Button
					variant="ghost"
					size="sm"
					onClick={onSend}
					disabled={sendLoading || resendSec > 0}
				>
					{sendLoading
						? "전송 중..."
						: resendSec > 0
							? `재전송 ${resendSec}s`
							: "전송"}
				</Button>
				<Button
					variant="ghost"
					size="sm"
					onClick={onVerify}
					disabled={checkLoading}
				>
					{checkLoading ? "확인 중..." : "확인"}
				</Button>
			</div>

			<small className={styles.help} aria-live="polite">
				{emailVerified
					? "이메일 인증이 완료되었습니다."
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
