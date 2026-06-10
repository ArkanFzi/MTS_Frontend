// TODO: API calls for F24_BookmarkPost
// src/features/User/F24_BookmarkPost/api/index.ts
import axios from 'axios';
import type { BookmarkItem } from '../types';

/**
 * 🟢 UNTUK REACT QUERY (useQuery)
 * Mengambil semua daftar postingan yang telah di-bookmark oleh user aktif.
 */
export const fetchBookmarks = async (): Promise<{ data: BookmarkItem[] }> => {
  const token = localStorage.getItem('token');
  
  const response = await axios.get('/api/bookmarks', {
    headers: { 
      Authorization: `Bearer ${token}` 
    }
  });
  return response.data;
};

/**
 * 🟢 UNTUK REACT QUERY (useMutation) & FORMIK + YUP
 * Menambahkan atau menghapus bookmark (Toggle) berdasarkan ID Postingan.
 * Menerima parameter `notes` opsional yang di-validasi oleh Yup di komponen Formik.
 * * @param postId - ID dari postingan yang ingin disimpan/dihapus
 * @param notes - Catatan tambahan dari form input Formik
 */
export const toggleBookmark = async (postId: string, notes?: string): Promise<void> => {
  const token = localStorage.getItem('token');
  
  await axios.post(`/api/posts/${postId}/bookmark`, { notes }, {
    headers: { 
      Authorization: `Bearer ${token}` 
    }
  });
};