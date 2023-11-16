import { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';

export const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchProfile();
    }
  }, [token]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('http://localhost:3000/users/profile');
      setUser(response.data);
    } catch (error) {
      // If fetching profile fails, remove the token as it might be invalid
      logout();
      console.error('Error fetching user profile', error);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:3000/users/login', { email, password });
      setToken(response.data.token);
      setUser(response.data.user);
      localStorage.setItem('token', response.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    } catch (error) {
      console.error('Error during login', error);
      // Handle login error, e.g., set an error message state and display it to the user
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
