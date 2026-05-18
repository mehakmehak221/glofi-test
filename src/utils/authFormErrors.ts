/** Shared validation + API error formatting for auth forms (sign-in / sign-up). */

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const MIN_PASSWORD_SIGNIN_LEN = 6;
export const MIN_PASSWORD_SIGNUP_LEN = 8;

/** Sign-up password policy (client + guidance copy). */
export const SIGNUP_PASSWORD_REQUIREMENTS = [
    { id: "len", label: "Minimum 8 characters", test: (p: string) => p.length >= MIN_PASSWORD_SIGNUP_LEN },
    { id: "upper", label: "At least one uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
    { id: "lower", label: "At least one lowercase letter", test: (p: string) => /[a-z]/.test(p) },
    { id: "num", label: "At least one number", test: (p: string) => /[0-9]/.test(p) },
    { id: "special", label: "At least one special character", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
] as const;

export function passwordMeetsSignUpStrength(password: string): boolean {
    return SIGNUP_PASSWORD_REQUIREMENTS.every((r) => r.test(password));
}

export function getSignUpPasswordCriteria(password: string) {
    return SIGNUP_PASSWORD_REQUIREMENTS.map((r) => ({
        id: r.id,
        label: r.label,
        met: r.test(password),
    }));
}

export function isMachinePasswordComplexityMessage(text: string): boolean {
    const t = text.toLowerCase();
    if (!t.includes("password")) return false;
    return (
        t.includes("uppercase") ||
        t.includes("lowercase") ||
        t.includes("special") ||
        t.includes("symbol") ||
        t.includes("number") ||
        t.includes("digit") ||
        t.includes("complex")
    );
}

export const FIELD_ERROR_CLASSES =
    "rounded-md bg-red-500/10 border border-red-500/20 px-3 py-2 text-sm font-medium text-red-400";

/** Split validator blobs where two messages were concatenated without whitespace (e.g. NestJS). */
export function splitJammedValidatorMessages(s: string): string[] {
    const t = s.trim();
    if (!t) return [];
    const lower = t.toLowerCase();
    const passwordIdx = lower.indexOf("password");
    if (passwordIdx > 0 && /[a-z0-9.)]/.test(t[passwordIdx - 1] ?? "")) {
        const first = t.slice(0, passwordIdx).trim();
        const second = t.slice(passwordIdx).trim();
        if (second) return [first, second];
    }
    return [t];
}

function collectFromMessageFallback(messageFallback: unknown): string[] {
    if (Array.isArray(messageFallback)) {
        return messageFallback
            .filter((x): x is string => typeof x === "string")
            .flatMap((line) => splitJammedValidatorMessages(line))
            .map((x) => x.trim())
            .filter(Boolean);
    }
    if (typeof messageFallback === "string") return splitJammedValidatorMessages(messageFallback);
    return [];
}

/** All discrete validation lines from API error bodies. */
export function collectApiErrorLines(data: unknown, messageFallback?: unknown): string[] {
    if (typeof data === "string") return splitJammedValidatorMessages(data);
    if (!data || typeof data !== "object") {
        return collectFromMessageFallback(messageFallback);
    }
    const d = data as Record<string, unknown>;
    const m = d.message;
    if (Array.isArray(m)) {
        return m
            .filter((x): x is string => typeof x === "string")
            .flatMap((line) => splitJammedValidatorMessages(line))
            .map((x) => x.trim())
            .filter(Boolean);
    }
    if (typeof m === "string") return splitJammedValidatorMessages(m);
    return collectFromMessageFallback(messageFallback);
}

/** First human-readable string from typical API error bodies (e.g. NestJS validation). */
export function coerceFirstStringMessage(data: unknown): string {
    const lines = collectApiErrorLines(data);
    return lines[0] || "";
}

/** Maps validator-style email messages to friendly copy. */
export function isMachineEmailValidationMessage(text: string): boolean {
    const t = text.toLowerCase();
    if (!t) return false;
    return (
        t.includes("must be an email") ||
        t.includes("must be a valid email") ||
        t.includes("invalid email") ||
        t.includes("is not a valid email") ||
        /email.*\b(must|invalid|required)\b/.test(t)
    );
}

export const OTP_PATTERN = /^\d{6}$/;

export function normalizeOtpInput(value: string): string {
    return value.replace(/\D/g, "").slice(0, 6);
}

export function isValidOtp(otp: string): boolean {
    return OTP_PATTERN.test(otp);
}

export function isMachineOtpValidationMessage(text: string): boolean {
    const t = text.toLowerCase();
    return t.includes("otp") && (t.includes("match") || t.includes("digit") || t.includes("regular expression"));
}

export function isMachinePasswordLengthMessage(text: string): boolean {
    const t = text.toLowerCase();
    return (
        t.includes("password") &&
        (t.includes("longer") ||
            t.includes("shorter") ||
            t.includes("least") ||
            t.includes("equal to") ||
            t.includes("length") ||
            t.includes("characters") ||
            /\b[6-9]\d*\b/.test(t))
    );
}

export function humanizeValidationLine(line: string, minPasswordLen: number): string {
    if (isMachineOtpValidationMessage(line)) return "Please enter the 6-digit code from your email.";
    if (isMachineEmailValidationMessage(line)) return "Please enter a valid email address.";
    if (isMachinePasswordComplexityMessage(line)) {
        return "Password must include upper and lowercase letters, a number, a special character, and be at least 8 characters long.";
    }
    if (isMachinePasswordLengthMessage(line)) return `Password must be at least ${minPasswordLen} characters.`;
    return line;
}

/** Extra pass for common class-validator / NestJS wording. */
function humanizeRequiredEmptyLine(raw: string): string | null {
    const low = raw.toLowerCase();
    const empty =
        low.includes("should not be empty") ||
        low.includes("must not be empty") ||
        /\bis required\b/.test(low) ||
        (low.includes("should not be") && (low.includes("empty") || low.includes("blank")));
    if (!empty) return null;
    if (low.includes("email")) return "Please enter your email address.";
    if (low.includes("password")) return "Please enter a password.";
    if (low.includes("rera")) return "Please enter your RERA registration number.";
    if (low.includes("expiry") || low.includes("expire") || (low.includes("date") && low.includes("rera")))
        return "Please select your RERA expiry date.";
    if (
        low.includes("fullname") ||
        low.includes("full_name") ||
        low.includes("full name") ||
        (low.includes("name") && !low.includes("username") && !low.includes("user name"))
    ) {
        return "Please enter your full name.";
    }
    return null;
}

export function humanizeApiValidationLine(raw: string, minPasswordLen: number): string {
    const fromEmpty = humanizeRequiredEmptyLine(raw);
    if (fromEmpty) return fromEmpty;
    return humanizeValidationLine(raw, minPasswordLen);
}

export function partitionSignInValidationLines(lines: string[], minPasswordLen: number) {
    let emailLine = "";
    let passwordLine = "";
    const generalLines: string[] = [];
    for (const raw of lines) {
        const low = raw.toLowerCase();
        if (low.includes("email")) {
            if (low.includes("empty") || low.includes("require") || low.includes("blank")) {
                emailLine = "Please enter email ID";
            } else {
                emailLine = "Please enter a valid email address.";
            }
        } else if (low.includes("password")) {
            passwordLine = "Please enter valid password";
        } else {
            const friendly = humanizeApiValidationLine(raw, minPasswordLen);
            generalLines.push(friendly);
        }
    }
    return { emailLine, passwordLine, generalLines };
}

export function partitionSignUpValidationLines(lines: string[], minPasswordLen: number) {
    let nameLine = "";
    let emailLine = "";
    let passwordLine = "";
    let otpLine = "";
    let reraLine = "";
    let expiryLine = "";
    let referralLine = "";
    const generalLines: string[] = [];
    for (const raw of lines) {
        const friendly = humanizeApiValidationLine(raw, minPasswordLen);
        const low = raw.toLowerCase();
        if (low.includes("otp")) otpLine = friendly;
        else if (low.includes("email")) emailLine = friendly;
        else if (low.includes("password")) passwordLine = friendly;
        else if (low.includes("rera")) reraLine = friendly;
        else if (low.includes("expiry") || low.includes("expire")) expiryLine = friendly;
        else if (low.includes("referr") || low.includes("referral")) referralLine = friendly;
        else if (low.includes("fullname") || low.includes("full name") || (low.includes("name") && !low.includes("username")))
            nameLine = friendly;
        else generalLines.push(friendly);
    }
    return { nameLine, emailLine, passwordLine, otpLine, reraLine, expiryLine, referralLine, generalLines };
}

export function validateSignInFields(email: string, password: string, minPasswordLen = MIN_PASSWORD_SIGNIN_LEN) {
    const trimmedEmail = email.trim();
    let emailError = "";
    let passwordError = "";

    if (!trimmedEmail) {
        emailError = "Please enter email ID";
    } else if (!EMAIL_PATTERN.test(trimmedEmail)) {
        emailError = "Please enter a valid email address.";
    }

    if (!password.trim()) {
        passwordError = "Please enter valid password";
    }

    return { emailError, passwordError };
}

export type SignUpFormShape = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    referredByCode: string;
    reraNumber: string;
    expiryDate: string;
};

