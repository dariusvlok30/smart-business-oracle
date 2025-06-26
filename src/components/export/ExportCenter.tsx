
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Mail, Calendar, TrendingUp } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ExportCenterProps {
  data?: any;
}

export const ExportCenter: React.FC<ExportCenterProps> = ({ data }) => {
  const [selectedReport, setSelectedReport] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const reportTypes = [
    {
      id: 'executive',
      name: 'Executive Dashboard',
      description: 'High-level KPIs and business performance summary',
      icon: <TrendingUp className="h-5 w-5" />
    },
    {
      id: 'sales',
      name: 'Sales Performance Report',
      description: 'Detailed sales analytics by product, category, and time period',
      icon: <FileText className="h-5 w-5" />
    },
    {
      id: 'inventory',
      name: 'Inventory Management Report',
      description: 'Stock levels, turnover rates, and reorder recommendations',
      icon: <FileText className="h-5 w-5" />
    },
    {
      id: 'customer',
      name: 'Customer Analytics Report',
      description: 'Customer behavior, segmentation, and lifetime value analysis',
      icon: <FileText className="h-5 w-5" />
    },
    {
      id: 'financial',
      name: 'Financial Performance Report',
      description: 'Revenue, profitability, and financial KPIs with ZAR formatting',
      icon: <FileText className="h-5 w-5" />
    }
  ];

  const handleExport = async (format: 'excel' | 'pdf') => {
    if (!selectedReport) {
      toast({
        title: "Please select a report",
        description: "Choose a report type before exporting",
        variant: "destructive"
      });
      return;
    }

    setIsExporting(true);
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const reportName = reportTypes.find(r => r.id === selectedReport)?.name || 'Report';
      const fileName = `${reportName}_${new Date().toISOString().split('T')[0]}.${format}`;
      
      // In real implementation, this would generate and download the actual file
      console.log(`Exporting ${fileName}...`);
      
      toast({
        title: "Export Successful",
        description: `${reportName} has been exported as ${format.toUpperCase()}`,
      });
      
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error generating the report",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleScheduleReport = () => {
    toast({
      title: "Report Scheduled",
      description: "Automated reports will be sent to your email daily at 9:00 AM",
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Export & Reporting Center</h2>
        <p className="text-blue-100">Generate comprehensive business reports with AI insights</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Report Selection */}
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">Available Reports</CardTitle>
            <CardDescription>
              Select a report type to export with AI-generated insights and analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {reportTypes.map((report) => (
              <div
                key={report.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedReport === report.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setSelectedReport(report.id)}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${
                    selectedReport === report.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {report.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{report.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                    {selectedReport === report.id && (
                      <Badge className="mt-2 bg-blue-100 text-blue-800">Selected</Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Export Options */}
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">Export Options</CardTitle>
            <CardDescription>
              Choose your preferred format and delivery method
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-800">Export Formats</h4>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => handleExport('excel')}
                  disabled={!selectedReport || isExporting}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Excel
                </Button>
                <Button
                  onClick={() => handleExport('pdf')}
                  disabled={!selectedReport || isExporting}
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-50"
                >
                  <Download className="h-4 w-4 mr-2" />
                  PDF
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-800">Automated Reporting</h4>
              <div className="space-y-3">
                <Button
                  onClick={handleScheduleReport}
                  variant="outline"
                  className="w-full border-blue-200 text-blue-600 hover:bg-blue-50"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Daily Reports
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-purple-200 text-purple-600 hover:bg-purple-50"
                  disabled
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Email Distribution (Pro)
                </Button>
              </div>
            </div>

            {isExporting && (
              <div className="text-center py-4">
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Generating report with AI insights...</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800">Report Preview</CardTitle>
          <CardDescription>
            What will be included in your selected report
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedReport ? (
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Data Points</h4>
                <p className="text-2xl font-bold text-blue-900">15,420+</p>
                <p className="text-sm text-blue-600">Records analyzed</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">AI Insights</h4>
                <p className="text-2xl font-bold text-green-900">8</p>
                <p className="text-sm text-green-600">Generated insights</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-800 mb-2">Visualizations</h4>
                <p className="text-2xl font-bold text-purple-900">12</p>
                <p className="text-sm text-purple-600">Charts & graphs</p>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              Select a report type to see preview details
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
