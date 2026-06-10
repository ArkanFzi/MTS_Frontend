import { BrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppRouter from "./routes/AppRouter";
import ErrorFallback from "./components/ErrorFallback/ErrorFallback";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Menghindari fetch ulang otomatis saat pindah tab browser
      retry: 1, // Jika API gagal, cukup coba ulang 1 kali sebelum melempar error ke UI
    },
  },
});

export default function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={() => {
            window.location.reload();
          }}
        >
          <AppRouter />
        </ErrorBoundary>
      </QueryClientProvider>
    </BrowserRouter>
  );
}
