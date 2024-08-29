import { commonrequest } from "./commonrqst";


export const postFeedbackApi = async (body) => {
   console.log('body', body)
   return commonrequest("POST", `${import.meta.env.VITE_API_URL}feedback/add`, body);
};

export const getAllFeedbacks = async () => {
   return commonrequest("GET", `${import.meta.env.VITE_API_URL}feedback/getAll`);
};

export const getFeedback = async (params) => {
   return commonrequest("GET", `${import.meta.env.VITE_API_URL}feedback/get/${params}`);
};