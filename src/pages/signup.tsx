import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import largeLogo from "../../public/logo/largeLogo.svg";
import { signUp } from "@/libs/api/Users";
import { PasswordInput, TextInput } from "../components/input/signInput";
import OneButton from "../components/modal/OneButton";
import Head from "next/head";
import { checkAuthRedirect } from "@/libs/utils/authRedirect";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupFormData } from "@/libs/schemas/authSchemas";

// signUp 함수의 반환 타입 정의
interface SignUpResponse {
  data: unknown;
  status: number;
  error?: string; // error 속성을 optional로 정의
}

const Signup = () => {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [modalMessage, setModalMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
  });

  useEffect(() => {
    checkAuthRedirect();
  }, []);

  const onSubmit = async (data: SignupFormData) => {
    setIsPending(true);
    const registerData = {
      nickname: data.nickname,
      email: data.email,
      password: data.password,
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
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col">
              <TextInput
                labelName="닉네임"
                placeholder="닉네임을 입력해주세요."
                {...register("nickname")}
                hasError={errors.nickname}
                className="mx-auto w-full max-w-[520px]"
              />
            </div>

            <div className="flex flex-col">
              <TextInput
                labelName="이메일"
                placeholder="이메일을 입력해주세요."
                {...register("email")}
                hasError={errors.email}
                className="mx-auto w-full max-w-[520px]"
              />
            </div>

            <div className="flex flex-col">
              <PasswordInput
                labelName="비밀번호"
                placeholder="비밀번호를 입력해주세요."
                {...register("password")}
                hasError={errors.password}
                className="mx-auto w-full max-w-[520px]"
              />
            </div>

            <div className="flex flex-col">
              <PasswordInput
                labelName="비밀번호 확인"
                placeholder="비밀번호를 다시 입력해주세요."
                {...register("confirmPassword")}
                hasError={errors.confirmPassword}
                className="mx-auto w-full max-w-[520px]"
              />
            </div>

            <div>
              <label>
                <input type="checkbox" {...register("termsAccepted")} />
                이용약관에 동의합니다
              </label>
              {errors.termsAccepted && (
                <p className="text-sm text-[#d6173a]">
                  {errors.termsAccepted.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={!isValid || isPending}
              className={`mx-auto mt-4 w-full max-w-[520px] rounded-lg py-4 text-lg font-medium text-white ${
                isValid ? "bg-[#5534da]" : "bg-[#9fa6b2]"
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
