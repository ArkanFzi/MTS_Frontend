export default function ResponsiveLayout({ children, sidebar }: { children: React.ReactNode, sidebar?: React.ReactNode }) {
  return (
    // HAPUS 'max-w-...' atau 'mx-auto' JIKA ADA DI SINI
    <div className="flex w-full min-h-screen px-4 lg:px-8 gap-8">
      
      {/* Kolom Konten Utama */}
      <main className="flex-1 w-full min-w-0">
        {children}
      </main>

      {/* Sidebar Desktop */}
      {sidebar && (
        <aside className="hidden lg:block w-[320px] flex-shrink-0">
          <div className="sticky top-8">
            {sidebar}
          </div>
        </aside>
      )}
    </div>
  );
}