import axios from "axios";

// Set default base URL for API calls
axios.defaults.baseURL = "http://localhost:5001/api";

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
