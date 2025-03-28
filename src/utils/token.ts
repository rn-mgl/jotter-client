import axios from "axios";

export const getCSRFToken = async () => {
  const url = process.env.NEXT_PUBLIC_API_URL;

  const { data } = await axios.get(`${url}/csrf_token`, {
    withCredentials: true,
  });

  return data.token;
};
