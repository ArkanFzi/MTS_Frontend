// src/pages/Admin/TagCategoryPage.tsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LayoutGrid, Hash } from 'lucide-react';
import { toast } from 'sonner';

import CategoryFormModal from '../../features/Admin/F10_CategoryMaster/components/CategoryFormModal';
import CategoryTable from '../../features/Admin/F10_CategoryMaster/components/CategoryTable';
import TagFormModal from '../../features/Admin/F12_TagMaster/components/TagFormModal';
import TagTable from '../../features/Admin/F12_TagMaster/components/TagTable';

import { getCategories, createCategory, updateCategory, deleteCategory } from '../../features/Admin/F10_CategoryMaster/api';
import { getModeratorTags, createTag, updateModeratorTag, deleteModeratorTag } from '../../features/Admin/F12_TagMaster/api';
import type { CreateCategoryPayload } from '../../features/Admin/F10_CategoryMaster/types';
import type { CreateTagPayload } from '../../features/Admin/F12_TagMaster/types';
import type { Category, Tag } from '../../types';

export default function TagCategoryPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'categories' | 'tags'>('categories');

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);

  // Queries
  const { data: categoriesData, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: getCategories,
  });

  const { data: tagsData, isLoading: isLoadingTags } = useQuery({
    queryKey: ['admin-tags'],
    queryFn: () => getModeratorTags(),
  });

  const categories = categoriesData?.data || [];
  const tags = tagsData?.data?.data || [];

  // Category Mutations
  const createCategoryMut = useMutation({
    mutationFn: (payload: CreateCategoryPayload) => createCategory(payload),
    onSuccess: () => {
      toast.success('Category created successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      setIsCategoryModalOpen(false);
    },
    onError: (error: unknown) => {
      const msg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Failed to create category');
    },
  });

  const updateCategoryMut = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateCategoryPayload }) => updateCategory(id, data),
    onSuccess: () => {
      toast.success('Category updated successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      setIsCategoryModalOpen(false);
    },
    onError: (error: unknown) => {
      const msg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Failed to update category');
    },
  });

  const deleteCategoryMut = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      toast.success('Category deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
    },
    onError: (error: unknown) => {
      const msg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Failed to delete category');
    },
  });

  // Tag Mutations
  const createTagMut = useMutation({
    mutationFn: (payload: CreateTagPayload) => createTag(payload),
    onSuccess: () => {
      toast.success('Tag created successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-tags'] });
      setIsTagModalOpen(false);
    },
    onError: (error: unknown) => {
      const msg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Failed to create tag');
    },
  });

  const updateTagMut = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateTagPayload }) => updateModeratorTag(id, data),
    onSuccess: () => {
      toast.success('Tag updated successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-tags'] });
      setIsTagModalOpen(false);
    },
    onError: (error: unknown) => {
      const msg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Failed to update tag');
    },
  });

  const deleteTagMut = useMutation({
    mutationFn: deleteModeratorTag,
    onSuccess: () => {
      toast.success('Tag deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-tags'] });
    },
    onError: (error: unknown) => {
      const msg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Failed to delete tag');
    },
  });

  // Handlers
  const handleCategorySubmit = (values: { name: string; slug: string }) => {
    if (selectedCategory) {
      updateCategoryMut.mutate({ id: selectedCategory.id, data: values });
    } else {
      createCategoryMut.mutate(values);
    }
  };

  const handleTagSubmit = (values: { name: string; color: string }) => {
    if (selectedTag) {
      updateTagMut.mutate({ id: selectedTag.id, data: values });
    } else {
      createTagMut.mutate(values);
    }
  };

  const handleDeleteCategory = (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      deleteCategoryMut.mutate(id);
    }
  };

  const handleDeleteTag = (id: string) => {
    if (window.confirm('Are you sure you want to delete this tag?')) {
      deleteTagMut.mutate(id);
    }
  };

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4 font-['Inter']">
      <div className="mb-6 flex space-x-2">
        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2 text-sm font-semibold rounded-md flex items-center gap-2 transition-colors ${
            activeTab === 'categories' ? 'bg-[#D4AF37] text-black' : 'bg-[#161618] text-gray-400 border border-zinc-800 hover:text-white'
          }`}
        >
          <LayoutGrid className="w-4 h-4" /> Categories
        </button>
        <button
          onClick={() => setActiveTab('tags')}
          className={`px-4 py-2 text-sm font-semibold rounded-md flex items-center gap-2 transition-colors ${
            activeTab === 'tags' ? 'bg-[#D4AF37] text-black' : 'bg-[#161618] text-gray-400 border border-zinc-800 hover:text-white'
          }`}
        >
          <Hash className="w-4 h-4" /> Tags
        </button>
      </div>

      {activeTab === 'categories' && (
        <CategoryTable
          categories={categories}
          isLoading={isLoadingCategories}
          onAdd={() => { setSelectedCategory(null); setIsCategoryModalOpen(true); }}
          onEdit={(cat) => { setSelectedCategory(cat); setIsCategoryModalOpen(true); }}
          onDelete={handleDeleteCategory}
        />
      )}

      {activeTab === 'tags' && (
        <TagTable
          tags={tags}
          isLoading={isLoadingTags}
          onAdd={() => { setSelectedTag(null); setIsTagModalOpen(true); }}
          onEdit={(tag) => { setSelectedTag(tag); setIsTagModalOpen(true); }}
          onDelete={handleDeleteTag}
        />
      )}

      <CategoryFormModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSubmit={handleCategorySubmit}
        initialData={selectedCategory ? { name: selectedCategory.name, slug: selectedCategory.slug } : null}
      />

      <TagFormModal
        isOpen={isTagModalOpen}
        onClose={() => setIsTagModalOpen(false)}
        onSubmit={handleTagSubmit}
        initialData={selectedTag ? { name: selectedTag.name, color: selectedTag.color || '#D4AF37' } : null}
      />
    </div>
  );
}
