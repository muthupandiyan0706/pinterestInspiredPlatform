import api from '../api/axios';

export const savedPostService = {
  savePost: async (postId) => {
    const response = await api.post(`/saved/${postId}`);
    return response.data;
  },

  unsavePost: async (postId) => {
    const response = await api.delete(`/saved/${postId}`);
    return response.data;
  },

  getSavedPosts: async () => {
    const response = await api.get('/saved');
    return response.data;
  },
};

export default savedPostService;
