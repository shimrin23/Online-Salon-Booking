import axios from "axios";

// Remove the base URL when using proxy
// axios.defaults.baseURL = "http://localhost:5001"; // Comment out or remove this line

const fetchData = async (url) => {
  try {
    const token = localStorage.getItem("token");
    
    const { data } = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return data;
  } catch (error) {
    console.error("API fetch error:", error);
    throw error;
  }
};

export default fetchData;
