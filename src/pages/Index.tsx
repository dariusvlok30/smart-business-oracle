
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { DatabaseService } from '@/services/DatabaseService';
import { OllamaService } from '@/services/OllamaService';
import { DashboardGrid } from '@/components/dashboard/DashboardGrid';
import { ConnectionForm } from '@/components/connection/ConnectionForm';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { InsightPanel } from '@/components/insights/InsightPanel';
import { ExportCenter } from '@/components/export/ExportCenter';
import { RealtimeUpdater } from '@/components/realtime/RealtimeUpdater';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { formatCurrency } from '@/utils/currencyFormatter';
import { Database, Bot, TrendingUp, FileText, Settings } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [connectionConfig, setConnectionConfig] = useState({
    database: {
      host: '10.51.0.11:3306',
      database: 'pinnacle_inventory_data',
      username: 'root',
      password: 'P!nnacl3451qaz'
    },
    ai: {
      endpoint: '10.51.0.15:11434',
      model: 'qwen2.5:7b'
    }
  });

  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  // Initialize services
  const databaseService = new DatabaseService(connectionConfig.database);
  const ollamaService = new OllamaService(connectionConfig.ai);

  // Test connections and auto-discover schema
  const { data: connectionTest, isLoading: isConnecting } = useQuery({
    queryKey: ['connection-test', connectionConfig],
    queryFn: async () => {
      try {
        setConnectionStatus('connecting');
        
        // Test database connection
        const dbStatus = await databaseService.testConnection();
        console.log('Database connection test:', dbStatus);
        
        // Test AI connection
        const aiStatus = await ollamaService.testConnection();
        console.log('AI connection test:', aiStatus);
        
        if (dbStatus.success && aiStatus.success) {
          setIsConnected(true);
          setConnectionStatus('connected');
          toast({
            title: "Connection Successful",
            description: "Database and AI services are ready. Discovering schema...",
          });
          
          // Auto-discover database schema
          const schema = await databaseService.discoverSchema();
          console.log('Discovered schema:', schema);
          
          return { 
            database: dbStatus, 
            ai: aiStatus, 
            schema,
            success: true 
          };
        } else {
          setConnectionStatus('error');
          toast({
            title: "Connection Failed",
            description: "Please check your database and AI service configurations.",
            variant: "destructive"
          });
          return { success: false, database: dbStatus, ai: aiStatus };
        }
      } catch (error) {
        console.error('Connection error:', error);
        setConnectionStatus('error');
        toast({
          title: "Connection Error",
          description: "Failed to connect to services. Check network connectivity.",
          variant: "destructive"
        });
        return { success: false, error: error.message };
      }
    },
    enabled: !!connectionConfig.database.host && !!connectionConfig.ai.endpoint,
    retry: 3,
    retryDelay: 2000
  });

  // Fetch dashboard data once connected
  const { data: dashboardData, isLoading: isDashboardLoading } = useQuery({
    queryKey: ['dashboard-data'],
    queryFn: async () => {
      if (!isConnected) return null;
      
      try {
        console.log('Fetching dashboard data...');
        
        // Get all available tables and their data
        const tablesData = await databaseService.getAllTablesData();
        console.log('Tables data:', tablesData);
        
        // Generate AI insights
        const insights = await ollamaService.generateInsights(tablesData);
        console.log('Generated insights:', insights);
        
        // Create automated dashboards
        const dashboards = await ollamaService.generateDashboards(tablesData);
        console.log('Generated dashboards:', dashboards);
        
        return {
          tables: tablesData,
          insights,
          dashboards,
          lastUpdated: new Date()
        };
      } catch (error) {
        console.error('Dashboard data error:', error);
        toast({
          title: "Data Loading Error",
          description: "Failed to load dashboard data. Retrying...",
          variant: "destructive"
        });
        throw error;
      }
    },
    enabled: isConnected,
    refetchInterval: 30000, // Refresh every 30 seconds
    retry: 2
  });

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'bg-green-500';
      case 'connecting': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'Connected & Ready';
      case 'connecting': return 'Connecting...';
      case 'error': return 'Connection Error';
      default: return 'Disconnected';
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-md border-b border-white/20">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 p-3 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Smart Business Oracle</h1>
                  <p className="text-blue-100">AI-Powered Business Intelligence Platform</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <Badge variant="secondary" className={`${getStatusColor()} text-white border-0`}>
                  <div className="w-2 h-2 rounded-full bg-white mr-2"></div>
                  {getStatusText()}
                </Badge>
                
                {isConnected && (
                  <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8">
          {!isConnected ? (
            <div className="max-w-2xl mx-auto">
              <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-gray-800">System Configuration</CardTitle>
                  <CardDescription>
                    Configure your database and AI connections for automated BI generation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isConnecting ? (
                    <div className="flex flex-col items-center space-y-4 py-8">
                      <LoadingSpinner size="lg" />
                      <p className="text-gray-600">Testing connections and discovering schema...</p>
                    </div>
                  ) : (
                    <ConnectionForm 
                      config={connectionConfig}
                      onChange={setConnectionConfig}
                      onConnect={() => window.location.reload()}
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <Tabs defaultValue="dashboard" className="space-y-6">
              <TabsList className="bg-white/20 backdrop-blur-md border-0">
                <TabsTrigger value="dashboard" className="data-[state=active]:bg-white data-[state=active]:text-blue-900">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger value="insights" className="data-[state=active]:bg-white data-[state=active]:text-blue-900">
                  <Bot className="h-4 w-4 mr-2" />
                  AI Insights
                </TabsTrigger>
                <TabsTrigger value="data" className="data-[state=active]:bg-white data-[state=active]:text-blue-900">
                  <Database className="h-4 w-4 mr-2" />
                  Data Explorer
                </TabsTrigger>
                <TabsTrigger value="reports" className="data-[state=active]:bg-white data-[state=active]:text-blue-900">
                  <FileText className="h-4 w-4 mr-2" />
                  Reports
                </TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard" className="space-y-6">
                {isDashboardLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <LoadingSpinner size="lg" />
                    <span className="ml-4 text-white">Generating intelligent dashboards...</span>
                  </div>
                ) : (
                  <>
                    <RealtimeUpdater />
                    <DashboardGrid data={dashboardData} />
                  </>
                )}
              </TabsContent>

              <TabsContent value="insights" className="space-y-6">
                <InsightPanel insights={dashboardData?.insights} data={dashboardData?.tables} />
              </TabsContent>

              <TabsContent value="data" className="space-y-6">
                <div className="grid gap-6">
                  {dashboardData?.tables?.map((table, index) => (
                    <Card key={index} className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="text-gray-800">{table.name}</CardTitle>
                        <CardDescription>
                          {table.rowCount?.toLocaleString()} records • Last updated: {new Date().toLocaleTimeString()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b">
                                {table.columns?.slice(0, 5).map((column, idx) => (
                                  <th key={idx} className="text-left p-2 font-medium text-gray-700">
                                    {column.name}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {table.sampleData?.slice(0, 5).map((row, idx) => (
                                <tr key={idx} className="border-b">
                                  {Object.values(row).slice(0, 5).map((value, colIdx) => (
                                    <td key={colIdx} className="p-2 text-gray-600">
                                      {typeof value === 'number' && table.columns[colIdx]?.type?.includes('DECIMAL') 
                                        ? formatCurrency(value)
                                        : String(value || '-')
                                      }
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="reports" className="space-y-6">
                <ExportCenter data={dashboardData} />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Index;
