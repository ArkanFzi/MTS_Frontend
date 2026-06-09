import { AlertCircle } from "lucide-react";

export default function ErrorFallback({ error, resetErrorBoundary }: any) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center text-red-400">
      <AlertCircle className="w-12 h-12 mb-4" />
      <h2 className="text-xl font-bold text-white">Gagal Memuat Data</h2>
      <p className="text-sm text-zinc-500 mb-6">{error.message}</p>
      
      {/* Tombol ini akan memanggil onReset dan mencoba re-render komponen */}
      <button 
        onClick={resetErrorBoundary}
        className="px-6 py-2 bg-[#D4AF37] text-black font-bold rounded-lg hover:bg-[#b8962d] transition-colors"
      >
        Coba Lagi
      </button>
    </div>
  );
}