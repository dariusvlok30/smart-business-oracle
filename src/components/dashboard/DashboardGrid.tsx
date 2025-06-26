
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MetricWidget } from './widgets/MetricWidget';
import { ChartWidget } from './widgets/ChartWidget';
import { TableWidget } from './widgets/TableWidget';
import { GaugeWidget } from './widgets/GaugeWidget';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface DashboardGridProps {
  data: any;
}

export const DashboardGrid: React.FC<DashboardGridProps> = ({ data }) => {
  if (!data?.dashboards) {
    return (
      <div className="text-center py-12">
        <p className="text-white/70">No dashboard data available</p>
      </div>
    );
  }

  const renderWidget = (widget: any) => {
    const commonProps = {
      key: widget.id,
      title: widget.title,
      data: widget.data
    };

    switch (widget.type) {
      case 'metric':
        return <MetricWidget {...commonProps} />;
      case 'chart':
        return <ChartWidget {...commonProps} chartType={widget.chartType} />;
      case 'table':
        return <TableWidget {...commonProps} />;
      case 'gauge':
        return <GaugeWidget {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {data.dashboards.map((dashboard: any, index: number) => (
        <div key={index} className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-2">{dashboard.title}</h2>
            <p className="text-blue-100">{dashboard.description}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {dashboard.widgets.map(renderWidget)}
          </div>
        </div>
      ))}
      
      {/* Quick Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">15,420</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Customers</p>
                <p className="text-2xl font-bold text-gray-900">3,205</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sales Transactions</p>
                <p className="text-2xl font-bold text-gray-900">89,340</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-2xl font-bold text-gray-900">45</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Minus className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
