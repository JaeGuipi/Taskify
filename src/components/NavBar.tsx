import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import BoxButton from "./BoxButton";
import ProfileImage from "./ProfileImage";
import settingIcon from "@/../public/icons/setting.svg";
import addBoxIcon from "@/../public/icons/addBox.svg";
import DashboardInvite from "./modal/DashboardInvite";
import { useAtom } from "jotai";
import { dashboardInfoAtom } from "@/atoms/dashboardInfoAtom";
import crownIcon from "@/../public/icons/crown_icon.svg";
import LogoutDropdown from "./LogoutDropdown";

interface Props {
  myNickName: string | undefined;
  members?: string[];
  myProfileImage: string | undefined;
  children: ReactNode;
}

interface BoxButtonProps {
  paddingTopBottom: string;
  paddingRightLeft: string;
  radius: "4" | "6" | "8";
  backgroundColor: "purple" | "white" | "white2";
  fontSize: "12" | "14" | "16" | "18";
}

export default function NavBar({
  myNickName,
  members = [],
  myProfileImage,
  children,
}: Props) {
  const router = useRouter();
  const boardId = Number(router.query["dashboardid"]);
  const mydashboard = router.pathname === "/mydashboard";

  const [dashboardInfo] = useAtom(dashboardInfoAtom);
  const [screenSize, setScreenSize] = useState<string>("mobile");
  const [displayCount, setDisplayCount] = useState(2);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const visibleMembers = members?.slice(0, displayCount);
  const remainingCount = members.length - displayCount;
  const buttonBorder =
    members.length === 0
      ? "border-r border-solid border-gray-300 pr-4 mr-4  md:pr-8 md:mr-8 xl:pr-9 xl:mr-9"
      : "mr-4";
  const profileImageSize = screenSize === "mobile" ? "medium" : "large";
  const buttonProps: BoxButtonProps = {
    paddingTopBottom: screenSize === "mobile" ? "6" : "10",
    paddingRightLeft: screenSize === "mobile" ? "12" : "16",
    radius: screenSize === "mobile" ? "6" : "8",
    backgroundColor: "white2",
    fontSize: screenSize === "pc" ? "16" : "14",
  };

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setScreenSize("mobile");
        setDisplayCount(2);
      } else if (width < 1280) {
        setScreenSize("tablet");
        setDisplayCount(2);
      } else {
        setScreenSize("pc");
        setDisplayCount(4);
      }
    };

    handleResize(); // 초기 사이즈 설정
    window.addEventListener("resize", handleResize); // 리사이즈 이벤트 리스너 등록

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <nav className="fixed top-0 flex w-full items-center border-b border-solid border-gray-300 bg-white py-3.5 pl-[90px] pr-3 md:py-4 md:pl-[235px] md:pr-10 xl:py-4 xl:pl-[320px] xl:pr-20">
        {screenSize === "pc" && !mydashboard && (
          <div className="flex items-center gap-x-2">
            <div className="text-[20px] font-bold">{children}</div>
            {dashboardInfo?.createdByMe && (
              <div className="relative h-4 w-5">
                <Image fill src={crownIcon} alt="왕관" />
              </div>
            )}
          </div>
        )}
        {mydashboard && (
          <div>
            <span
              className={`${screenSize === "mobile" ? "text-[16px]" : "text-[20px]"} font-bold`}
            >
              내 대시보드
            </span>
          </div>
        )}
        <div className="ml-auto flex items-center">
          <div
            className={`${buttonBorder} ${mydashboard && "border-r border-solid border-gray-300 pr-4 md:pr-8"} flex gap-x-1.5 md:mr-8 md:gap-x-3 xl:gap-x-4`}
          >
            {!mydashboard && dashboardInfo?.createdByMe && (
              <>
                {screenSize === "mobile" ? (
                  <BoxButton
                    {...buttonProps}
                    disabled={false}
                    onClick={() => {
                      router.push(`/dashboard/${boardId}/edit`);
                    }}
                  >
                    관리
                  </BoxButton>
                ) : (
                  <BoxButton
                    {...buttonProps}
                    disabled={false}
                    onClick={() => {
                      router.push(`/dashboard/${boardId}/edit`);
                    }}
                  >
                    <div>
                      <Image src={settingIcon} alt="설정" />
                    </div>
                    관리
                  </BoxButton>
                )}
              </>
            )}
            {screenSize === "mobile" ? (
              <BoxButton
                {...buttonProps}
                disabled={false}
                onClick={() => {
                  setShowInviteModal(true);
                }}
              >
                초대하기
              </BoxButton>
            ) : (
              <BoxButton
                {...buttonProps}
                disabled={false}
                onClick={() => {
                  setShowInviteModal(true);
                }}
              >
                <div>
                  <Image src={addBoxIcon} alt="초대하기" />
                </div>
                초대하기
              </BoxButton>
            )}
          </div>
          {members.length !== 0 && !mydashboard && (
            <div className="mr-3 flex -space-x-2 border-r border-solid border-gray-300 pr-3 md:mr-6 md:pr-6 xl:mr-9 xl:pr-9">
              {visibleMembers?.map((item, index) => (
                <ProfileImage
                  key={index}
                  size={profileImageSize}
                  nickName={item}
                />
              ))}
              {remainingCount > 0 && (
                <ProfileImage
                  size={profileImageSize}
                  nickName={"+" + remainingCount.toString()}
                />
              )}
            </div>
          )}
          <ProfileImage
            size={profileImageSize}
            nickName={myNickName as string}
            imageUrl={myProfileImage}
            onClick={() => setIsMenuOpen(true)}
          />
          {screenSize !== "mobile" && (
            <span
              className="pl-3 text-base"
              onClick={() => setIsMenuOpen(true)}
            >
              {myNickName}
            </span>
          )}
        </div>
      </nav>
      <DashboardInvite
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        dashboardId={boardId}
      />
      {isMenuOpen && (
        <LogoutDropdown isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      )}
    </>
  );
}
