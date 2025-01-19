// src/components/dashboard/StatsCard.jsx
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

const StatsCard = ({ title, value, change, changeType, icon: Icon }) => {
  const isPositive = changeType === 'increase';

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              {title}
            </p>
            <p className="text-2xl font-bold">
              {value}
            </p>
          </div>
          {Icon && (
            <div className="rounded-full p-2 bg-secondary">
              <Icon className="h-4 w-4 text-secondary-foreground" />
            </div>
          )}
        </div>
        <div className="mt-4 flex items-center">
          {isPositive ? (
            <ArrowUpIcon className="h-4 w-4 text-green-600" />
          ) : (
            <ArrowDownIcon className="h-4 w-4 text-red-600" />
          )}
          <span className={`ml-1 text-sm font-medium ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {change}%
          </span>
          <span className="ml-2 text-sm text-muted-foreground">
            vs. mes anterior
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;