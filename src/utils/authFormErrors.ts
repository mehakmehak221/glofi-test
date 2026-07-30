/** Shared validation + API error formatting for auth forms (sign-in / sign-up). */

export type AuthTranslator = (key: string, values?: Record<string, string | number>) => string;

function translateMessage(t: AuthTranslator | undefined, key: string, values?: Record<string, string | number>) {
    return t ? t(key, values) : key;
}

export const EMAIL_PATTERN =
    /^(?!.*\.\.)(?!.*\.$)[A-Za-z0-9]+(?:[._%+-][A-Za-z0-9]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z]{2,}$/;
export const NAME_PATTERN = /^(?=.{2,100}$)(?=.*\p{L})[\p{L}]+(?:[ .'-][\p{L}]+)*$/u;
export const RERA_PATTERN = /^(?=.{8,50}$)(?=.*[A-Za-z])(?=.*\d)[A-Za-z0-9]+(?:[\/ -][A-Za-z0-9]+)*$/;

export const NAME_FORMAT_ERROR =
    "Please enter a valid full name using letters. Spaces, periods, apostrophes, and hyphens are allowed.";
export const EMAIL_FORMAT_ERROR = "Email format is invalid";
export const RERA_FORMAT_ERROR =
    "Please enter a valid RERA registration number, such as RERA-MH-2024-001234.";

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

export function getSignUpPasswordCriteria(password: string, t?: AuthTranslator) {
    return SIGNUP_PASSWORD_REQUIREMENTS.map((r) => ({
        id: r.id,
        label: translateMessage(t, r.label),
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

export function isMachineNameValidationMessage(text: string): boolean {
    const t = text.toLowerCase();
    if (!t) return false;
    const isNameField =
        t.includes("fullname") ||
        t.includes("full name") ||
        t.includes("full_name") ||
        (t.includes("name") && !t.includes("username") && !t.includes("user name"));
    if (!isNameField) return false;
    return (
        t.includes("must match") ||
        t.includes("regular expression") ||
        t.includes("only letters") ||
        t.includes("invalid")
    );
}

export function isMachineReraValidationMessage(text: string): boolean {
    const t = text.toLowerCase();
    if (!t.includes("rera")) return false;
    return (
        t.includes("must match") ||
        t.includes("regular expression") ||
        t.includes("invalid") ||
        t.includes("format")
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

export function humanizeValidationLine(line: string, minPasswordLen: number, t?: AuthTranslator): string {
    if (isMachineOtpValidationMessage(line)) return translateMessage(t, "Please enter the 6-digit code from your email.");
    if (isMachineEmailValidationMessage(line)) return translateMessage(t, EMAIL_FORMAT_ERROR);
    if (isMachineNameValidationMessage(line)) return translateMessage(t, NAME_FORMAT_ERROR);
    if (isMachineReraValidationMessage(line)) return translateMessage(t, RERA_FORMAT_ERROR);
    if (isMachinePasswordComplexityMessage(line)) {
        return translateMessage(t, "Password must include upper and lowercase letters, a number, a special character, and be at least 8 characters long.");
    }
    if (isMachinePasswordLengthMessage(line)) return translateMessage(t, "Password must be at least {minPasswordLen} characters.", { minPasswordLen });
    return line;
}

/** Extra pass for common class-validator / NestJS wording. */
function humanizeRequiredEmptyLine(raw: string, t?: AuthTranslator): string | null {
    const low = raw.toLowerCase();
    const empty =
        low.includes("should not be empty") ||
        low.includes("must not be empty") ||
        /\bis required\b/.test(low) ||
        (low.includes("should not be") && (low.includes("empty") || low.includes("blank")));
    if (!empty) return null;
    if (low.includes("email")) return translateMessage(t, "Please enter your email address.");
    if (low.includes("password")) return translateMessage(t, "Please enter a password.");
    if (low.includes("rera")) return translateMessage(t, "Please enter your RERA registration number.");
    if (low.includes("expiry") || low.includes("expire") || (low.includes("date") && low.includes("rera")))
        return translateMessage(t, "Please select your RERA expiry date.");
    if (
        low.includes("fullname") ||
        low.includes("full_name") ||
        low.includes("full name") ||
        (low.includes("name") && !low.includes("username") && !low.includes("user name"))
    ) {
        return translateMessage(t, "Please enter your full name.");
    }
    return null;
}

export function humanizeApiValidationLine(raw: string, minPasswordLen: number, t?: AuthTranslator): string {
    const fromEmpty = humanizeRequiredEmptyLine(raw, t);
    if (fromEmpty) return fromEmpty;
    return humanizeValidationLine(raw, minPasswordLen, t);
}

export function partitionSignInValidationLines(lines: string[], minPasswordLen: number, t?: AuthTranslator) {
    let emailLine = "";
    let passwordLine = "";
    const generalLines: string[] = [];
    for (const raw of lines) {
        const low = raw.toLowerCase();
        if (low.includes("email")) {
            if (low.includes("empty") || low.includes("require") || low.includes("blank")) {
                emailLine = translateMessage(t, "Please enter email ID");
            } else {
                emailLine = translateMessage(t, "Email format is invalid");
            }
        } else if (low.includes("password")) {
            passwordLine = translateMessage(t, "Please enter valid password");
        } else {
            const friendly = humanizeApiValidationLine(raw, minPasswordLen, t);
            generalLines.push(friendly);
        }
    }
    return { emailLine, passwordLine, generalLines };
}

export function partitionSignUpValidationLines(lines: string[], minPasswordLen: number, t?: AuthTranslator) {
    let nameLine = "";
    let emailLine = "";
    let phoneLine = "";
    let passwordLine = "";
    let otpLine = "";
    let reraLine = "";
    let expiryLine = "";
    let referralLine = "";
    const generalLines: string[] = [];
    for (const raw of lines) {
        const friendly = humanizeApiValidationLine(raw, minPasswordLen, t);
        const low = raw.toLowerCase();
        if (low.includes("otp")) otpLine = friendly;
        else if (low.includes("email")) emailLine = friendly;
        else if (low.includes("phone")) phoneLine = friendly;
        else if (low.includes("password")) passwordLine = friendly;
        else if (low.includes("rera")) reraLine = friendly;
        else if (low.includes("expiry") || low.includes("expire")) expiryLine = friendly;
        else if (low.includes("referr") || low.includes("referral")) referralLine = friendly;
        else if (low.includes("fullname") || low.includes("full name") || (low.includes("name") && !low.includes("username")))
            nameLine = friendly;
        else generalLines.push(friendly);
    }
    return { nameLine, emailLine, phoneLine, passwordLine, otpLine, reraLine, expiryLine, referralLine, generalLines };
}

export function validateSignInFields(email: string, password: string, minPasswordLen = MIN_PASSWORD_SIGNIN_LEN, t?: AuthTranslator) {
    const trimmedEmail = email.trim();
    let emailError = "";
    let passwordError = "";

    if (!trimmedEmail) {
        emailError = translateMessage(t, "Please enter email ID");
    } else if (!EMAIL_PATTERN.test(trimmedEmail)) {
        emailError = translateMessage(t, EMAIL_FORMAT_ERROR);
    }

    if (!password.trim()) {
        passwordError = translateMessage(t, "Please enter valid password");
    } else if (password.trim().length < minPasswordLen) {
        passwordError = translateMessage(t, "Please enter valid password");
    }

    return { emailError, passwordError };
}

export type SignUpFormShape = {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    referredByCode: string;
    reraNumber: string;
    expiryDate: string;
};

export function validateSignUpFields(
    form: SignUpFormShape,
    userType: "Investor" | "Partner" | "Developer" | "Agent",
    t?: AuthTranslator
) {
    const trimmedName = form.name.trim();
    const trimmedEmail = form.email.trim();
    let nameError = "";
    let emailError = "";
    let phoneError = "";
    let passwordError = "";
    let confirmPasswordError = "";
    let reraError = "";
    let expiryError = "";
    let referralError = "";

    if (!trimmedName) {
        nameError = translateMessage(t, "Please enter your full name.");
    } else if (trimmedName.length < 2) {
        nameError = translateMessage(t, "Please enter a name that is at least 2 characters.");
    } else if (!NAME_PATTERN.test(trimmedName)) {
        nameError = translateMessage(t, NAME_FORMAT_ERROR);
    }

    if (!trimmedEmail) {
        emailError = translateMessage(t, "Please enter your email address.");
    } else if (!EMAIL_PATTERN.test(trimmedEmail)) {
        emailError = translateMessage(t, EMAIL_FORMAT_ERROR);
    }

    if (!form.phone.trim()) {
        phoneError = translateMessage(t, "Please enter your phone number.");
    } else if (!/^\+?[1-9]\d{7,14}$/.test(form.phone.trim().replace(/[\s-]/g, ""))) {
        phoneError = translateMessage(t, "Please enter a valid phone number with country code (e.g. +1234567890).");
    }

    if (!form.password.trim()) {
        passwordError = translateMessage(t, "Please enter a password.");
    } else if (!passwordMeetsSignUpStrength(form.password)) {
        passwordError = translateMessage(t, "Password must meet all requirements below.");
    }

    if (!form.confirmPassword.trim()) {
        confirmPasswordError = translateMessage(t, "Please confirm your password.");
    } else if (form.confirmPassword !== form.password) {
        confirmPasswordError = translateMessage(t, "Passwords do not match.");
    }

    if (userType === "Agent") {
        const trimmedRera = form.reraNumber.trim();
        if (trimmedRera && !RERA_PATTERN.test(trimmedRera)) {
            reraError = translateMessage(t, RERA_FORMAT_ERROR);
        }

        const trimmedExpiry = form.expiryDate.trim();
        if (trimmedExpiry) {
            const expiry = new Date(trimmedExpiry);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (isNaN(expiry.getTime())) {
                expiryError = translateMessage(t, "Please enter a valid RERA expiry date.");
            } else if (expiry <= today) {
                expiryError = translateMessage(t, "RERA expiry date must be in the future.");
            }
        }
    }

    return { nameError, emailError, phoneError, passwordError, confirmPasswordError, reraError, expiryError, referralError };
}

export function applySignInApiErrors(
    err: { status?: number | string; data?: unknown; message?: string },
    t: AuthTranslator | undefined,
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
        setErrorMsg(translateMessage(t, "Invalid email or password"));
    } else if (status === 403) {
        setEmailError("");
        setPasswordError("");
        setErrorMsg(translateMessage(t, "Incorrect credentials"));
    } else if (status === 400) {
        if (validationLines.length > 0) {
            const { emailLine, passwordLine, generalLines } = partitionSignInValidationLines(
                validationLines,
                MIN_PASSWORD_SIGNIN_LEN,
                t
            );
            setEmailError(emailLine);
            setPasswordError(passwordLine);
            setErrorMsg(generalLines.length > 0 ? generalLines.join("\n\n") : "");
        } else if (isMachineEmailValidationMessage(flatMessage)) {
            setEmailError(translateMessage(t, "Email format is invalid"));
            setPasswordError("");
            setErrorMsg("");
        } else if (isMachinePasswordLengthMessage(flatMessage)) {
            setEmailError("");
            setPasswordError(translateMessage(t, "Please enter valid password"));
            setErrorMsg("");
        } else {
            setEmailError("");
            setPasswordError("");
            setErrorMsg(flatMessage || translateMessage(t, "Invalid email or password"));
        }
    } else if (status === 404) {
        setEmailError("");
        setPasswordError("");
        setErrorMsg(translateMessage(t, "Account not found. Please check your email or sign up."));
    } else if (status === "FETCH_ERROR") {
        setEmailError("");
        setPasswordError("");
        setErrorMsg(translateMessage(t, "Connecting to server failed. Please check your internet connection."));
    } else {
        if (validationLines.length > 0) {
            const { emailLine, passwordLine, generalLines } = partitionSignInValidationLines(
                validationLines,
                MIN_PASSWORD_SIGNIN_LEN,
                t
            );
            setEmailError(emailLine);
            setPasswordError(passwordLine);
            setErrorMsg(generalLines.length > 0 ? generalLines.join("\n\n") : "");
        } else if (isMachineEmailValidationMessage(flatMessage)) {
            setEmailError(translateMessage(t, "Email format is invalid"));
            setPasswordError("");
            setErrorMsg("");
        } else if (isMachinePasswordLengthMessage(flatMessage)) {
            setEmailError("");
            setPasswordError(translateMessage(t, "Please enter valid password"));
            setErrorMsg("");
        } else {
            setEmailError("");
            setPasswordError("");
            setErrorMsg(flatMessage || translateMessage(t, "An unexpected error occurred. Please try again later."));
        }
    }
}

export function applySignUpApiErrors(
    err: { status?: number | string; data?: unknown; message?: string },
    t: AuthTranslator | undefined,
    setters: {
        setNameError: (s: string) => void;
        setEmailError: (s: string) => void;
        setPhoneError: (s: string) => void;
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
        setPhoneError,
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
        setPhoneError("");
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
        if (setOtpError) setOtpError(translateMessage(t, "Invalid or expired code. Please try again or request a new one."));
        else setErrorMsg(translateMessage(t, "Invalid or expired code. Please try again or request a new one."));
        return;
    }

    if (status === 400 || status === 422) {
        if (validationLines.length > 0) {
            const p = partitionSignUpValidationLines(validationLines, MIN_PASSWORD_SIGNUP_LEN, t);
            setConfirmPasswordError("");
            setNameError(p.nameLine);
            setEmailError(p.emailLine);
            setPhoneError(p.phoneLine);
            setPasswordError(p.passwordLine);
            setOtpError?.(p.otpLine);
            setReraError(p.reraLine);
            setExpiryError(p.expiryLine);
            setReferralError(p.referralLine);
            setErrorMsg(p.generalLines.length > 0 ? p.generalLines.join("\n\n") : "");
        } else if (isMachineEmailValidationMessage(flatMessage)) {
            clearFields();
            setEmailError(translateMessage(t, "Please enter a valid email address."));
            setErrorMsg("");
        } else if (isMachinePasswordLengthMessage(flatMessage)) {
            clearFields();
            setPasswordError(translateMessage(t, "Password must be at least {minPasswordLen} characters.", { minPasswordLen: MIN_PASSWORD_SIGNUP_LEN }));
            setErrorMsg("");
        } else if (isMachinePasswordComplexityMessage(flatMessage)) {
            clearFields();
            setPasswordError(
                translateMessage(t, "Password must include upper and lowercase letters, a number, a special character, and be at least 8 characters long.")
            );
            setErrorMsg("");
        } else {
            clearFields();
            setErrorMsg(flatMessage || translateMessage(t, "We couldn't create your account. Please check your details and try again."));
        }
    } else if (status === 409) {
        clearFields();
        setErrorMsg(translateMessage(t, "An account with this email may already exist. Try signing in or use a different email."));
    } else if (status === "FETCH_ERROR") {
        clearFields();
        setErrorMsg(translateMessage(t, "Connecting to the server failed. Please check your internet connection."));
    } else {
        clearFields();
        if (validationLines.length > 0) {
            const p = partitionSignUpValidationLines(validationLines, MIN_PASSWORD_SIGNUP_LEN, t);
            setConfirmPasswordError("");
            setNameError(p.nameLine);
            setEmailError(p.emailLine);
            setPhoneError(p.phoneLine);
            setPasswordError(p.passwordLine);
            setOtpError?.(p.otpLine);
            setReraError(p.reraLine);
            setExpiryError(p.expiryLine);
            setReferralError(p.referralLine);
            setErrorMsg(p.generalLines.length > 0 ? p.generalLines.join("\n\n") : "");
        } else {
            setErrorMsg(flatMessage || translateMessage(t, "Something went wrong. Please try again."));
        }
    }
}

export function formatResendCooldownMessage(retryAfterSeconds?: number, t?: AuthTranslator): string {
    if (!retryAfterSeconds || retryAfterSeconds <= 0) {
        return translateMessage(t, "Please wait a moment before requesting another code.");
    }
    if (retryAfterSeconds < 60) {
        return translateMessage(t, "Please wait {retryAfterSeconds} seconds before requesting another code.", { retryAfterSeconds });
    }
    const minutes = Math.ceil(retryAfterSeconds / 60);
    return translateMessage(t, "Please wait {minutes} minute{plural} before requesting another code.", {
        minutes,
        plural: minutes === 1 ? "" : "s",
    });
}
