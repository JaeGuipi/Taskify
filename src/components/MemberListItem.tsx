import { useEffect, useState } from "react";
import BoxButton from "./BoxButton";
import ProfileImage from "./ProfileImage";

interface MemberListItemProps {
  memberId: number;
  memberName: string;
  isOwner: boolean; // 추가
  onClick: (memberId: number) => void;
}

export default function MemberListItem({
  memberId,
  memberName,
  isOwner,
  onClick,
}: MemberListItemProps) {
  const [screenSize, setScreenSize] = useState<string>("mobile");

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setScreenSize("mobile");
      } else if (width < 1280) {
        setScreenSize("tablet");
      } else {
        setScreenSize("pc");
      }
    };

    handleResize(); // 초기 사이즈 설정
    window.addEventListener("resize", handleResize); // 리사이즈 이벤트 리스너 등록

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <li className="flex items-center justify-between border-b border-solid border-gray-200 px-5 pb-3 pt-3 first:pt-[13px] last:border-0 last:pb-4 md:px-7 md:pb-4 md:pt-4 md:first:pt-[17px] md:last:pb-5">
      <div className="md: flex items-center gap-x-2 md:gap-x-3">
        <ProfileImage
          size={screenSize === "mobile" ? "medium" : "large"}
          nickName={memberName}
        />
        <p className="text-sm font-normal md:text-base">{memberName}</p>
      </div>
      {!isOwner && ( // isOwner가 false일 때만 삭제 버튼 표시
        <BoxButton
          paddingTopBottom={screenSize === "mobile" ? "7" : "4"}
          paddingRightLeft={screenSize === "mobile" ? "16" : "30"}
          radius="4"
          backgroundColor="white"
          fontSize={screenSize === "mobile" ? "12" : "14"}
          disabled={false}
          onClick={() => onClick(memberId)}
        >
          삭제
        </BoxButton>
      )}
    </li>
  );
}
