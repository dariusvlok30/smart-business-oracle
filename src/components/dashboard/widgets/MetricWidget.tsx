
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '@/utils/currencyFormatter';

interface MetricWidgetProps {
  title: string;
  data: {
    value: number;
    change?: number;
    period?: string;
    currency?: boolean;
  };
}

export const MetricWidget: React.FC<MetricWidgetProps> = ({ title, data }) => {
  const isPositive = (data.change || 0) >= 0;
  const displayValue = data.currency !== false ? formatCurrency(data.value) : data.value.toLocaleString();

  return (
    <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-2xl font-bold text-gray-900">{displayValue}</div>
          
          {data.change !== undefined && (
            <div className="flex items-center space-x-2">
              <Badge 
                variant={isPositive ? "default" : "destructive"}
                className={`${
                  isPositive 
                    ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                    : 'bg-red-100 text-red-800 hover:bg-red-100'
                }`}
              >
                {isPositive ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {Math.abs(data.change).toFixed(1)}%
              </Badge>
              
              {data.period && (
                <span className="text-sm text-gray-500">{data.period}</span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
