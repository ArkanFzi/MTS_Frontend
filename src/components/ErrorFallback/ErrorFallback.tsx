import { AlertTriangle, RefreshCcw } from 'lucide-react';
import type { FallbackProps } from 'react-error-boundary';

export default function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    // 1. Tambahkan fixed, inset-0, dan z-50 untuk fullscreen
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0B0B0C] p-6 text-center">
      
      {/* Container pesan error */}
      <div className="max-w-md w-full flex flex-col items-center">
        <AlertTriangle className="w-20 h-20 text-[#E53E3E] mb-6 animate-pulse" />
        
        <h2 className="text-3xl font-bold text-white mb-3">Oops! Ada yang error</h2>
        <p className="text-zinc-400 text-sm mb-8 bg-[#161618] p-4 rounded-lg border border-red-900/30">
          {error instanceof Error ? error.message : "Terjadi kesalahan yang tidak terduga"}
        </p>
        
        <button 
          onClick={resetErrorBoundary}
          className="flex items-center gap-2 px-6 py-3 bg-[#D4AF37] text-black font-bold text-lg rounded-xl hover:bg-[#b8962f] transition-all transform hover:scale-105"
        >
          <RefreshCcw className="w-5 h-5" />
          Coba Muat Ulang
        </button>
      </div>
      
    </div>
  );
}