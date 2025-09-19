import React from "react";
import { LucideProps } from "lucide-react";

type LucideIcon = React.FC<LucideProps>;

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: number;
  subtitle: string;
  subtitleIcon: LucideIcon;
  borderColor: string;
  iconBgColor: string;
  iconColor: string;
  subtitleColor: string;
}

function StatCard({
  icon: Icon,
  title,
  value,
  subtitle,
  subtitleIcon: SubtitleIcon,
  borderColor,
  iconBgColor,
  iconColor,
  subtitleColor,
}: StatCardProps) {
  return (
    <div
      className={`bg-light rounded-lg border-2 border-l-4 border-gray-300 ${borderColor} p-4 transition-shadow duration-300 hover:shadow-sm`}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className={`rounded-lg ${iconBgColor} p-2`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
          <h3 className="ml-3 text-lg font-semibold text-gray-800">{title}</h3>
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          <p className={`mt-1 flex items-center text-sm ${subtitleColor}`}>
            {SubtitleIcon && <SubtitleIcon className="mr-1 h-4 w-4" />}
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}

export default StatCard;
