// ─── src/components/ui/use-toast.tsx ───
import * as React from "react";

// 1. Definisikan tipe data Toast
export interface ToasterToast {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  open?: boolean;
}

type ToastOptions = Omit<ToasterToast, "id">;

// Memory global untuk sinkronisasi state antar-komponen
let memoryState: ToasterToast[] = [];
const listeners = new Set<(toasts: ToasterToast[]) => void>();

function updateListeners() {
  listeners.forEach((listener) => listener([...memoryState]));
}

// 2. Fungsi pemicu Toast mandiri
export function toast(options: ToastOptions) {
  const id = Math.random().toString(36).substring(2, 9);

  const newToast: ToasterToast = {
    ...options,
    id,
    open: true,
  };

  // Batasi hanya ada 1 toast aktif (sesuai standar shadcn)
  memoryState = [newToast];
  updateListeners();

  // Otomatis tutup setelah 5 detik
  setTimeout(() => {
    dismiss(id);
  }, 5000);

  return {
    id,
    dismiss: () => dismiss(id),
  };
}

// 3. Fungsi untuk menutup Toast
export function dismiss(toastId?: string) {
  if (toastId) {
    memoryState = memoryState.filter((t) => t.id !== toastId);
  } else {
    memoryState = [];
  }
  updateListeners();
}

// 4. React Hook untuk membaca state di dalam komponen Toaster
export function useToast() {
  const [toasts, setToasts] = React.useState<ToasterToast[]>(memoryState);

  React.useEffect(() => {
    listeners.add(setToasts);
    return () => {
      listeners.delete(setToasts);
    };
  }, []);

  return {
    toasts,
    toast,
    dismiss,
  };
}
