import axios from 'axios';

export const fetchProducts = (productName) => {
    return axios.post('http://localhost:8080/FetchProducts', {product : productName})
    .then((res) => {
        return res;
    })
    .catch(err => { return err.response}) 
};

export const loadIntoDatabase = (payload) => {
    console.log(payload);
    return axios.post('http://localhost:8080/LoadDatabase',{data : payload})
    .then((res) => {
        return res;
    })
    .catch(err => { return err.response}) 
}