import Image from "next/image";

interface Dashboard {
  title: string;
  color: string;
  createdByMe: boolean;
}

interface DashboardCardProps {
  dashboard: Dashboard;
  isArrow?: boolean;
  isResponse?: boolean;
}

export default function DashboardCard({
  dashboard,
  isArrow = false,
  isResponse = false,
}: DashboardCardProps) {
  return (
    <div
      className={`xl:px- flex items-center py-4 xl:py-6 ${isResponse ? "justify-between px-7" : "justify-center md:px-3 xl:px-4"} md:justify-between`}
    >
      <div className="flex max-w-[150px] items-center gap-2 md:w-full md:gap-4 xl:max-w-[250px] xl:gap-5">
        <span
          className="flex h-2 w-2 flex-shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: dashboard.color }}
        />
        {isResponse ? (
          <span className="mx-3 overflow-hidden text-ellipsis text-base font-medium text-gray-500 md:mx-2">
            {dashboard.title}
          </span>
        ) : (
          <span className="hidden overflow-hidden text-ellipsis whitespace-nowrap font-medium text-gray-500 md:inline md:text-sm xl:text-lg">
            {dashboard.title}
          </span>
        )}

        {dashboard.createdByMe && isResponse ? (
          <Image src="/svg/crown.svg" width={17} height={14} alt="Crown" />
        ) : (
          <div className={"hidden md:inline"}>
            {dashboard.createdByMe && (
              <Image src="/svg/crown.svg" width={17} height={14} alt="Crown" />
            )}
          </div>
        )}
      </div>
      {isArrow ? (
        <Image src="/svg/dashboardArrow.svg" width={18} height={18} alt=">" />
      ) : null}
    </div>
  );
}
