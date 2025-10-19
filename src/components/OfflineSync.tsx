import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  Database,
  Upload,
  Download,
  Cloud,
  CloudOff
} from "lucide-react";

interface SyncStatus {
  isOnline: boolean;
  lastSync: Date | null;
  pendingChanges: number;
  isSyncing: boolean;
  syncProgress: number;
  error: string | null;
}

interface PendingChange {
  id: string;
  type: 'create' | 'update' | 'delete';
  entity: string;
  data: any;
  timestamp: Date;
}

export default function OfflineSync() {
  const { toast } = useToast();
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isOnline: navigator.onLine,
    lastSync: null,
    pendingChanges: 0,
    isSyncing: false,
    syncProgress: 0,
    error: null
  });
  const [pendingChanges, setPendingChanges] = useState<PendingChange[]>([]);

  useEffect(() => {
    const handleOnline = () => {
      setSyncStatus(prev => ({ ...prev, isOnline: true, error: null }));
      toast({ title: "Connection restored", description: "You're back online. Syncing changes..." });
      // Auto-sync when coming back online
      setTimeout(() => {
        handleSync();
      }, 1000);
    };

    const handleOffline = () => {
      setSyncStatus(prev => ({ ...prev, isOnline: false }));
      toast({ title: "Connection lost", description: "You're now offline. Changes will be synced when connection is restored." });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load pending changes from localStorage
    loadPendingChanges();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadPendingChanges = () => {
    try {
      const stored = localStorage.getItem('app.pendingChanges');
      if (stored) {
        const changes = JSON.parse(stored);
        setPendingChanges(changes);
        setSyncStatus(prev => ({ ...prev, pendingChanges: changes.length }));
      }
    } catch (error) {
      console.error('Error loading pending changes:', error);
    }
  };

  const savePendingChanges = (changes: PendingChange[]) => {
    try {
      localStorage.setItem('app.pendingChanges', JSON.stringify(changes));
      setPendingChanges(changes);
      setSyncStatus(prev => ({ ...prev, pendingChanges: changes.length }));
    } catch (error) {
      console.error('Error saving pending changes:', error);
    }
  };

  const addPendingChange = (change: Omit<PendingChange, 'id' | 'timestamp'>) => {
    const newChange: PendingChange = {
      ...change,
      id: `change_${Date.now()}_${Math.random()}`,
      timestamp: new Date()
    };
    
    const updatedChanges = [...pendingChanges, newChange];
    savePendingChanges(updatedChanges);
    
    if (syncStatus.isOnline) {
      // Try to sync immediately if online
      handleSync();
    }
  };

  const handleSync = async () => {
    if (!syncStatus.isOnline || pendingChanges.length === 0) return;

    setSyncStatus(prev => ({ ...prev, isSyncing: true, error: null }));

    try {
      // Simulate sync process
      for (let i = 0; i < pendingChanges.length; i++) {
        const change = pendingChanges[i];
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Update progress
        const progress = Math.round(((i + 1) / pendingChanges.length) * 100);
        setSyncStatus(prev => ({ ...prev, syncProgress: progress }));
      }

      // Clear pending changes after successful sync
      savePendingChanges([]);
      setSyncStatus(prev => ({ 
        ...prev, 
        isSyncing: false, 
        lastSync: new Date(),
        syncProgress: 0,
        error: null
      }));

      toast({ title: "Sync completed", description: `${pendingChanges.length} changes synced successfully.` });
    } catch (error) {
      setSyncStatus(prev => ({ 
        ...prev, 
        isSyncing: false, 
        error: error instanceof Error ? error.message : 'Sync failed'
      }));
      toast({ title: "Sync failed", description: "Could not sync changes. Will retry when online." });
    }
  };

  const simulateOfflineAction = () => {
    // Simulate adding a logbook entry while offline
    addPendingChange({
      type: 'create',
      entity: 'logbook',
      data: {
        date: new Date().toISOString().split('T')[0],
        hours: 8,
        summary: 'Worked on project documentation and code review',
        verified: false
      }
    });
    
    toast({ title: "Action saved offline", description: "Your action has been saved and will sync when online." });
  };

  const getStatusColor = () => {
    if (syncStatus.error) return 'text-red-600';
    if (syncStatus.isOnline) return 'text-green-600';
    return 'text-yellow-600';
  };

  const getStatusIcon = () => {
    if (syncStatus.isSyncing) return <RefreshCw className="h-4 w-4 animate-spin" />;
    if (syncStatus.error) return <AlertCircle className="h-4 w-4" />;
    if (syncStatus.isOnline) return <CheckCircle className="h-4 w-4" />;
    return <Clock className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Offline Access & Data Sync</h2>
        <p className="text-muted-foreground">Work offline and sync when connection is restored</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Connection Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {syncStatus.isOnline ? (
                  <Wifi className="h-5 w-5 text-green-600" />
                ) : (
                  <WifiOff className="h-5 w-5 text-red-600" />
                )}
                <span className="text-sm font-medium">
                  {syncStatus.isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sync Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className={`flex items-center gap-2 ${getStatusColor()}`}>
                {getStatusIcon()}
                <span className="text-sm font-medium">
                  {syncStatus.isSyncing ? 'Syncing...' : 
                   syncStatus.error ? 'Error' : 
                   syncStatus.isOnline ? 'Ready' : 'Offline'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Changes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{syncStatus.pendingChanges}</span>
              <Database className="h-5 w-5 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Waiting to sync</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Last Sync</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-sm">
                {syncStatus.lastSync ? 
                  syncStatus.lastSync.toLocaleTimeString() : 
                  'Never'
                }
              </span>
              <Clock className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sync Controls</CardTitle>
            <CardDescription>Manage data synchronization</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {syncStatus.isSyncing && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Syncing changes...</span>
                  <span>{syncStatus.syncProgress}%</span>
                </div>
                <Progress value={syncStatus.syncProgress} className="h-2" />
              </div>
            )}

            {syncStatus.error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-red-800">{syncStatus.error}</span>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button 
                onClick={handleSync} 
                disabled={!syncStatus.isOnline || syncStatus.isSyncing || syncStatus.pendingChanges === 0}
                className="flex-1"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Sync Now
              </Button>
              <Button 
                onClick={simulateOfflineAction} 
                variant="outline"
                className="flex-1"
              >
                <Upload className="h-4 w-4 mr-2" />
                Test Offline
              </Button>
            </div>

            <div className="p-3 bg-muted/30 rounded-lg">
              <h4 className="font-medium mb-2">Offline Features:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• View all cached data</li>
                <li>• Add logbook entries</li>
                <li>• Update profile information</li>
                <li>• Access learning resources</li>
                <li>• Generate reports</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Changes</CardTitle>
            <CardDescription>Changes waiting to be synced</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingChanges.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">No pending changes</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingChanges.slice(0, 5).map((change) => (
                  <div key={change.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      {change.type === 'create' && <Upload className="h-4 w-4 text-green-600" />}
                      {change.type === 'update' && <RefreshCw className="h-4 w-4 text-blue-600" />}
                      {change.type === 'delete' && <Download className="h-4 w-4 text-red-600" />}
                      <div>
                        <div className="font-medium text-sm">{change.entity}</div>
                        <div className="text-xs text-muted-foreground">
                          {change.timestamp.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline">
                      {change.type}
                    </Badge>
                  </div>
                ))}
                {pendingChanges.length > 5 && (
                  <p className="text-sm text-muted-foreground text-center">
                    +{pendingChanges.length - 5} more changes
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Offline Capabilities</CardTitle>
          <CardDescription>What you can do without internet connection</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Available Offline</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">View all cached data</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Add logbook entries</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Update profile</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Access learning resources</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Generate reports</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Requires Online</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CloudOff className="h-4 w-4 text-red-600" />
                  <span className="text-sm">Apply to internships</span>
                </div>
                <div className="flex items-center gap-2">
                  <CloudOff className="h-4 w-4 text-red-600" />
                  <span className="text-sm">AI chatbot responses</span>
                </div>
                <div className="flex items-center gap-2">
                  <CloudOff className="h-4 w-4 text-red-600" />
                  <span className="text-sm">Real-time notifications</span>
                </div>
                <div className="flex items-center gap-2">
                  <CloudOff className="h-4 w-4 text-red-600" />
                  <span className="text-sm">Live collaboration</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