export function validateSignUpFields(form: SignUpFormShape, userType: "Investor" | "Partner" | "Agent") {
    const trimmedName = form.name.trim();
    const trimmedEmail = form.email.trim();
    let nameError = "";
    let emailError = "";
    let passwordError = "";
    let confirmPasswordError = "";
    let reraError = "";
    let expiryError = "";
    let referralError = "";

    if (!trimmedName) {
        nameError = "Please enter your full name.";
    } else if (trimmedName.length < 2) {
        nameError = "Please enter a name that is at least 2 characters.";
    }

    if (!trimmedEmail) {
        emailError = "Please enter your email address.";
    } else if (!EMAIL_PATTERN.test(trimmedEmail)) {
        emailError = "Please enter a valid email address.";
    }

    if (!form.password.trim()) {
        passwordError = "Please enter a password.";
    } else if (!passwordMeetsSignUpStrength(form.password)) {
        passwordError = "Password must meet all requirements below.";
    }

    if (!form.confirmPassword.trim()) {
        confirmPasswordError = "Please confirm your password.";
    } else if (form.confirmPassword !== form.password) {
        confirmPasswordError = "Passwords do not match.";
    }

    if (userType === "Agent") {
        if (!form.reraNumber.trim()) {
            reraError = "Please enter your RERA registration number.";
        }
        if (!form.expiryDate.trim()) {
            expiryError = "Please select your RERA expiry date.";
        }
    }

    return { nameError, emailError, passwordError, confirmPasswordError, reraError, expiryError, referralError };
}

