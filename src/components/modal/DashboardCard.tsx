import Image from "next/image";

interface Dashboard {
  title: string;
  color: string;
  createdByMe: boolean;
}

interface DashboardCardProps {
  dashboard: Dashboard;
  isArrow?: "true";
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  dashboard,
  isArrow,
}) => {
  return (
    // <div className="flex">
    <div className="flex items-center justify-between bg-white p-5">
      <div className="flex items-center gap-3">
        <div
          className="flex h-2 w-2 items-center justify-center rounded-full"
          style={{ backgroundColor: dashboard.color }}
        />
        <span className="text-lg font-medium text-gray-500">
          {dashboard.title}
        </span>
        {dashboard.createdByMe ? (
          <Image src="/svg/crown.svg" width={17} height={14} alt="Crown" />
        ) : null}
      </div>
      {isArrow ? (
        <Image src="/svg/dashboardArrow.svg" width={18} height={18} alt=">" />
      ) : (
        ""
      )}
    </div>
    // </div>
  );
};

export default DashboardCard;
