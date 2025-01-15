// Column.tsx

import { useEffect, useState } from "react";
import { getCardList } from "@/libs/api/cards";
import ColumnItem from "./ColumnItem";
import { Droppable } from "@hello-pangea/dnd";
import { Card } from "@/pages/dashboard/[dashboardid]";

export interface ColumnProps {
  columnId: number;
  columnTitle: string;
  isFirst: boolean;
  onClickReRender: () => void;
  setColumnCardList: (
    columnId: number,
    setCardList: React.Dispatch<React.SetStateAction<Card[]>>,
  ) => void; // 추가
}

export default function Column({
  columnId,
  columnTitle,
  isFirst,
  onClickReRender,
  setColumnCardList, // 추가
}: ColumnProps) {
  const [cardList, setCardList] = useState<Card[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cardListResponse = await getCardList(columnId);
        console.log("API 응답:", cardListResponse); // 응답 확인
        setCardList(cardListResponse.cards ?? []);
      } catch (error) {
        console.error("카드 목록 조회 실패: ", error);
      }
    };

    fetchData();
  }, [columnId]);

  // setCardList 함수를 Page 컴포넌트에 전달
  useEffect(() => {
    setColumnCardList(columnId, setCardList);
  }, [setColumnCardList, columnId]);

  return (
    <div
      className={`flex h-fit flex-col bg-gray-100 px-3 pt-8 md:w-[584px] md:px-5 ${
        isFirst ? "pt-4" : ""
      } ${
        isFirst ? "md:pt-[22px]" : "md:pt-0"
      } md:pb-[22px] xl:border-b-0 xl:border-r xl:border-solid xl:border-gray-200 xl:pr-0 xl:pt-[22px]`}
    >
      {/* Droppable로 감싸기 */}
      <Droppable droppableId={`column-${columnId}`} type="CARD">
        {(provided) => (
          <ul
            className="flex flex-col gap-y-8 md:gap-y-5 xl:gap-y-4"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {cardList.length > 0 ? (
              cardList.map((item, index) => (
                <ColumnItem
                  key={item.id}
                  {...item}
                  columnTitle={columnTitle}
                  columnId={columnId}
                  totalCard={cardList.length}
                  isFirst={index === 0}
                  isLast={index === cardList.length - 1}
                  onClickReRender={onClickReRender}
                  index={index}
                />
              ))
            ) : (
              // 카드가 없을 때의 ColumnItem
              <ColumnItem
                key={0}
                id={-1}
                title="No Cards"
                tags={[]}
                dueDate=""
                assignee={{
                  profileImageUrl: "",
                  nickname: "No Assignee",
                  id: -1,
                }}
                imageUrl=""
                columnTitle={columnTitle}
                columnId={columnId}
                totalCard={0}
                isFirst={true}
                isLast={true}
                onClickReRender={onClickReRender}
                index={0}
              />
            )}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </div>
  );
}
