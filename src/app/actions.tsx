import axios from 'axios';

// Axios instance setup
const axiosInstance = axios.create({
  baseURL: 'https://expressjs-murex.vercel.app/', // Your API base URL
  timeout: 10000,  // Timeout for requests
});

// Request Interceptor: Add Access Token to Headers
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Helper function to refresh the access token
const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    // Call your API endpoint to refresh the access token
    const response = await axios.post('https://api.yourservice.com/refresh-token', {
      refresh_token: refreshToken,
    });

    // Save the new tokens (assuming response contains accessToken and refreshToken)
    localStorage.setItem('accessToken', response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);

    return response.data.accessToken;
  } catch (error) {
    console.error('Refresh token failed', error);
    // Optionally redirect to login or show an error
    return Promise.reject(error);
  }
};

// Response Interceptor: Handle 401 Errors (Token Expiry)
let isRefreshing = false;
let failedQueue: any = [];

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      // If token has expired and not already retrying
      if (!isRefreshing) {
        isRefreshing = true;
        
        // Try refreshing the access token
        try {
          const newAccessToken = await refreshAccessToken();

          // Retry all failed requests with the new access token
          failedQueue.forEach((cb: any) => cb(newAccessToken));
          failedQueue = [];

          // Modify the original request to include the new access token
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          
          return axiosInstance(originalRequest);  // Retry the original request
        } catch (err) {
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }

      // Add failed request to the queue if token is refreshing
      return new Promise((resolve) => {
        failedQueue.push((newAccessToken: any) => {
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          resolve(axiosInstance(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
