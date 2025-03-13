import apiCient from "./apiCient";

const QuoteServices = {
  addQutote: (data) => {
    return apiCient.post(`/quote/addQuote`, data);
  },

  allQutote: () => {
    return apiCient.get(`/project/getProject`);
  },
  getproject: () => {
    return apiCient.get(`/project/getProject`);
  },

  getProjectBySearch: (data) => {
    const query = data ? `?search=${encodeURIComponent(data)}` : "";
    return apiCient.get(`project/getProject${query}`);
  },

  addQuoteArchive: (id, data) => {
    return apiCient.put(`/quote/updateQuote?quoteId=${id}`, data);
  },

  quoteupdate: (id, data) => {
    return apiCient.put(`/quote/archiveUpdateQuote?quoteId=${id}`, data);
  },

  getAllArchive: () => {
    return apiCient.get(`/project/getProject?archieve=1`);
  },
  getProjectById: (id) => {
    return apiCient.get(`/project/getProject?projectId=${id}`);
  },

  getQuoteById: (id) => {
    return apiCient.get(`/quote/getQuoteById?quoteId=${id}`);
  },

  searchByProject: (data) => {
    const query = data ? `?search=${encodeURIComponent(data)}` : "";
    return apiCient.get(`/project/projectList${query}`);
  },

  signwellApi: (data) => {
    return apiCient.post(`signWell/createSignWell`, data);
  },
};

export default QuoteServices;
