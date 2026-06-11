// src/features/Common/F6_FilterByCategory/types/index.ts

export interface TagInfo {
  id: string;
  name: string;
  slug: string;
  color: string | null;
  posts_count: number;
}

export interface CategoryWithTags {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  post_count: number;
  tags: TagInfo[];
}

export interface CategoriesWithTagsResponse {
  status: string;
  data: CategoryWithTags[];
}
