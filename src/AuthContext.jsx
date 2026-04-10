import { createContext, useContext, useState } from "react";

const API = "https://fsa-jwt-practice.herokuapp.com";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState();
  const [location, setLocation] = useState("GATE");

  async function signup(username) {
    const response = await fetch(`${API}/signup`, {
    method: "POST",
    headers: {"Content-type": "application/json" },
    body: JSON.stringify({ username, password: "password" }),
  });
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    setToken(data.token);
    setLocation("TABLET");
  }

  async function authenticate() {
    if (!token) throw new Error("No token found. Please sign up first.");
    const response = await fetch(`${API}/authenticate`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    setLocation("TUNNEL");
  }

  const value = { location, signup, authenticate };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw Error("useAuth must be used within an AuthProvider");
  return context;
}
