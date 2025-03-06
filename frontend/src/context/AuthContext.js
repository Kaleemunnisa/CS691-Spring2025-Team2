import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token"); // Get stored token
                if (!token) throw new Error("No token found");

                const res = await axios.get("http://localhost:8000/api/auth/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                });

                setUser(res.data);
            } catch (error) {
                console.error("Profile fetch error:", error);
                setUser(null);
                localStorage.removeItem("token"); // Clear token if unauthorized
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const login = async (credentials) => {
        try {
            console.log("Attempting login with:", credentials.email);
            
            // Ensure credentials have the required fields
            if (!credentials.email || !credentials.password) {
                return { 
                    success: false, 
                    message: "Email and password are required" 
                };
            }
            
            const res = await axios.post("http://localhost:8000/api/auth/login", credentials, { 
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' }
            });
            
            console.log("Login response:", res.data);
            
            if (res.data && res.data.token) {
                localStorage.setItem("token", res.data.token);
                setUser(res.data.user);
                return { success: true };
            } else {
                return { 
                    success: false, 
                    message: "Login successful but token was not provided" 
                };
            }
        } catch (error) {
            console.error("Login error:", error);
            // Provide more detailed error messages based on the response
            return { 
                success: false, 
                message: error.response?.data?.message || "Login failed. Please check your credentials."
            };
        }
    };

    const register = async (userData) => {
        try {
            // Convert age, height, and weight to numbers
            const formattedData = {
                ...userData,
                age: Number(userData.age),
                height: userData.height ? Number(userData.height) : undefined,
                weight: userData.weight ? Number(userData.weight) : undefined
            };
            
            console.log("Registering with data:", formattedData);
            const res = await axios.post("http://localhost:8000/api/auth/register", formattedData, { withCredentials: true });
            console.log("Registration response:", res.data);

            if (res.data.token) {
                localStorage.setItem("token", res.data.token); // Store token
                setUser(res.data.user);
            }
            return { success: true };
        } catch (error) {
            console.error("Registration error:", error.response?.data || error);
            return { 
                success: false, 
                message: error.response?.data?.message || error.response?.data?.details || "Registration failed" 
            };
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;