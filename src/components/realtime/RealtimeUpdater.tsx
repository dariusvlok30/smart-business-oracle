
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Pause, RefreshCw } from 'lucide-react';

export const RealtimeUpdater: React.FC = () => {
  const [isActive, setIsActive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [updateInterval, setUpdateInterval] = useState(30); // seconds

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setLastUpdate(new Date());
      console.log('Real-time data update triggered');
    }, updateInterval * 1000);

    return () => clearInterval(interval);
  }, [isActive, updateInterval]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-ZA', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="flex items-center justify-between bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
          <span className="text-white font-medium">
            {isActive ? 'Live Updates' : 'Updates Paused'}
          </span>
        </div>
        
        <Badge variant="secondary" className="bg-white/20 text-white border-0">
          Last Update: {formatTime(lastUpdate)}
        </Badge>
        
        <Badge variant="outline" className="border-white/30 text-white">
          Every {updateInterval}s
        </Badge>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsActive(!isActive)}
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          {isActive ? (
            <>
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Resume
            </>
          )}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setLastUpdate(new Date())}
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
