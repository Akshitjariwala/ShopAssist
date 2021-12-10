import api from "common/api";
import { config } from "./config";

export const fetchProducts = (productName) => {
  return api
    .post(`${config.SERVER_URL}/FetchProducts`, { product: productName })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err.response;
    });
};

export const loadIntoDatabase = (payload) => {
  return api
    .post(`${config.SERVER_URL}/LoadDatabase`, { data: payload })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err.response;
    });
};

export const fetchSentiment = (payload) => {
  return api
    .post(`${config.SERVER_URL}/FetchSentiment`, { data: payload })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err.response;
    });
};
