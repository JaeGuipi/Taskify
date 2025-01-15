import React, { useState, useEffect } from "react";
import { Cookies } from "react-cookie";
import OneButton from "../components/modal/OneButton"; // 수정된 모달 컴포넌트 가져오기

import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import largeLogo from "../../public/logo/largeLogo.svg";
import { useRouter } from "next/router";
import { postLogin } from "../libs/api/auth";
import { PasswordInput, TextInput } from "../components/input/signInput";
import {
  emailValidationRules,
  passwordValidationRules,
} from "../components/input/formInputValidationRules";
import { useAtom } from "jotai";
import { userAtom } from "@/atoms/userAtom";
import Head from "next/head";
import { checkAuthRedirect } from "@/libs/utils/authRedirect";

// Cookie 관련 함수들
const cookies = new Cookies();

export const setCookie = (name: string, value: string) => {
  return cookies.set(name, value, {
    path: "/",
    secure: true,
    maxAge: 86400,
  });
};

export const getCookie = (name: string) => {
  return cookies.get(name);
};

export const removeCookie = (name: string) => {
  return cookies.remove(name, { path: "/" });
};

export interface SignInDataType {
  email: string;
  password: string;
}

// SignInForm 컴포넌트
export function SigninForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
  } = useForm<SignInDataType>({ mode: "all" });
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [modalMessage, setModalMessage] = useState<string | null>(null);
  const [, setUser] = useAtom(userAtom);

  const onSubmit = async () => {
    setIsPending(true);
    const data = {
      email: getValues("email"),
      password: getValues("password"),
    };

    try {
      const response = await postLogin(data);
      setUser(response.user);
      const accessToken = response?.accessToken; // response의 구조에 맞게 수정
      if (accessToken) {
        setCookie("accessToken", accessToken);
        setModalMessage("성공적으로 로그인되었습니다.");
      } else {
        setModalMessage("비밀번호가 일치하지 않습니다!");
      }
    } catch (error) {
      console.error(error);
      setModalMessage("비밀번호가 일치하지 않습니다!");
    } finally {
      setIsPending(false);
    }
  };

  const closeModal = () => {
    setModalMessage(null);
    if (modalMessage === "성공적으로 로그인되었습니다.") {
      router.push("/mydashboard");
    }
  };

  return (
    <>
      <Head>
        <title> Taskify | login</title>
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <div className="flex min-h-screen items-center justify-center">
        <div className="margincenter flex w-full max-w-[520px] flex-col gap-9 px-4 py-28">
          <div className="flex flex-col items-center justify-center gap-3">
            <button onClick={() => router.push("/")}>
              <Image src={largeLogo} alt="로고" />
            </button>
            <p className="text-[20px] text-black-200">
              오늘도 만나서 반가워요!
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <TextInput
              labelName="이메일"
              placeholder="이메일을 입력해주세요."
              {...register("email", emailValidationRules)}
              hasError={errors.email}
              className="mx-auto w-full max-w-[520px]"
            />

            <PasswordInput
              labelName="비밀번호"
              placeholder="비밀번호를 입력해주세요."
              {...register("password", passwordValidationRules)}
              hasError={errors.password}
              className="mx-auto w-full max-w-[520px]"
            />

            <button
              disabled={!isValid || isPending}
              className={`mx-auto mt-4 w-full max-w-[520px] rounded-lg py-4 text-lg font-medium text-white ${
                isValid ? "bg-[#5534da]" : "bg-[#9fa6b2]"
              } ${isPending ? "cursor-not-allowed" : ""}`}
            >
              로그인
            </button>
          </form>
          <div className="mt-4 text-center">
            회원이 아니신가요?{" "}
            <Link href="/signup">
              <span className="text-[#5543da] underline decoration-[#5534da] underline-offset-2">
                회원가입하기
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
}

// SignInPage 컴포넌트
export default function SignInPage() {
  useEffect(() => {
    checkAuthRedirect();
  }, []);

  return <SigninForm />;
}
