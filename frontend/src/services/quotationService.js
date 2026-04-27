import api from './api';

const quotationService = {
  getQuotations: async () => {
    const response = await api.get('/quotations');
    return response.data;
  },
  createQuotation: async (quotationData) => {
    const response = await api.post('/quotations', quotationData);
    return response.data;
  },
};

export default quotationService;
