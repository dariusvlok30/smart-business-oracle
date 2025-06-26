
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Bot } from 'lucide-react';

interface ConnectionConfig {
  database: {
    host: string;
    database: string;
    username: string;
    password: string;
  };
  ai: {
    endpoint: string;
    model: string;
  };
}

interface ConnectionFormProps {
  config: ConnectionConfig;
  onChange: (config: ConnectionConfig) => void;
  onConnect: () => void;
}

export const ConnectionForm: React.FC<ConnectionFormProps> = ({ config, onChange, onConnect }) => {
  const updateDatabaseConfig = (field: string, value: string) => {
    onChange({
      ...config,
      database: {
        ...config.database,
        [field]: value
      }
    });
  };

  const updateAIConfig = (field: string, value: string) => {
    onChange({
      ...config,
      ai: {
        ...config.ai,
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-800">
            <Database className="h-5 w-5 mr-2" />
            Database Configuration
          </CardTitle>
          <CardDescription>
            Configure your MySQL database connection for automated data discovery
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="db-host">Host:Port</Label>
              <Input
                id="db-host"
                value={config.database.host}
                onChange={(e) => updateDatabaseConfig('host', e.target.value)}
                placeholder="10.51.0.11:3306"
              />
            </div>
            <div>
              <Label htmlFor="db-name">Database Name</Label>
              <Input
                id="db-name"
                value={config.database.database}
                onChange={(e) => updateDatabaseConfig('database', e.target.value)}
                placeholder="pinnacle_inventory_data"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="db-username">Username</Label>
              <Input
                id="db-username"
                value={config.database.username}
                onChange={(e) => updateDatabaseConfig('username', e.target.value)}
                placeholder="root"
              />
            </div>
            <div>
              <Label htmlFor="db-password">Password</Label>
              <Input
                id="db-password"
                type="password"
                value={config.database.password}
                onChange={(e) => updateDatabaseConfig('password', e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center text-green-800">
            <Bot className="h-5 w-5 mr-2" />
            AI Model Configuration
          </CardTitle>
          <CardDescription>
            Configure your Ollama AI service for intelligent dashboard generation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ai-endpoint">Ollama Endpoint</Label>
              <Input
                id="ai-endpoint"
                value={config.ai.endpoint}
                onChange={(e) => updateAIConfig('endpoint', e.target.value)}
                placeholder="10.51.0.15:11434"
              />
            </div>
            <div>
              <Label htmlFor="ai-model">Model Name</Label>
              <Input
                id="ai-model"
                value={config.ai.model}
                onChange={(e) => updateAIConfig('model', e.target.value)}
                placeholder="qwen2.5:7b"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button 
          onClick={onConnect}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
          size="lg"
        >
          Connect & Auto-Generate BI Platform
        </Button>
      </div>
    </div>
  );
};
