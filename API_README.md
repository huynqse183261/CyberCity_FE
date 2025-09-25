# CyberCity FE - API Documentation

## 🏗️ Kiến trúc API

Dự án sử dụng kiến trúc API hiện đại với các công nghệ sau:

- **Axios**: HTTP client với interceptors
- **React Query**: Data fetching, caching và synchronization
- **TypeScript**: Type safety cho tất cả API calls
- **Base Service Pattern**: Tái sử dụng code và consistent API

## 📁 Cấu trúc thư mục

```
src/
├── api/
│   ├── axiosInstance.ts       # Cấu hình Axios với interceptors
│   ├── BaseApiService.ts      # Base class cho tất cả services
│   ├── authService.ts         # Authentication APIs
│   ├── linuxLabService.ts     # Linux Lab APIs
│   ├── aiAssistantService.ts  # AI Assistant APIs
│   ├── productService.ts      # Product Management APIs
│   ├── utils.ts              # API utilities
│   └── index.ts              # Export tất cả services
├── hooks/
│   ├── useAuth.ts            # Auth hooks với React Query
│   ├── useLinuxLab.ts        # Linux Lab hooks
│   └── useFormValidation.ts  # Form validation hooks
├── providers/
│   └── ReactQueryProvider.tsx # React Query setup
└── models/                   # TypeScript interfaces
```

## 🚀 Cài đặt và Cấu hình

### 1. Environment Variables

Tạo file `.env` trong root directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_API_TIMEOUT=10000

# Environment
VITE_NODE_ENV=development

# Auth Configuration
VITE_JWT_SECRET_KEY=your-secret-key
VITE_TOKEN_EXPIRY=24h

# External Services
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_FACEBOOK_APP_ID=your-facebook-app-id

# Features Flag
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_AI_ASSISTANT=true
VITE_ENABLE_VIRTUAL_LAB=true

# Debug
VITE_DEBUG_MODE=true
```

### 2. React Query Setup

Wrap ứng dụng với `ReactQueryProvider`:

```tsx
// main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import ReactQueryProvider from './providers/ReactQueryProvider';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ReactQueryProvider>
      <App />
    </ReactQueryProvider>
  </React.StrictMode>
);
```

## 📚 Sử dụng API Services

### Authentication

```tsx
import { useLogin, useRegister, useProfile, useLogout } from '../hooks/useAuth';

const LoginComponent = () => {
  const loginMutation = useLogin({
    onSuccess: (data) => {
      if (data.success) {
        message.success('Đăng nhập thành công!');
        // Redirect to dashboard
      }
    },
    onError: (error) => {
      message.error('Đăng nhập thất bại: ' + error.message);
    }
  });

  const handleLogin = (values: { email: string; password: string }) => {
    loginMutation.mutate(values);
  };

  return (
    <Form onFinish={handleLogin}>
      <Form.Item name="email">
        <Input placeholder="Email" />
      </Form.Item>
      <Form.Item name="password">
        <Input.Password placeholder="Password" />
      </Form.Item>
      <Button 
        type="primary" 
        htmlType="submit" 
        loading={loginMutation.isPending}
      >
        Đăng nhập
      </Button>
    </Form>
  );
};
```

### Linux Lab Management

```tsx
import { 
  useLabEnvironments, 
  useCreateLabSession, 
  useExecuteCommand,
  useTerminalConnection 
} from '../hooks/useLinuxLab';

const LinuxLabComponent = () => {
  const [sessionId, setSessionId] = useState<string>('');
  
  // Get available environments
  const { data: environments, isLoading } = useLabEnvironments();
  
  // Create lab session
  const createSession = useCreateLabSession({
    onSuccess: (data) => {
      if (data.success && data.data) {
        setSessionId(data.data.id);
        message.success('Lab session tạo thành công!');
      }
    }
  });
  
  // Execute command
  const executeCommand = useExecuteCommand({
    onSuccess: (data) => {
      if (data.success) {
        console.log('Command output:', data.data?.output);
      }
    }
  });
  
  // WebSocket terminal connection
  const { isConnected, messages, sendMessage } = useTerminalConnection(sessionId);

  const handleCreateSession = (environmentId: string) => {
    createSession.mutate({
      environmentId,
      sessionName: `Session ${Date.now()}`,
      maxDuration: 120 // 2 hours
    });
  };

  const handleRunCommand = (command: string) => {
    if (sessionId) {
      executeCommand.mutate({ sessionId, command });
    }
  };

  return (
    <div>
      {/* Environment selection */}
      {environments?.data?.map(env => (
        <Card key={env.id}>
          <h3>{env.name}</h3>
          <p>{env.description}</p>
          <Button onClick={() => handleCreateSession(env.id)}>
            Start Lab
          </Button>
        </Card>
      ))}

      {/* Terminal */}
      {sessionId && (
        <div>
          <div>Status: {isConnected ? 'Connected' : 'Disconnected'}</div>
          <div>Messages: {messages.join('\\n')}</div>
          <Input.Search
            placeholder="Enter command"
            onSearch={handleRunCommand}
            enterButton="Execute"
          />
        </div>
      )}
    </div>
  );
};
```

### AI Assistant

```tsx
import aiAssistantService from '../api/aiAssistantService';

