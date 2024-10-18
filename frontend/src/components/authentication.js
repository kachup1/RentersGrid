// authUtils.js
export const isTokenValid = () => {
    const token = localStorage.getItem('token');
  
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));  // Decode the token
        const currentTime = Date.now() / 1000;  // Get the current time in seconds
  
        if (decodedToken.exp < currentTime) {
          // Token is expired, so remove it
          localStorage.removeItem('token');
          return false;
        } else {
          // Token is valid
          return true;
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem('token');  // Remove invalid token
        return false;
      }
    } else {
      // No token found
      return false;
    }
  };
  