
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/currencyFormatter';

interface TableWidgetProps {
  title: string;
  data: any[];
}

export const TableWidget: React.FC<TableWidgetProps> = ({ title, data }) => {
  if (!data || data.length === 0) {
    return (
      <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg col-span-2">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-8">No data available</div>
        </CardContent>
      </Card>
    );
  }

  const columns = Object.keys(data[0]);

  const formatValue = (value: any, key: string) => {
    if (value === null || value === undefined) return '-';
    
    if (typeof value === 'number') {
      if (key.toLowerCase().includes('revenue') || key.toLowerCase().includes('sales') || key.toLowerCase().includes('amount')) {
        return formatCurrency(value);
      }
      return value.toLocaleString();
    }
    
    if (typeof value === 'string' && key === 'status') {
      const statusColors = {
        critical: 'bg-red-100 text-red-800',
        warning: 'bg-yellow-100 text-yellow-800',
        good: 'bg-green-100 text-green-800'
      };
      return (
        <Badge className={statusColors[value as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}>
          {value}
        </Badge>
      );
    }
    
    return String(value);
  };

  return (
    <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 col-span-2">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                {columns.map((column) => (
                  <th key={column} className="text-left p-3 font-medium text-gray-700 capitalize">
                    {column.replace(/_/g, ' ')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  {columns.map((column) => (
                    <td key={column} className="p-3 text-gray-600">
                      {formatValue(row[column], column)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
