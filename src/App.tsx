import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import AppRouter from './routes/AppRouter';
import ErrorFallback from './components/ErrorFallback/ErrorFallback';

export default function App() {
  return (
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
  );
}
