
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, AlertTriangle, Lightbulb, FileText, Bot } from 'lucide-react';
import { formatCurrency } from '@/utils/currencyFormatter';

interface InsightData {
  title: string;
  description: string;
  type: 'trend' | 'alert' | 'opportunity' | 'summary';
  confidence: number;
  data?: any;
}

interface InsightPanelProps {
  insights?: InsightData[];
  data?: any;
}

export const InsightPanel: React.FC<InsightPanelProps> = ({ insights, data }) => {
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'trend': return <TrendingUp className="h-5 w-5" />;
      case 'alert': return <AlertTriangle className="h-5 w-5" />;
      case 'opportunity': return <Lightbulb className="h-5 w-5" />;
      case 'summary': return <FileText className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'trend': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'alert': return 'bg-red-100 text-red-800 border-red-200';
      case 'opportunity': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'summary': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'bg-green-100 text-green-800';
    if (confidence >= 0.7) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  if (!insights || insights.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-white/95 backdrop-blur-sm rounded-lg p-8 max-w-md mx-auto">
          <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">AI insights are being generated...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">AI-Powered Business Insights</h2>
        <p className="text-blue-100">Intelligent analysis of your business data</p>
      </div>

      <div className="grid gap-6">
        {insights.map((insight, index) => (
          <Card key={index} className="bg-white/95 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getInsightColor(insight.type)}`}>
                    {getInsightIcon(insight.type)}
                  </div>
                  <div>
                    <CardTitle className="text-lg text-gray-800">{insight.title}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={getInsightColor(insight.type).split(' ')[0] + ' ' + getInsightColor(insight.type).split(' ')[1]}>
                        {insight.type.toUpperCase()}
                      </Badge>
                      <Badge className={getConfidenceColor(insight.confidence)}>
                        {Math.round(insight.confidence * 100)}% Confidence
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">{insight.description}</p>
              
              {insight.data && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">Key Metrics:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(insight.data).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <p className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                        <p className="font-semibold text-gray-900">
                          {typeof value === 'number' && key.toLowerCase().includes('sales') 
                            ? formatCurrency(value)
                            : String(value)
                          }
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Recommendations */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-blue-800 flex items-center">
            <Lightbulb className="h-6 w-6 mr-2" />
            AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-white rounded-lg border border-blue-100">
              <h4 className="font-medium text-blue-800 mb-2">Immediate Actions</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Restock Nike and Adidas products to prevent stockouts</li>
                <li>Launch targeted campaign for inactive customers</li>
                <li>Focus marketing on high-performing categories</li>
              </ul>
            </div>
            
            <div className="p-4 bg-white rounded-lg border border-blue-100">
              <h4 className="font-medium text-blue-800 mb-2">Strategic Opportunities</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Expand electronics category given strong performance</li>
                <li>Implement loyalty program for top customers</li>
                <li>Optimize pricing for slow-moving inventory</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
