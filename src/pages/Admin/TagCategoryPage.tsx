// src/pages/Admin/TagCategoryPage.tsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LayoutGrid, Hash, Database, Tags, TagsIcon } from 'lucide-react';
import { toast } from 'sonner';

import CategoryFormModal from '../../features/Admin/F10_CategoryMaster/components/CategoryFormModal';
import CategoryTable from '../../features/Admin/F10_CategoryMaster/components/CategoryTable';
import TagFormModal from '../../features/Admin/F12_TagMaster/components/TagFormModal';
import TagTable from '../../features/Admin/F12_TagMaster/components/TagTable';
import ResponsiveLayout from '../../components/shared/ResponsiveLayout';

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
    <ResponsiveLayout>
      <div className="w-full py-8">
        
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <TagsIcon className="w-6 h-6 text-[#D4AF37]" />
            <h1 className="text-2xl font-bold text-white tracking-tight">Content Master</h1>
          </div>
          <p className="text-sm text-gray-500">Manage your forum categories and system tags.</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mb-6 bg-[#161618] p-1 rounded-full border border-[#2A2A2C] w-fit">
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-6 py-2 text-xs font-bold rounded-full transition-all flex items-center gap-2 ${
              activeTab === 'categories' 
                ? 'bg-[#D4AF37] text-black' 
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" /> Categories
          </button>
          <button
            onClick={() => setActiveTab('tags')}
            className={`px-6 py-2 text-xs font-bold rounded-full transition-all flex items-center gap-2 ${
              activeTab === 'tags' 
                ? 'bg-[#D4AF37] text-black' 
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <Hash className="w-3.5 h-3.5" /> Tags
          </button>
        </div>

        {/* Content Area */}
        <div className="transition-opacity duration-300">
          {activeTab === 'categories' ? (
            <CategoryTable
              categories={categories}
              isLoading={isLoadingCategories}
              onAdd={() => { setSelectedCategory(null); setIsCategoryModalOpen(true); }}
              onEdit={(cat) => { setSelectedCategory(cat); setIsCategoryModalOpen(true); }}
              onDelete={handleDeleteCategory}
            />
          ) : (
            <TagTable
              tags={tags}
              isLoading={isLoadingTags}
              onAdd={() => { setSelectedTag(null); setIsTagModalOpen(true); }}
              onEdit={(tag) => { setSelectedTag(tag); setIsTagModalOpen(true); }}
              onDelete={handleDeleteTag}
            />
          )}
        </div>

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
    </ResponsiveLayout>
  );
}