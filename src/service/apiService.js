import axios from "axios";

const ApiService = {
  ApiListProduct: (params = {}) => {
    return axios
      .get(`https://dummyjson.com/products/search`, {
        params,
      })
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
export default ApiService;
