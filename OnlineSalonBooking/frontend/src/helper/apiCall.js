import axios from "axios";

// Remove the base URL when using proxy
// axios.defaults.baseURL = "http://localhost:5001"; // Comment out or remove this line

const fetchData = async (url) => {
  try {
    const token = localStorage.getItem("token");
    // Remove these console.log statements
    // console.log("Making API call to:", url);
    // console.log("Token exists:", !!token);
    
    const { data } = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    // console.log("API response:", data); // Remove this too
    return data;
  } catch (error) {
    console.error("API fetch error:", error);
    // console.error("Error response:", error.response?.data); // Remove this
    throw error;
  }
};

export default fetchData;
