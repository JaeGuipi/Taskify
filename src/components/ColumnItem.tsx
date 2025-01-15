import { useEffect, useState } from "react";
import BoardCard from "./BoardCard";
import CustomBtn from "./CustomBtn";
import CardModal from "./modal/CardModal";
import Image from "next/image";
import settingIcon from "@/../public/icons/setting.svg";
import ColumnManager from "./modal/ColumnManager";
import { useRouter } from "next/router";
import TaskFormModal from "./modal/TaskFormModal";
import { Draggable } from "@hello-pangea/dnd";

export interface Assignee {
  profileImageUrl: string;
  nickname: string;
  id: number;
}

export interface BoardCardProps {
  id: number;
  title: string;
  tags: string[];
  dueDate: string;
  assignee: Assignee;
  imageUrl: string;
  columnTitle: string;
  columnId: number;
  totalCard: number;
  isFirst: boolean;
  isLast: boolean;
  onClickReRender: () => void;
  index: number; // 추가: 드래그를 위해 필요
}

export default function ColumnItem({
  id,
  title,
  tags,
  dueDate,
  assignee,
  imageUrl,
  columnTitle,
  columnId,
  totalCard,
  isFirst,
  isLast,
  onClickReRender,
  index, // 추가
}: BoardCardProps) {
  const [showCardModal, setShowCardModal] = useState(false);
  const [showColumnManager, setShowColumnManager] = useState(false);
  const [showTaskFormModal, setShowTaskFormModal] = useState(false);
  const [screenSize, setScreenSize] = useState<string>("mobile");
  const router = useRouter();
  const dasboardId = Number(router.query["dashboardid"]);

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

  const handleUpdateColumnModalOpen = () => {
    setShowColumnManager(true);
  };

  const handleUpdateColumnModalClose = () => {
    setShowColumnManager(false);
  };

  const handleShowTaskFormModalOpen = () => {
    setShowTaskFormModal(true);
  };

  const handleShowTaskFormModalClose = () => {
    setShowTaskFormModal(false);
  };

  const handleModalOpen = () => {
    setShowCardModal(true);
  };

  const handleModalClose = () => {
    setShowCardModal(false);
  };

  return (
    <li
      className={`${
        isLast
          ? "border-gray-200 md:border-b md:border-solid md:pb-5"
          : "md:border-none md:pb-0"
      } w-full border-b border-solid border-gray-200 pb-6 text-black xl:border-none xl:pb-0 xl:pr-5`}
    >
      {/* 모바일이거나 첫 번째 ColumnItem일 때 상단 요소 렌더링 */}
      {(screenSize === "mobile" || isFirst || !id) && (
        <>
          <div className="mb-6 flex items-center justify-between xl:mb-[25px]">
            <div className="flex items-center gap-x-2">
              <div className="h-2 w-2 rounded-full bg-violet"></div>
              <div className="flex items-center gap-x-3">
                <h3 className="text-base font-bold md:text-lg">
                  {columnTitle}
                </h3>
                <small className="h-5 w-5 rounded bg-gray-200 text-center text-xs font-medium text-gray-500">
                  {totalCard}
                </small>
              </div>
            </div>
            <button type="button" onClick={handleUpdateColumnModalOpen}>
              <Image
                src={settingIcon}
                width={screenSize === "mobile" ? 22 : 24}
                height={screenSize === "mobile" ? 22 : 24}
                alt="수정"
              />
            </button>
          </div>
          <div className="mb-[10px] md:mb-4">
            <CustomBtn
              width={
                screenSize === "mobile"
                  ? 284
                  : screenSize === "tablet"
                    ? 544
                    : 314
              }
              height={screenSize === "mobile" ? 32 : 40}
              borderRadius={"6"}
              onClick={handleShowTaskFormModalOpen}
            />
          </div>
        </>
      )}

      {/* Draggable 영역을 카드 부분으로만 제한 */}
      {id && id !== 0 && totalCard > 0 && (
        <Draggable draggableId={id.toString()} index={index}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <BoardCard
                title={title}
                tags={tags}
                dueDate={dueDate}
                assignee={assignee}
                imageUrl={imageUrl}
                onClick={handleModalOpen}
              />
            </div>
          )}
        </Draggable>
      )}

      {showColumnManager && (
        <ColumnManager
          isOpen={showColumnManager}
          onClose={handleUpdateColumnModalClose}
          dashboardId={dasboardId}
          columnId={columnId}
          onClickReRender={onClickReRender}
        />
      )}
      {showTaskFormModal && (
        <TaskFormModal
          isOpen={showTaskFormModal}
          onClose={handleShowTaskFormModalClose}
          column={columnId}
          dashboardId={dasboardId}
          onClickReRender={onClickReRender}
        />
      )}
      {showCardModal && (
        <CardModal
          isOpen={showCardModal}
          onClose={handleModalClose}
          columnTitle={columnTitle}
          cardId={id}
          onClickReRender={onClickReRender}
        />
      )}
    </li>
  );
}
