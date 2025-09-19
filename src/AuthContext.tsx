import React, { createContext, useContext, useState, useEffect } from 'react';

interface User { id: number; username: string; email: string; }

interface AuthContextType {
    user: User | null;
    token: string | null;
    apiUrl: string;
    baseUrl: string;
    login: (email: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => 
{
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const apiUrl  = "https://melodize-backend.gj8pu6.easypanel.host/api";
    const baseUrl = "https://melodize-backend.gj8pu6.easypanel.host";

    useEffect(() => 
    {
        const storedToken = sessionStorage.getItem('token');
        const storedUser = sessionStorage.getItem('user');
        
        if (storedToken && storedUser) 
        {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }

        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => 
    {
        try 
        {
            const response = await fetch(`${apiUrl}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) throw new Error('Login failed');

            const data = await response.json();
            setToken(data.token);
            setUser(data.user);
            sessionStorage.setItem('token', data.token);
            sessionStorage.setItem('user', JSON.stringify(data.user));
        } 
        catch (error) 
        {
            console.error(error);
            throw error;
        }
    };

    const register = async (username: string, email: string, password: string) => 
    {
        try {
            const response = await fetch(`${apiUrl}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            });

            if (!response.ok) throw new Error('Registration failed');
            
            await login(email, password);
        } 
        catch (error) 
        {
            console.error(error);
            throw error;
        }
    };

    const logout = () => 
    {
        setToken(null);
        setUser(null);
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
    };

  return (
    <AuthContext.Provider value={{ user, token, apiUrl, baseUrl, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};