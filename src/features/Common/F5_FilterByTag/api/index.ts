import axios from 'axios';
import type { TagDetailData } from '../types';
import type { BaseApiResponse } from '../../../../types';


const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

export const getPostsByTag = async (slug: string, page = 1): Promise<BaseApiResponse<TagDetailData>> => {
  const response = await axios.get(`${API_URL}/explore/tag/${slug}`, {
    params: { page }
  });
  return response.data;
};

export const getAllTags = async () => {
  const response = await axios.get(`${API_URL}/explore/tags`); 
  return response.data;
};