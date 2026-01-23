"use client";

import { useEffect, useState } from "react";
import {
	sendEmailApi,
	checkEmailApi,
} from "src/features/recruit/apply/form/model/email/api/email.api";
import { useToast } from "@bigtablet/design-system";

interface UseEmailVerificationParams {
	getEmail: () => string;
	cooldownSec?: number;
}

const useEmailVerification = ({
	getEmail,
	cooldownSec = 60,
}: UseEmailVerificationParams) => {
	const [authCode, setAuthCode] = useState("");
	const [resendSec, setResendSec] = useState(0);
	const [sendLoading, setSendLoading] = useState(false);
	const [checkLoading, setCheckLoading] = useState(false);
	const [emailSent, setEmailSent] = useState(false);
	const [emailVerified, setEmailVerified] = useState(false);
	const Toast = useToast();

	useEffect(() => {
		setAuthCode("");
		setEmailSent(false);
		setEmailVerified(false);
		setResendSec(0);
	}, [getEmail()]);

	useEffect(() => {
		if (resendSec <= 0) return;
		const id = setInterval(
			() => setResendSec((s) => Math.max(0, s - 1)),
			1000,
		);
		return () => clearInterval(id);
	}, [resendSec]);

	const send = async () => {
		const email = getEmail();
		if (!email) return Toast.error("이메일을 입력해주세요.");
		if (resendSec > 0) return alert(`${resendSec}초 후 재전송 가능합니다.`);

		setSendLoading(true);
		try {
			await sendEmailApi(email);
			setEmailSent(true);
			setResendSec(cooldownSec);
			Toast.success("인증 코드가 전송되었습니다. 메일함을 확인해주세요.");
		} catch (e: any) {
			Toast.error(e?.response?.data?.message ?? "이메일 전송 실패");
		} finally {
			setSendLoading(false);
		}
	};

	const verify = async () => {
		const email = getEmail();
		if (!email || !authCode)
			return alert("이메일과 인증 코드를 입력해주세요.");
		setCheckLoading(true);
		try {
			await checkEmailApi(email, authCode);
			setEmailVerified(true);
			Toast.success("이메일 인증이 완료되었습니다.");
		} catch (e: any) {
			setEmailVerified(false);
			Toast.error(e?.response?.data?.message ?? "인증 실패");
		} finally {
			setCheckLoading(false);
		}
	};

	return {
		authCode,
		setAuthCode,
		resendSec,
		sendLoading,
		checkLoading,
		emailSent,
		emailVerified,
		send,
		verify,
	};
};

export default useEmailVerification;
