import {  createContext,useEffect,useState } from 'react';
import { GoogleOAuthProvider } from "@react-oauth/google";

const UserContext = createContext<{ user:string ; setUser: React.Dispatch<React.SetStateAction<string>> }>({ user: '', setUser: () => {} });

const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<string>(()=>{
        return localStorage.getItem('userName') || '';
    });
    useEffect(() => {
        // Save userName to localStorage whenever it changes
        localStorage.setItem('userName', user);
      }, [user]);

    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID as string}>
            <UserContext.Provider value={{ user, setUser }}>
                    {children}
            </UserContext.Provider>
        </GoogleOAuthProvider>
    );
}

export { UserContext, UserProvider } 