import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { apiClient } from "@/lib/api";
import { API_ENDPOINTS } from "@/config/api";
import { authService } from "@/services/authService";
import { socketService } from "@/services/socketService";
import { BatPixelLoaderMini } from "@/components/BatPixelLoader";
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Loader2, 
  Wifi, 
  WifiOff,
  Server,
  Database,
  Shield
} from "lucide-react";
import { toast } from "sonner";

export function ConnectionTest() {
  const [tests, setTests] = useState({
    apiHealth: { status: 'pending', message: '', loading: false },
    authentication: { status: 'pending', message: '', loading: false },
    database: { status: 'pending', message: '', loading: false },
    socketConnection: { status: 'pending', message: '', loading: false },
    cors: { status: 'pending', message: '', loading: false }
  });

  const updateTest = (testName, status, message, loading = false) => {
    setTests(prev => ({
      ...prev,
      [testName]: { status, message, loading }
    }));
  };

  const testApiHealth = async () => {
    updateTest('apiHealth', 'pending', 'Testing API health...', true);
    try {
      const response = await apiClient.get('/health');
      updateTest('apiHealth', 'success', 'API is responding correctly');
    } catch (error) {
      updateTest('apiHealth', 'error', `API health check failed: ${error.message}`);
    }
  };

  const testAuthentication = async () => {
    updateTest('authentication', 'pending', 'Testing authentication...', true);
    try {
      const token = authService.getToken();
      if (!token) {
        updateTest('authentication', 'warning', 'No authentication token found. Please login.');
        return;
      }

      // Test token validation
      const response = await apiClient.get(API_ENDPOINTS.USERS_ALL);
      updateTest('authentication', 'success', 'Authentication is working correctly');
    } catch (error) {
      if (error.status === 401) {
        updateTest('authentication', 'error', 'Authentication failed: Invalid or expired token');
      } else {
        updateTest('authentication', 'error', `Authentication test failed: ${error.message}`);
      }
    }
  };

  const testDatabase = async () => {
    updateTest('database', 'pending', 'Testing database connection...', true);
    try {
      // Test by fetching repositories (should work even if empty)
      const response = await apiClient.get(API_ENDPOINTS.REPOS_ALL);
      updateTest('database', 'success', 'Database connection is working');
    } catch (error) {
      updateTest('database', 'error', `Database test failed: ${error.message}`);
    }
  };

  const testSocketConnection = async () => {
    updateTest('socketConnection', 'pending', 'Testing Socket.IO connection...', true);
    
    try {
      const userId = authService.getUserId();
      if (!userId) {
        updateTest('socketConnection', 'warning', 'Socket test requires authentication');
        return;
      }

      // Test socket connection
      socketService.connect(userId);
      
      // Wait a bit to see if connection establishes
      setTimeout(() => {
        if (socketService.isSocketConnected()) {
          updateTest('socketConnection', 'success', 'Socket.IO connection established');
        } else {
          updateTest('socketConnection', 'error', 'Socket.IO connection failed');
        }
      }, 3000);
    } catch (error) {
      updateTest('socketConnection', 'error', `Socket connection test failed: ${error.message}`);
    }
  };

  const testCors = async () => {
    updateTest('cors', 'pending', 'Testing CORS configuration...', true);
    try {
      // Make a simple request to test CORS
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5050/api'}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        updateTest('cors', 'success', 'CORS is configured correctly');
      } else {
        updateTest('cors', 'error', 'CORS configuration may have issues');
      }
    } catch (error) {
      if (error.message.includes('CORS')) {
        updateTest('cors', 'error', 'CORS is blocking requests');
      } else {
        updateTest('cors', 'error', `CORS test failed: ${error.message}`);
      }
    }
  };

  const runAllTests = async () => {
    await testApiHealth();
    await testCors();
    await testDatabase();
    await testAuthentication();
    await testSocketConnection();
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case 'pending':
        return <BatPixelLoaderMini className="h-5 w-5" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const testItems = [
    {
      key: 'apiHealth',
      title: 'API Health',
      description: 'Backend server responsiveness',
      icon: Server,
      test: testApiHealth
    },
    {
      key: 'cors',
      title: 'CORS Configuration',
      description: 'Cross-origin resource sharing',
      icon: Shield,
      test: testCors
    },
    {
      key: 'database',
      title: 'Database Connection',
      description: 'MongoDB connectivity',
      icon: Database,
      test: testDatabase
    },
    {
      key: 'authentication',
      title: 'Authentication',
      description: 'JWT token validation',
      icon: Shield,
      test: testAuthentication
    },
    {
      key: 'socketConnection',
      title: 'Socket.IO Connection',
      description: 'Real-time communication',
      icon: socketService.isSocketConnected() ? Wifi : WifiOff,
      test: testSocketConnection
    }
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="h-6 w-6" />
          Frontend-Backend Connection Test
        </CardTitle>
        <CardDescription>
          Test all connections between your frontend and backend services
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-2">
          <Button onClick={runAllTests} className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Run All Tests
          </Button>
        </div>

        <Separator />

        <div className="grid gap-4">
          {testItems.map((item) => {
            const test = tests[item.key];
            const Icon = item.icon;
            
            return (
              <div key={item.key} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <h4 className="font-medium">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Badge className={getStatusColor(test.status)}>
                    {test.status}
                  </Badge>
                  {getStatusIcon(test.status)}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={item.test}
                    disabled={test.loading}
                  >
                    Test
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <Separator />

        <div className="space-y-3">
          <h4 className="font-medium">Test Results:</h4>
          {Object.entries(tests).map(([key, test]) => (
            <div key={key} className="flex items-start gap-2 text-sm">
              {getStatusIcon(test.status)}
              <div>
                <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}: </span>
                <span className={test.status === 'error' ? 'text-red-600' : 'text-muted-foreground'}>
                  {test.message || 'Not tested'}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-muted p-4 rounded-lg">
          <h4 className="font-medium mb-2">Configuration Info:</h4>
          <div className="text-sm space-y-1 text-muted-foreground">
            <p><strong>API Base URL:</strong> {import.meta.env.VITE_API_BASE_URL || 'http://localhost:5050/api'}</p>
            <p><strong>Socket URL:</strong> {(import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5050')}</p>
            <p><strong>Auth Token:</strong> {authService.getToken() ? 'Present' : 'Not found'}</p>
            <p><strong>User ID:</strong> {authService.getUserId() || 'Not found'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
