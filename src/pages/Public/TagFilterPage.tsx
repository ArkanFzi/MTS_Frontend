import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

// Impor tipe data & fungsi API dengan relative path yang aman
import type { TagDetailData } from '../../features/Common/F5_FilterByTag/types';
import { getPostsByTag } from '../../features/Common/F5_FilterByTag/api';

// BIKIN AMAN: Impor langsung secara spesifik ke file fisik TagHeader.tsx (Hindari folder induk/index.ts)
import TagHeader from '../../components/TagHeader'; 

// Impor komponen kartu postingan fitur
import TagPostCard from '../../features/Common/F5_FilterByTag/components/TagPostCard';

export default function TagFilterPage() {
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<TagDetailData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    if (!slug) return;

    // Definisikan fungsi fetcher di dalam useEffect agar trackable
    const fetchTagContent = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getPostsByTag(slug, page);
        if (res.success && res.data) {
          setData(res.data);
        } else {
          setError(res.message || 'Gagal memuat data taksonomi tag.');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Terjadi kesalahan koneksi ke server backend.');
      } finally {
        setLoading(false);
      }
    };

    fetchTagContent();
  }, [slug, page]);

  // State Loading Spinner (Hanya tampil jika data belum ada)
  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-zinc-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
        <p className="text-sm font-fira-code">Menyinkronkan repositori tag #{slug}...</p>
      </div>
    );
  }

  // State Error Box
  if (error) {
    return (
      <div className="bg-[#161618] border border-red-900/30 rounded-xl p-6 text-center max-w-lg mx-auto my-10 space-y-4">
        <div className="inline-flex p-3 rounded-full bg-red-500/10 text-[#E53E3E]">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-white font-semibold">Gagal Memuat Konten</h3>
        <p className="text-zinc-400 text-sm font-inter">{error}</p>
        <Link to="/" className="inline-flex items-center gap-2 text-xs text-[#D4AF37] hover:underline pt-2">
          <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Beranda
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Navigasi Back / Breadcrumb */}
      <Link 
        to="/" 
        className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-[#D4AF37] transition-colors font-fira-code mb-2"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> EXPLORE_ROOT / TAGS
      </Link>

      {/* Render Header Informasi Tag */}
      {data?.tag && (
        <TagHeader tag={data.tag} totalPosts={data.posts.total} />
      )}

      {/* Daftar Postingan terkait Tag */}
      <div className="space-y-3">
        {data?.posts.data.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-[#2A2A2C] rounded-xl text-zinc-500 text-sm font-inter">
            Belum ada diskusi yang disematkan dengan tag ini. Jadilah yang pertama bertanya!
          </div>
        ) : (
          data?.posts.data.map((post) => (
            <TagPostCard key={post.id} post={post} />
          ))
        )}
      </div>

      {/* Sistem Paginasi */}
      {data && data.posts.last_page > 1 && (
        <div className="flex items-center justify-end gap-2 pt-4">
          <button
            onClick={() => setPage(p => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 text-xs bg-[#161618] border border-[#2A2A2C] rounded text-zinc-400 disabled:opacity-40 font-inter hover:bg-[#2A2A2C] transition-colors"
          >
            Previous
          </button>
          <span className="text-xs text-zinc-500 font-fira-code px-2">
            Page {page} of {data.posts.last_page}
          </span>
          <button
            onClick={() => setPage(p => Math.min(p + 1, data.posts.last_page))}
            disabled={page === data.posts.last_page}
            className="px-3 py-1 text-xs bg-[#161618] border border-[#2A2A2C] rounded text-zinc-400 disabled:opacity-40 font-inter hover:bg-[#2A2A2C] transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}