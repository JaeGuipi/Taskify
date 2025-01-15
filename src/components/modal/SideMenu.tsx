import { useEffect, useState } from "react";
import Link from "next/link";
import { getDashboardList } from "@/libs/api/dashboards";
import Image from "next/image";
import CreateDashboardModal from "./CreateDashboardModal";
import DashboardPagination from "./DashboardPagination";
import DashboardCard from "./DashboardCard";
import { useRouter } from "next/router";
import NavigateButton from "./NavigateButton";
import { useAtom } from "jotai";
import {
  dashboardCountAtom,
  dashboardListAtom,
  dashboardPageAtom,
} from "@/atoms/dashboardInfoAtom";

export default function SideMenu() {
  // 대시보드 데이터 불러오기
  // Jotai Atom 사용
  const [dashboardData, setDashboardData] = useAtom(dashboardListAtom);
  const [dashboardCount, setDashboardCount] = useAtom(dashboardCountAtom);
  const [dashboardPage, setDashboardPage] = useAtom(dashboardPageAtom);
  // 왼쪽 사이드바에서 대시보드 목록을 보여주고 생성하는 컴포넌트
  // 새로운 대시보드 모달창 열기
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const router = useRouter();

  const loadDashboard = async (): Promise<void> => {
    const data = await getDashboardList({
      navigationMethod: "pagination",
      page: dashboardPage,
      size: 10,
    });
    setDashboardData(data.dashboards);
    setDashboardCount(data.totalCount);
  };

  useEffect(() => {
    const loadDashboard = async (): Promise<void> => {
      const data = await getDashboardList({
        navigationMethod: "pagination",
        page: dashboardPage,
        size: 10,
      });
      setDashboardData(data.dashboards);
      setDashboardCount(data.totalCount);
    };
    loadDashboard();
  }, [dashboardPage]);

  // 대시보드 상세페이지 이동
  const handleNavigate = (id: number | string) => {
    router.push(`/dashboard/${id}`);
  };

  return (
    <div className="fixed left-0 top-0 z-20 h-screen w-[68px] overflow-y-auto md:w-52 xl:w-72">
      <div
        className={
          "flex h-screen w-[68px] min-w-[68px] flex-col gap-2.5 border-r border-r-gray-300 bg-white px-2 py-5 md:w-52 md:min-w-52 xl:w-72 xl:min-w-72"
        }
      >
        {/* 상단  */}
        <div className={"mb-5 ml-2 flex justify-center md:justify-start"}>
          <Link href={"/mydashboard"}>
            <Image
              src="/logo/midLogo.svg"
              alt="로고이미지"
              width={109}
              height={33}
              className={"hidden md:block"}
            />
            <Image
              src="/logo/smallLogo.svg"
              alt="로고이미지"
              width={30}
              height={30}
              className={"block md:hidden"}
            />
          </Link>
        </div>
        <div
          className={
            "flex items-center justify-center md:justify-between md:px-2 xl:px-3"
          }
        >
          <span
            className={
              "hidden text-xs font-bold text-gray-500 md:inline xl:text-base"
            }
          >
            Dash Boards
          </span>
          <button onClick={openModal}>
            <Image
              src="/icons/sideMenuPlus.svg"
              alt="작은 +"
              width={25}
              height={25}
              className={"block md:block"}
            />
          </button>
        </div>

        {/* 페이지 이동 버튼 */}
        <div
          className={
            "mt-2 flex flex-col border-b border-t border-b-gray-300 border-t-gray-300 py-1 md:py-2 xl:py-3"
            // md:px-1 md:py-5 xl:gap-6 xl:px-4"
          }
        >
          <NavigateButton
            icon={"📝"}
            link={"/mydashboard"}
            text={"My Dashboard"}
          />
          <NavigateButton icon={"🎈"} link={"/mypage"} text={"My Account"} />
        </div>

        {/* 대시보드 목록  */}
        <ul className="space-y-1">
          {dashboardData.map((dashboard) => {
            return (
              <li
                key={dashboard.id}
                onClick={() => handleNavigate(dashboard.id)}
                className={"cursor-pointer rounded-lg hover:bg-violet-8"}
              >
                <DashboardCard dashboard={dashboard} />
              </li>
            );
          })}
        </ul>
        {/* 페이지네이션 버튼 */}
        <div className="hidden md:block">
          <DashboardPagination
            dashboardCount={dashboardCount}
            dashboardPage={dashboardPage}
            setDashboardPage={setDashboardPage}
            data={10}
          />
        </div>
      </div>
      {/* 모달창  */}
      <CreateDashboardModal
        isOpen={isModalOpen}
        refresh={loadDashboard}
        closeModal={closeModal}
      />
    </div>
  );
}
