import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import largeLogo from "../../public/logo/largeLogo.svg";
import { signUp } from "@/libs/api/Users";
import { PasswordInput, TextInput } from "../components/input/signInput";
import {
  emailValidationRules,
  passwordValidationRules,
  nicknameValidationRules,
} from "../components/input/formInputValidationRules";
import OneButton from "../components/modal/OneButton";
import Head from "next/head";
import { checkAuthRedirect } from "@/libs/utils/authRedirect";

// signUp 함수의 반환 타입 정의
interface SignUpResponse {
  data: unknown;
  status: number;
  error?: string; // error 속성을 optional로 정의
}

const Signup = () => {
  const router = useRouter();
  const [values, setValues] = useState({
    nickname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState({
    nickname: "",
    email: "",
    password: "",
    confirmPassword: "",
    type: "",
  });
  const [isPending, setIsPending] = useState(false);
  const [modalMessage, setModalMessage] = useState<string | null>(null);

  const validateInput = (name: string, value: string) => {
    let error = "";
    if (name === "nickname") {
      if (!value) {
        error = nicknameValidationRules.required;
      } else if (value.length > 10) {
        error = "열 자 이하로 작성해 주세요.";
      } else if (!nicknameValidationRules.pattern.value.test(value)) {
        error = nicknameValidationRules.pattern.message;
      }
    } else if (name === "email") {
      if (!emailValidationRules.pattern.value.test(value)) {
        error = emailValidationRules.pattern.message;
      }
    } else if (name === "password") {
      if (value.length < passwordValidationRules.minLength.value) {
        error = passwordValidationRules.minLength.message;
      } else if (!passwordValidationRules.pattern.value.test(value)) {
        error = passwordValidationRules.pattern.message;
      }
    } else if (name === "confirmPassword") {
      if (value !== values.password) {
        error = "비밀번호가 일치하지 않습니다.";
      }
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  useEffect(() => {
    checkAuthRedirect();
  }, []);

  const isFormValid = () => {
    return (
      values.nickname &&
      values.email &&
      values.password &&
      values.confirmPassword &&
      !errors.nickname &&
      !errors.email &&
      !errors.password &&
      !errors.confirmPassword &&
      termsAccepted
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({ ...prevValues, [name]: value }));
    validateInput(name, value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const registerData = {
      nickname: values.nickname,
      email: values.email,
      password: values.password,
    };
    try {
      const response: SignUpResponse | undefined = await signUp(registerData);
      if (response && response.status === 201) {
        setModalMessage("회원가입이 성공적으로 완료되었습니다!");
      }
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        error.message.includes("이미 사용중인 이메일입니다.")
      ) {
        setModalMessage("이미 사용중인 이메일입니다.");
      } else if (error instanceof Error) {
        setModalMessage("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
      } else {
        console.error("Unexpected error:", error);
        setModalMessage("회원가입 중 알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setIsPending(false);
    }
  };

  const closeModal = () => {
    setModalMessage(null);
    if (modalMessage === "회원가입이 성공적으로 완료되었습니다!") {
      router.push("/login");
    }
  };

  return (
    <>
      <Head>
        <title> Taskify | signup</title>
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <div className="flex min-h-screen items-center justify-center">
        <div className="margincenter flex w-full max-w-[520px] flex-col gap-9 px-4 py-28">
          <div className="flex flex-col items-center justify-center gap-3">
            <button onClick={() => router.push("/")}>
              <Image src={largeLogo} alt="로고" />
            </button>
            <p className="text-[20px] text-black-200">첫 방문을 환영합니다!</p>
          </div>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col">
              <TextInput
                labelName="닉네임"
                placeholder="닉네임을 입력해주세요."
                name="nickname"
                onChange={handleChange}
                onBlur={() => validateInput("nickname", values.nickname)}
                hasError={errors}
                className="mx-auto w-full max-w-[520px]"
              />
              {errors.nickname && (
                <p className="mt-[-16px] text-sm leading-none text-[#d6173a]">
                  {errors.nickname}
                </p>
              )}
            </div>

            <div className="flex flex-col">
              <TextInput
                labelName="이메일"
                placeholder="이메일을 입력해주세요."
                name="email"
                onChange={handleChange}
                onBlur={() => validateInput("email", values.email)}
                hasError={errors}
                className="mx-auto w-full max-w-[520px]"
              />
              {errors.email && (
                <p className="mt-[-16px] text-sm leading-none text-[#d6173a]">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="flex flex-col">
              <PasswordInput
                labelName="비밀번호"
                placeholder="비밀번호를 입력해주세요."
                name="password"
                onChange={handleChange}
                onBlur={() => validateInput("password", values.password)}
                hasError={errors}
                className="mx-auto w-full max-w-[520px]"
              />
              {errors.password && (
                <p className="mt-[-16px] text-sm leading-none text-[#d6173a]">
                  {errors.password}
                </p>
              )}
            </div>

            <div className="flex flex-col">
              <PasswordInput
                labelName="비밀번호 확인"
                placeholder="비밀번호를 다시 입력해주세요."
                name="confirmPassword"
                onChange={handleChange}
                onBlur={() =>
                  validateInput("confirmPassword", values.confirmPassword)
                }
                hasError={errors}
                className="mx-auto w-full max-w-[520px]"
              />
              {errors.confirmPassword && (
                <p className="mt-[-16px] text-sm leading-none text-[#d6173a]">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <div>
              <label>
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                />
                이용약관에 동의합니다
              </label>
            </div>
            <button
              disabled={!isFormValid() || isPending}
              className={`mx-auto mt-4 w-full max-w-[520px] rounded-lg py-4 text-lg font-medium text-white ${
                isFormValid() ? "bg-[#5534da]" : "bg-[#9fa6b2]"
              } ${isPending ? "cursor-not-allowed" : ""}`}
            >
              가입하기
            </button>
          </form>
          <div className="mt-4 text-center">
            이미 회원이신가요?{" "}
            <Link href={"/login"}>
              <span className="text-[#5543da] underline decoration-[#5534da] underline-offset-2">
                로그인하기
              </span>
            </Link>
          </div>
        </div>
      </div>

      {modalMessage && (
        <OneButton message={modalMessage} onClose={closeModal} />
      )}
    </>
  );
};

export default Signup;