export function applySignInApiErrors(
    err: { status?: number | string; data?: unknown; message?: string },
    setters: {
        setEmailError: (s: string) => void;
        setPasswordError: (s: string) => void;
        setErrorMsg: (s: string) => void;
    }
) {
    const { setEmailError, setPasswordError, setErrorMsg } = setters;
    const status = err?.status;
    const errorBody = err?.data;
    const message = (errorBody as Record<string, unknown> | undefined)?.message ?? (errorBody as { error?: unknown })?.error ?? err?.message;
    const validationLines = collectApiErrorLines(errorBody, message);
    const flatMessage =
        validationLines.join("\n\n") ||
        coerceFirstStringMessage(errorBody) ||
        (typeof message === "string" ? message : "");

    if (status === 401) {
        setEmailError("");
        setPasswordError("");
        setErrorMsg("Invalid email or password");
    } else if (status === 403) {
        setEmailError("");
        setPasswordError("");
        setErrorMsg("Incorrect credentials");
    } else if (status === 400) {
        if (validationLines.length > 0) {
            const { emailLine, passwordLine, generalLines } = partitionSignInValidationLines(
                validationLines,
                MIN_PASSWORD_SIGNIN_LEN
            );
            setEmailError(emailLine);
            setPasswordError(passwordLine);
            setErrorMsg(generalLines.length > 0 ? generalLines.join("\n\n") : "");
        } else if (isMachineEmailValidationMessage(flatMessage)) {
            setEmailError("Please enter a valid email address.");
            setPasswordError("");
            setErrorMsg("");
        } else if (isMachinePasswordLengthMessage(flatMessage)) {
            setEmailError("");
            setPasswordError("Please enter valid password");
            setErrorMsg("");
        } else {
            setEmailError("");
            setPasswordError("");
            setErrorMsg(flatMessage || "Invalid email or password");
        }
    } else if (status === 404) {
        setEmailError("");
        setPasswordError("");
        setErrorMsg("Account not found. Please check your email or sign up.");
    } else if (status === "FETCH_ERROR") {
        setEmailError("");
        setPasswordError("");
        setErrorMsg("Connecting to server failed. Please check your internet connection.");
    } else {
        if (validationLines.length > 0) {
            const { emailLine, passwordLine, generalLines } = partitionSignInValidationLines(
                validationLines,
                MIN_PASSWORD_SIGNIN_LEN
            );
            setEmailError(emailLine);
            setPasswordError(passwordLine);
            setErrorMsg(generalLines.length > 0 ? generalLines.join("\n\n") : "");
        } else if (isMachineEmailValidationMessage(flatMessage)) {
            setEmailError("Please enter a valid email address.");
            setPasswordError("");
            setErrorMsg("");
        } else if (isMachinePasswordLengthMessage(flatMessage)) {
            setEmailError("");
            setPasswordError("Please enter valid password");
            setErrorMsg("");
        } else {
            setEmailError("");
            setPasswordError("");
            setErrorMsg(flatMessage || "An unexpected error occurred. Please try again later.");
        }
    }
}