const AIAssistant = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (message: string) => {
    setLoading(true);
    try {
      const response = await aiAssistantService.sendMessage({
        message,
        context: {
          currentCommand: 'ls -la',
          environmentInfo: {
            os: 'ubuntu',
            version: '20.04',
            installedTools: ['vim', 'nano', 'curl']
          }
        }
      });

      if (response.success) {
        setMessages(prev => [
          ...prev,
          { role: 'user', content: message },
          { role: 'assistant', content: response.data?.message }
        ]);
      }
    } catch (error) {
      message.error('AI Assistant error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.role}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <Input.Search
        placeholder="Ask AI Assistant..."
        onSearch={sendMessage}
        loading={loading}
      />
    </div>
  );
};
```

## 🔧 Advanced Features

### Error Handling

```tsx
// Global error handler trong axiosInstance
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const { status, data } = error.response;
    
    switch (status) {
      case 401:
        // Unauthorized - redirect to login
        localStorage.removeItem('access_token');
        window.location.href = '/login';
        break;
      case 403:
        message.error('Bạn không có quyền truy cập');
        break;
      case 500:
        message.error('Lỗi server, vui lòng thử lại sau');
        break;
    }
    
    return Promise.reject(error);
  }
);
```

### Auto Token Refresh

```tsx
// Auto refresh token khi sắp hết hạn
const useAutoRefreshToken = () => {
  const refreshMutation = useRefreshToken();

  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem('access_token');
      if (token) {
        // Check if token is about to expire (within 5 minutes)
        const payload = JSON.parse(atob(token.split('.')[1]));
        const now = Date.now() / 1000;
        
        if (payload.exp - now < 300) { // 5 minutes
          refreshMutation.mutate();
        }
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [refreshMutation]);
};
```

### File Upload with Progress

```tsx
const useFileUpload = () => {
  const [progress, setProgress] = useState(0);

  const uploadFile = async (sessionId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    return axiosInstance.post(
      \`/lab-sessions/\${sessionId}/upload\`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          setProgress(percentCompleted);
        },
      }
    );
  };

  return { uploadFile, progress };
};
```

### WebSocket with Reconnection

```tsx
const useWebSocketWithReconnect = (url: string) => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = useCallback(() => {
    const websocket = new WebSocket(url);
    
    websocket.onopen = () => {
      setIsConnected(true);
      reconnectAttempts.current = 0;
    };
    
    websocket.onclose = () => {
      setIsConnected(false);
      
      // Auto reconnect
      if (reconnectAttempts.current < maxReconnectAttempts) {
        setTimeout(() => {
          reconnectAttempts.current++;
          connect();
        }, Math.pow(2, reconnectAttempts.current) * 1000);
      }
    };
    
    setWs(websocket);
  }, [url]);

  useEffect(() => {
    connect();
    return () => ws?.close();
  }, [connect]);

  return { ws, isConnected };
};
```

## 🎯 Best Practices

### 1. Type Safety
- Tất cả API responses đều có type definitions
- Sử dụng generic types cho reusable components
- Validate data với zod hoặc yup

### 2. Error Handling
- Implement global error boundaries
- Show user-friendly error messages
- Log errors to monitoring service (Sentry)

### 3. Performance
- Implement proper caching với React Query
- Use pagination cho large datasets  
- Debounce search inputs
- Lazy load components

### 4. Security
- Always validate input data
- Implement proper CORS settings
- Use HTTPS in production
- Store sensitive data securely

### 5. Testing
```tsx
// API testing với MSW
import { setupServer } from 'msw/node';
import { rest } from 'msw';

const server = setupServer(
  rest.post('/api/v1/auth/login', (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        data: {
          user: { id: '1', email: 'test@example.com' },
          tokens: { accessToken: 'fake-token' }
        }
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

## 📝 API Endpoints

### Authentication
- `POST /auth/login` - Đăng nhập
- `POST /auth/register` - Đăng ký
- `POST /auth/logout` - Đăng xuất
- `GET /auth/profile` - Lấy thông tin profile
- `POST /auth/refresh` - Refresh token

### Linux Lab
- `GET /lab-environments` - Danh sách environments
- `POST /lab-sessions` - Tạo lab session
- `GET /lab-sessions/:id` - Thông tin session
- `POST /terminals/:id/execute` - Thực thi lệnh
- `GET /terminals/:id/history` - Lịch sử lệnh

### AI Assistant  
- `POST /ai/chat` - Chat với AI
- `POST /ai/help` - Lấy help từ AI
- `POST /ai/suggestions` - Gợi ý commands

## 🔗 Tài liệu tham khảo

- [React Query Documentation](https://tanstack.com/query/latest)
- [Axios Documentation](https://axios-http.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)