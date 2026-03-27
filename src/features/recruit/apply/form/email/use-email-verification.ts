"use client";

import { useToast } from "@bigtablet/design-system";
import { useEffect, useRef, useState } from "react";
import {
	checkEmailApi,
	sendEmailApi,
} from "src/features/recruit/apply/form/email/api/email.api";
import { getErrorMessage } from "src/shared/libs/api/axios/error/error.util";

interface UseEmailVerificationParams {
	email: string;
	cooldownSec?: number;
}

const useEmailVerification = ({
	email,
	cooldownSec = 60,
}: UseEmailVerificationParams) => {
	const [authCode, setAuthCode] = useState("");
	const [resendSec, setResendSec] = useState(0);
	const [sendLoading, setSendLoading] = useState(false);
	const [checkLoading, setCheckLoading] = useState(false);
	const [emailSent, setEmailSent] = useState(false);
	const [emailVerified, setEmailVerified] = useState(false);
	const Toast = useToast();
	const prevEmail = useRef(email);

	useEffect(() => {
		if (prevEmail.current === email) return;
		prevEmail.current = email;
		setAuthCode("");
		setEmailSent(false);
		setEmailVerified(false);
		setResendSec(0);
	});

	useEffect(() => {
		if (resendSec <= 0) return;
		const id = setInterval(() => setResendSec((s) => Math.max(0, s - 1)), 1000);
		return () => clearInterval(id);
	}, [resendSec]);

	const send = async () => {
		if (!email) return Toast.error("이메일을 입력해주세요.");
		if (resendSec > 0)
			return Toast.warning(`${resendSec}초 후 재전송 가능합니다.`);

		setSendLoading(true);
		try {
			await sendEmailApi(email);
			setEmailSent(true);
			setResendSec(cooldownSec);
			Toast.success("인증 코드가 전송되었습니다. 메일함을 확인해주세요.");
		} catch (e: unknown) {
			Toast.error(getErrorMessage(e, "이메일 전송 실패"));
		} finally {
			setSendLoading(false);
		}
	};

	const verify = async () => {
		if (!email || !authCode)
			return Toast.warning("이메일과 인증 코드를 입력해주세요.");
		setCheckLoading(true);
		try {
			await checkEmailApi(email, authCode);
			setEmailVerified(true);
			Toast.success("이메일 인증이 완료되었습니다.");
		} catch (e: unknown) {
			setEmailVerified(false);
			Toast.error(getErrorMessage(e, "인증 실패"));
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
