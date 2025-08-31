import axios from "axios";

// Remove the base URL when using proxy
// axios.defaults.baseURL = "http://localhost:5001"; // Comment out or remove this line

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
