// src/pages/User/CategoryFilterPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Grid, Search, Tag, Eye, MessageSquare, ArrowRight } from 'lucide-react';
import { useFormik } from 'formik';
import CategoryList from "../../features/Common/F6_FilterByCategory/components/CategoryList";

// Data Postingan Dummy untuk Tampilan Slicing FE
const MOCK_POSTS = [
  {
    id: 1,
    title: 'Panduan Menggunakan Komponen Varian di Figma untuk Pemula',
    excerpt: 'Belajar bagaimana mengorganisasi design system kamu menggunakan komponen varian di Figma agar workflow tim menjadi lebih cepat.',
    views_count: 142,
    comments_count: 8,
    category: 'ui-ux',
    author: { username: 'faldanyde' }
  },
  {
    id: 2,
    title: 'Eksplorasi Gaya Desain Minimalist-Brutalist pada Website Portofolio',
    excerpt: 'Mengapa tren brutalism kembali diminati? Yuk kupas tuntas tipografi tegas dan layout grid asimetris yang bikin web stand-out.',
    views_count: 98,
    comments_count: 12,
    category: 'ui-ux',
    author: { username: 'ux_master' }
  },
  {
    id: 3,
    title: 'Tips Rendering Halus di Alight Motion Tanpa Patah-Patah',
    excerpt: 'Sering mengalami lag saat pratinjau motion graphics? Ini trik mengatur cache dan keyframe graph agar animasi tetap smooth.',
    views_count: 320,
    comments_count: 24,
    category: 'motion',
    author: { username: 'motion_pro' }
  },
  {
    id: 4,
    title: 'Teknik Color Grading Cinematic Menggunakan CapCut Desktop',
    excerpt: 'Mengubah footage standar menjadi estetik warna film Hollywood hanya menggunakan fitur kurva dan adjustment bawaan CapCut.',
    views_count: 215,
    comments_count: 15,
    category: 'video',
    author: { username: 'editor_satset' }
  }
];

export default function CategoryFilterPage() {
  const { slug } = useParams<{ slug?: string }>(); 
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Sinkronisasi tab aktif dengan URL rute browser
  useEffect(() => {
    if (slug) {
      setSelectedCategory(slug);
    } else {
      setSelectedCategory('all');
    }
  }, [slug]);

  const handleCategoryChange = (targetSlug: string) => {
    setSelectedCategory(targetSlug);
    if (targetSlug === 'all') {
      navigate('/category');
    } else {
      navigate(`/category/${targetSlug}`);
    }
  };

  // Formik untuk menangani input teks pencarian secara real-time
  const formik = useFormik({
    initialValues: {
      searchQuery: '',
    },
    onSubmit: () => {}
  });

  // Logika penyaringan lokal murni FE (Kategori + Teks) untuk keperluan testing tampilan
  const filteredPosts = MOCK_POSTS.filter((post) => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = 
      post.title.toLowerCase().includes(formik.values.searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(formik.values.searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4 font-['Inter']">
      <Card className="bg-[#161618] border border-zinc-800 shadow-xl rounded-none md:rounded-lg">
        
        {/* HEADER HALAMAN */}
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 pb-6 border-b border-zinc-800">
          <div className="space-y-1">
            <CardTitle className="text-xl font-semibold text-zinc-100 flex items-center gap-2">
              <Grid className="h-5 w-5 text-[#D4AF37]" /> Telusuri Kategori
            </CardTitle>
            <CardDescription className="text-zinc-400 text-sm">
              Saring dan temukan topik diskusi spesifik langsung dari ahlinya.
            </CardDescription>
          </div>

          {/* INPUT PENCARIAN */}
          <form className="relative w-full md:w-80" onSubmit={formik.handleSubmit}>
            <input
              type="text"
              name="searchQuery"
              placeholder="Cari topik di kategori ini..."
              onChange={formik.handleChange}
              value={formik.values.searchQuery}
              className="w-full bg-[#0B0B0C] border border-zinc-800 px-4 py-2 pl-10 text-xs text-zinc-200 outline-none transition-all rounded-md focus:border-[#D4AF37]"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
          </form>
        </CardHeader>

        {/* REUSABLE SUB-KOMPONEN LIST KATEGORI */}
        <CategoryList 
          selectedCategory={selectedCategory} 
          onCategoryChange={handleCategoryChange} 
        />

        {/* DAFTAR POSTINGAN HASIL FILTER */}
        <CardContent className="p-0">
          {filteredPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center p-16 space-y-3">
              <Tag className="h-12 w-12 text-zinc-700 stroke-[1.5]" />
              <p className="text-zinc-400 text-sm">Tidak ada postingan yang sesuai di kategori ini.</p>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-zinc-800">
              {filteredPosts.map((post) => (
                <div 
                  key={post.id} 
                  onClick={() => navigate(`/posts/${post.id}`)} 
                  className="flex items-start justify-between p-6 transition-all hover:bg-zinc-900/40 group cursor-pointer"
                >
                  <div className="space-y-2 flex-1">
                    {/* Info Penulis */}
                    <span className="text-[11px] text-zinc-500 block font-mono">
                      Diposting oleh <span className="text-zinc-400">@{post.author.username}</span>
                    </span>

                    {/* Judul Post */}
                    <h2 className="text-base font-semibold text-zinc-200 group-hover:text-[#D4AF37] transition-colors tracking-tight line-clamp-1">
                      {post.title}
                    </h2>

                    {/* Ringkasan / Excerpt */}
                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed max-w-3xl">
                      {post.excerpt}
                    </p>

                    {/* Metadata Post */}
                    <div className="flex items-center gap-4 pt-1 text-[11px] text-zinc-500 font-mono">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" /> {post.views_count} views
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" /> {post.comments_count} jawaban
                      </span>
                    </div>
                  </div>

                  {/* Tombol Aksi Brutalist */}
                  <div className="ml-6 flex-shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity border border-zinc-700 p-2 bg-[#0B0B0C] rounded-md">
                    <ArrowRight className="h-4 w-4 text-[#D4AF37]" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}