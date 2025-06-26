
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface GaugeWidgetProps {
  title: string;
  data: {
    value: number;
    max: number;
    status: 'good' | 'warning' | 'critical';
  };
}

export const GaugeWidget: React.FC<GaugeWidgetProps> = ({ title, data }) => {
  const percentage = (data.value / data.max) * 100;
  const angle = (percentage / 100) * 180 - 90;

  const getStatusColor = () => {
    switch (data.status) {
      case 'good': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getProgressColor = () => {
    switch (data.status) {
      case 'good': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'critical': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="relative w-32 h-16 mb-4">
          <svg className="w-full h-full" viewBox="0 0 128 64">
            {/* Background arc */}
            <path
              d="M 10 54 A 54 54 0 0 1 118 54"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="8"
              strokeLinecap="round"
            />
            {/* Progress arc */}
            <path
              d="M 10 54 A 54 54 0 0 1 118 54"
              fill="none"
              stroke={getProgressColor()}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${percentage * 1.7} 200`}
              className="transition-all duration-1000 ease-out"
            />
            {/* Pointer */}
            <line
              x1="64"
              y1="54"
              x2="64"
              y2="20"
              stroke={getProgressColor()}
              strokeWidth="3"
              strokeLinecap="round"
              transform={`rotate(${angle} 64 54)`}
              className="transition-all duration-1000 ease-out"
            />
            {/* Center dot */}
            <circle cx="64" cy="54" r="4" fill={getProgressColor()} />
          </svg>
        </div>
        
        <div className="text-center space-y-2">
          <div className="text-2xl font-bold text-gray-900">{data.value}%</div>
          <Badge className={getStatusColor()}>
            {data.status.toUpperCase()}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
