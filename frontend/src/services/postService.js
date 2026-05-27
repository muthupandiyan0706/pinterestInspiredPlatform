import api from '../api/axios';

export const postService = {
  getAllPosts: async () => {
    const response = await api.get('/posts');
    return response.data;
  },

  getPostById: async (id) => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },

  createPost: async (data) => {
    const response = await api.post('/posts', data);
    return response.data;
  },

  deletePost: async (id) => {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  },

  updatePost: async (id, data) => {
    const response = await api.put(`/posts/${id}`, data);
    return response.data;
  },

  searchPosts: async (query) => {
    const response = await api.get(`/posts/search?query=${encodeURIComponent(query)}`);
    return response.data;
  },

  getPostsByCategory: async (category) => {
    const response = await api.get(`/posts/category/${encodeURIComponent(category)}`);
    return response.data;
  },

  getPostsByUser: async (userId) => {
    const response = await api.get(`/posts/user/${userId}`);
    return response.data;
  },
};

export default postService;