export function applySignUpApiErrors(
    err: { status?: number | string; data?: unknown; message?: string },
    setters: {
        setNameError: (s: string) => void;
        setEmailError: (s: string) => void;
        setPasswordError: (s: string) => void;
        setReraError: (s: string) => void;
        setExpiryError: (s: string) => void;
        setReferralError: (s: string) => void;
        setConfirmPasswordError: (s: string) => void;
        setOtpError?: (s: string) => void;
        setErrorMsg: (s: string) => void;
    }
) {
    const {
        setNameError,
        setEmailError,
        setPasswordError,
        setReraError,
        setExpiryError,
        setReferralError,
        setConfirmPasswordError,
        setOtpError,
        setErrorMsg,
    } = setters;
    const status = err?.status;
    const errorBody = err?.data;
    const message = (errorBody as Record<string, unknown> | undefined)?.message ?? (errorBody as { error?: unknown })?.error ?? err?.message;
    const validationLines = collectApiErrorLines(errorBody, message);
    const flatMessage =
        validationLines.join("\n\n") ||
        coerceFirstStringMessage(errorBody) ||
        (typeof message === "string" ? message : "");

    const clearFields = () => {
        setNameError("");
        setEmailError("");
        setPasswordError("");
        setReraError("");
        setExpiryError("");
        setReferralError("");
        setConfirmPasswordError("");
        setOtpError?.("");
    };

    const invalidOtp =
        status === 401 &&
        (flatMessage.toLowerCase().includes("invalid") || flatMessage.toLowerCase().includes("expired"));

    if (invalidOtp) {
        clearFields();
        if (setOtpError) setOtpError("Invalid or expired code. Please try again or request a new one.");
        else setErrorMsg("Invalid or expired code. Please try again or request a new one.");
        return;
    }

    if (status === 400 || status === 422) {
        if (validationLines.length > 0) {
            const p = partitionSignUpValidationLines(validationLines, MIN_PASSWORD_SIGNUP_LEN);
            setConfirmPasswordError("");
            setNameError(p.nameLine);
            setEmailError(p.emailLine);
            setPasswordError(p.passwordLine);
            setOtpError?.(p.otpLine);
            setReraError(p.reraLine);
            setExpiryError(p.expiryLine);
            setReferralError(p.referralLine);
            setErrorMsg(p.generalLines.length > 0 ? p.generalLines.join("\n\n") : "");
        } else if (isMachineEmailValidationMessage(flatMessage)) {
            clearFields();
            setEmailError("Please enter a valid email address.");
            setErrorMsg("");
        } else if (isMachinePasswordLengthMessage(flatMessage)) {
            clearFields();
            setPasswordError(`Password must be at least ${MIN_PASSWORD_SIGNUP_LEN} characters.`);
            setErrorMsg("");
        } else if (isMachinePasswordComplexityMessage(flatMessage)) {
            clearFields();
            setPasswordError(
                "Password must include upper and lowercase letters, a number, a special character, and be at least 8 characters long."
            );
            setErrorMsg("");
        } else {
            clearFields();
            setErrorMsg(flatMessage || "We couldn't create your account. Please check your details and try again.");
        }
    } else if (status === 409) {
        clearFields();
        setErrorMsg("An account with this email may already exist. Try signing in or use a different email.");
    } else if (status === "FETCH_ERROR") {
        clearFields();
        setErrorMsg("Connecting to the server failed. Please check your internet connection.");
    } else {
        clearFields();
        if (validationLines.length > 0) {
            const p = partitionSignUpValidationLines(validationLines, MIN_PASSWORD_SIGNUP_LEN);
            setConfirmPasswordError("");
            setNameError(p.nameLine);
            setEmailError(p.emailLine);
            setPasswordError(p.passwordLine);
            setOtpError?.(p.otpLine);
            setReraError(p.reraLine);
            setExpiryError(p.expiryLine);
            setReferralError(p.referralLine);
            setErrorMsg(p.generalLines.length > 0 ? p.generalLines.join("\n\n") : "");
        } else {
            setErrorMsg(flatMessage || "Something went wrong. Please try again.");
        }
    }
}

export function formatResendCooldownMessage(retryAfterSeconds?: number): string {
    if (!retryAfterSeconds || retryAfterSeconds <= 0) {
        return "Please wait a moment before requesting another code.";
    }
    if (retryAfterSeconds < 60) {
        return `Please wait ${retryAfterSeconds} seconds before requesting another code.`;
    }
    const minutes = Math.ceil(retryAfterSeconds / 60);
    return `Please wait ${minutes} minute${minutes === 1 ? "" : "s"} before requesting another code.`;
}
