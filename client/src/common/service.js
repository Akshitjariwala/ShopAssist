import api from "common/api";

export const fetchProducts = (productName) => {
  return api
    .post("http://3.91.200.252:8080/FetchProducts", { product: productName })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err.response;
    });
};

export const loadIntoDatabase = (payload) => {
  return api
    .post("http://3.91.200.252:8080/LoadDatabase", { data: payload })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err.response;
    });
};

export const fetchSentiment = (payload) => {
  return api
    .post("http://3.91.200.252:8080/FetchSentiment", { data: payload })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err.response;
    });
};
