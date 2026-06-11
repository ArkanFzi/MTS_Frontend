// src/features/User/F16_Post/components/EditPostForm.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { X, Loader2, Plus, AlertCircle } from 'lucide-react';

import { updatePost } from '../api';
import { getAllTags } from '../../../Common/F5_FilterByTag/api';
import axios from '../../../../lib/axios';

import { Card } from '../../../../components/ui/card';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';
import type { Post } from '../types';
import type { Category, Tag } from '../../../../types';

const validationSchema = Yup.object({
  title: Yup.string()
    .required('Judul wajib diisi')
    .max(255, 'Judul maksimal 255 karakter'),
  body: Yup.string()
    .required('Konten wajib diisi')
    .min(10, 'Konten minimal 10 karakter'),
  category_id: Yup.string()
    .required('Kategori wajib dipilih'),
  tags: Yup.array()
    .of(Yup.string())
    .min(1, 'Pilih minimal 1 tag')
    .max(5, 'Maksimal 5 tag'),
});

async function fetchCategories(): Promise<Category[]> {
  const response = await axios.get('/api/explore/categories');
  const data = response.data;
  return data.data || data;
}

interface EditPostFormProps {
  post: Post;
}

export default function EditPostForm({ post }: EditPostFormProps) {
  const navigate = useNavigate();
  const [tagSearch, setTagSearch] = useState('');

  const { data: categories = [] } = useQuery({
    queryKey: ['categories-list'],
    queryFn: fetchCategories,
  });

  const { data: tagsData } = useQuery({
    queryKey: ['all-tags'],
    queryFn: getAllTags,
  });
  const allTags: Tag[] = (tagsData as any)?.data?.data || (tagsData as any)?.data || [];

  const mutation = useMutation({
    mutationFn: (data: Parameters<typeof updatePost>[1]) => updatePost(post.id, data),
    onSuccess: () => {
      navigate(`/posts/${post.id}`);
    },
  });

  const initialTagIds = post.tags?.map((t) => t.id) || [];

  const formik = useFormik({
    initialValues: {
      title: post.title,
      body: post.body,
      category_id: post.category_id,
      tags: initialTagIds,
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {
      mutation.mutate({
        title: values.title,
        body: values.body,
        category_id: values.category_id,
        tags: values.tags,
      });
    },
  });

  const selectedTagIds = formik.values.tags;
  const selectedTagObjects = allTags.filter((t) => selectedTagIds.includes(t.id));

  const filteredTags = allTags.filter(
    (t) =>
      !selectedTagIds.includes(t.id) &&
      t.name.toLowerCase().includes(tagSearch.toLowerCase())
  );

  const toggleTag = (tagId: string) => {
    if (selectedTagIds.includes(tagId)) {
      formik.setFieldValue(
        'tags',
        selectedTagIds.filter((id) => id !== tagId)
      );
    } else if (selectedTagIds.length < 5) {
      formik.setFieldValue('tags', [...selectedTagIds, tagId]);
      setTagSearch('');
    }
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      {/* ── Title ── */}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm text-gray-300">
          Judul Pertanyaan <span className="text-red-400">*</span>
        </Label>
        <Input
          id="title"
          name="title"
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="h-11 bg-[#161618] border-[#2A2A2C] text-white placeholder:text-gray-600 text-sm"
        />
        {formik.touched.title && formik.errors.title && (
          <p className="text-xs text-red-400 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> {formik.errors.title}
          </p>
        )}
      </div>

      {/* ── Category ── */}
      <div className="space-y-2">
        <Label htmlFor="category_id" className="text-sm text-gray-300">
          Kategori <span className="text-red-400">*</span>
        </Label>
        <select
          id="category_id"
          name="category_id"
          value={formik.values.category_id}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="h-11 w-full rounded-md border border-[#2A2A2C] bg-[#161618] px-3 text-sm text-white outline-none focus:border-[#D4AF37] transition-colors"
        >
          <option value="" disabled>Pilih kategori...</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        {formik.touched.category_id && formik.errors.category_id && (
          <p className="text-xs text-red-400 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> {formik.errors.category_id}
          </p>
        )}
      </div>

      {/* ── Body ── */}
      <div className="space-y-2">
        <Label htmlFor="body" className="text-sm text-gray-300">
          Detail Pertanyaan <span className="text-red-400">*</span>
        </Label>
        <textarea
          id="body"
          name="body"
          rows={10}
          value={formik.values.body}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full rounded-md border border-[#2A2A2C] bg-[#161618] px-3 py-3 text-sm text-white placeholder:text-gray-600 outline-none focus:border-[#D4AF37] transition-colors resize-y min-h-[200px]"
        />
        {formik.touched.body && formik.errors.body && (
          <p className="text-xs text-red-400 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> {formik.errors.body}
          </p>
        )}
      </div>

      {/* ── Tags ── */}
      <div className="space-y-2">
        <Label className="text-sm text-gray-300">
          Tag <span className="text-red-400">*</span>
          <span className="text-gray-500 ml-2">({selectedTagIds.length}/5)</span>
        </Label>

        {selectedTagObjects.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedTagObjects.map((tag) => (
              <Badge
                key={tag.id}
                variant="outline"
                className="bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/30 px-2.5 py-1 h-auto gap-1 cursor-pointer hover:bg-red-500/10 hover:text-red-400 hover:border-red-900 transition-colors"
                onClick={() => toggleTag(tag.id)}
              >
                #{tag.name}
                <X className="w-3 h-3" />
              </Badge>
            ))}
          </div>
        )}

        <div className="relative">
          <Input
            placeholder={selectedTagIds.length >= 5 ? 'Maksimal 5 tag' : 'Cari tag...'}
            value={tagSearch}
            onChange={(e) => setTagSearch(e.target.value)}
            disabled={selectedTagIds.length >= 5}
            className="h-10 bg-[#161618] border-[#2A2A2C] text-white placeholder:text-gray-600 text-sm pl-8"
          />
          <Plus className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />

          {tagSearch && filteredTags.length > 0 && (
            <Card className="absolute z-50 mt-1 w-full max-h-48 overflow-y-auto border-[#2A2A2C] bg-[#161618]">
              {filteredTags.slice(0, 10).map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-[#2A2A2C] hover:text-[#D4AF37] transition-colors flex items-center gap-2"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: tag.color || '#D4AF37' }}
                  />
                  {tag.name}
                  {tag.usage_count !== undefined && (
                    <span className="text-xs text-gray-600 ml-auto">{tag.usage_count} posts</span>
                  )}
                </button>
              ))}
            </Card>
          )}
        </div>
        {formik.touched.tags && formik.errors.tags && (
          <p className="text-xs text-red-400 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> {formik.errors.tags}
          </p>
        )}
      </div>

      {/* ── Error from API ── */}
      {mutation.isError && (
        <Card className="border-red-900 bg-red-950/30 p-4">
          <p className="text-sm text-red-400">
            {(mutation.error as any)?.response?.data?.message || 'Gagal memperbarui postingan.'}
          </p>
        </Card>
      )}

      {/* ── Actions ── */}
      <div className="flex items-center gap-3 pt-2">
        <Button
          type="submit"
          disabled={mutation.isPending}
          className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90 font-semibold px-6 disabled:opacity-50"
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Menyimpan...
            </>
          ) : (
            'Simpan Perubahan'
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate(`/posts/${post.id}`)}
          className="border-[#2A2A2C] text-gray-400 hover:bg-[#161618]"
        >
          Batal
        </Button>
      </div>
    </form>
  );
}
