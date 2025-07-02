import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

const fetchData = async (url) => {
  try {
    const { data } = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return data;
  } catch (error) {
    console.error("API fetch error:", error);
    throw error; // re-throw to handle later if needed
  }
};

export default fetchData;
