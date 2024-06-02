import { useGoogleLogin } from "@react-oauth/google";
import { Button } from "@/components/ui/button";
import { UserContext } from "@/utils/userContext";
import { useContext } from "react";
import Cookies from "js-cookie";
import { toast } from "./use-toast";
import {  useNavigate } from "react-router-dom";

export default function GoogleLoginButton(props: { title: string }) {
    // Get the history object from react-router-dom
    const navigate = useNavigate();
    const { title } = props;
    const {  setUser } = useContext(UserContext);

    // Function to handle successful Google login
    const successFunction = async (response: { [x: string]: string; code: string }) => {
        try {
            if (response["code"]) {
                const result = await googleAuth(response.code);
                if (result.status) {
                    const userData = result.data[0].data.name;
                    setUser(userData);

                    Cookies.set('token', `Bearer ${result.data[0].token}`);
                    toast({
                        title: "You have successfully logged in",
                        description: (
                            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                                <code className="text-white">{JSON.stringify(result.message, null, 2)}</code>
                            </pre>
                        ),
                    });
                }
                navigate('/Dashboard');
            }
        } catch (e) {
            return e;
        }
    };


    // Function to authenticate with Google
    const googleAuth = async (code: string) => {
        const baseUrl = import.meta.env.VITE_BASE_URL;
        const body = {
            code: code
        };
        const response = await fetch(`${baseUrl}/user/google-auth`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        return response.json();
    };

    // useGoogleLogin hook to handle Google sign-in
    const signIn = useGoogleLogin({
        flow: 'auth-code',
        onSuccess: (tokenResponse) => successFunction({ code: tokenResponse.code }),
        onError: (error) => {
            toast({
                title: "Error",
                description: (
                    <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                        <code className="text-white">{JSON.stringify(error, null, 2)}</code>
                    </pre>
                ),
            })
        }
    })

    return (
        <Button variant='outline' className="w-2/3 h-12 mt-12"><span className="flex flex-row items-center" onClick={signIn}><img className="h-8 me-5" src="/google.png" alt="google icon" /> {title}
        </span></Button>
    )
}
