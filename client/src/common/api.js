import axios from "axios";
import { config } from "./config";
import React from 'react';

// use only for image upload
const api = axios.create({
  baseURL: config.SERVER_URL,
});

export default api;
