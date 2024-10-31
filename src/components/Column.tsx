import { useEffect, useState } from "react";
import { getCardList } from "@/libs/api/cards";
import ColumnItem from "./ColumnItem";

interface ColumnProps {
  columnId: number;
  columnTitle: string;
  isFirst: boolean;
}

interface CardList {
  id: number;
  title: string;
  description: string;
  tags: string[];
  dueDate: string;
  assignee: {
    profileImageUrl: string;
    nickname: string;
    id: number;
  };
  imageUrl: string;
  teamId: string;
  columnId: number;
  createdAt: string;
  updatedAt: string;
}

export default function Column({
  columnId,
  columnTitle,
  isFirst,
}: ColumnProps) {
  const [cardList, setCardList] = useState<CardList[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cardList = await getCardList(columnId);
        setCardList(cardList.cards);
      } catch (error) {
        console.error("카드 목록 조회 실패: ", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div
      className={`flex h-fit flex-col bg-gray-100 px-3 md:w-[584px] md:p-5 ${isFirst ? "pt-4" : ""}`}
    >
      <ul className="flex flex-col gap-y-8">
        {cardList?.map((item, index) => (
          <ColumnItem
            key={item.id}
            {...item}
            columnTitle={columnTitle}
            columnId={columnId}
            totalCard={cardList.length}
            isFirst={index === 0}
          />
        ))}
      </ul>
    </div>
  );
}
