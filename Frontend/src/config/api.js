// API configration for devTrack
const isDevelopment = process.env.NODE_ENV === 'development';

// backend url
// export const API_BASE_URL = isDevelopment 
//              ? 'http://localhost:3000' 
//              :'https://devtrack-backend-7xxu.onrender.com';
export const API_BASE_URL ='https://dev-tracker-api.vercel.app' 


export const API_URL = `${API_BASE_URL}/api/v1`;
export const SOCKET_URL = API_BASE_URL;

// API end point
export const ENDPOINTS = {
  AUTH: {
    REGISTER: `${API_URL}/signup`,
    LOGIN: `${API_URL}/login`,
    LOGOUT: `${API_URL}/logout`,
  },
  PROJECTS: `${API_BASE_URL}/api/v1/projects`,
  TICKETS: `${API_BASE_URL}/api/v1/tickets`,
};

const config = {
  API_BASE_URL,
  API_URL,
  SOCKET_URL,
  ENDPOINTS,
};

export default config; 
