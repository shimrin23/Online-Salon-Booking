import axios from "axios";

// Configure axios defaults for the environment
const configureProdAxios = () => {
  const envBase = process.env.REACT_APP_SERVER_DOMAIN || "";
  console.log('ENV Server Domain:', process.env.REACT_APP_SERVER_DOMAIN);
  
  // In production/Docker, use the full URL
  if (envBase) {
    const baseURL = envBase.replace(/\/api\/?$/, "");
    console.log('Setting axios baseURL to:', baseURL);
    axios.defaults.baseURL = baseURL;
  } else {
    // In development, rely on the proxy
    console.log('Development mode: using relative paths with proxy');
    axios.defaults.baseURL = '';
  }

  // Add request interceptor for debugging
  axios.interceptors.request.use(config => {
    console.log('Making request to:', config.baseURL + config.url);
    return config;
  });
};

configureProdAxios();

const fetchData = async (url, options = {}) => {
  try {
    const token = localStorage.getItem("token");
    const headers = {
      ...(options.headers || {}),
    };
    if (token) headers.Authorization = `Bearer ${token}`;

    const { data } = await axios.get(url, { headers });
    return data;
  } catch (error) {
    console.error("API fetch error:", error);
    throw error;
  }
};

export default fetchData;
