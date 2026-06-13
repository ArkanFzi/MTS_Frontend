import { useEffect } from 'react'; // 1. Tambahkan ini
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import AppRouter from './routes/AppRouter';
import ErrorFallback from './components/ErrorFallback/ErrorFallback';
import axios from './lib/axios';
 // 2. Import instance axios kustom kamu (sesuaikan path-nya)

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  // 3. Jalankan "pemanasan" CSRF Token saat pertama kali aplikasi dibuka
  useEffect(() => {
    const initializeApp = async () => {
      try {
        await axios.get('/sanctum/csrf-cookie');
        console.log('🔒 CSRF Cookie initialized successfully.');
      } catch (error) {
        console.error('❌ Failed to initialize CSRF Cookie:', error);
      }
    };

    initializeApp();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ErrorBoundary 
          FallbackComponent={ErrorFallback}
          onReset={() => {
            window.location.reload(); 
          }}
        >
          <AppRouter />
        </ErrorBoundary>
      </BrowserRouter>
    </QueryClientProvider>
  );
}