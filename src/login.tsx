import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Cookies from "js-cookie";
import './App.css';
import { toast } from "@/components/ui/use-toast";
import { z } from 'zod';
import GoogleLoginButton from './components/ui/googleLoginButton';
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "./utils/userContext";

export default function Login() {
    const history = useNavigate();
    const { setUser } = useContext(UserContext);

    // Define the login schema using Zod
    const loginSchema = z.object({
        email: z.string().email().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, { message: 'Email must be a valid gmail address' }),
        password: z.string().min(6).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/, { message: 'Password must contain at least one uppercase letter, One number and a special character' }),
    });

    // Initialize the form with default values and resolver
    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        }
    });

    // Handle form submission
    const submit = (data: z.infer<typeof loginSchema>) => {
        const baseUrl = import.meta.env.VITE_BASE_URL;
        const body = {
            email: data.email,
            password: data.password
        };

        // Send a POST request to the server
        fetch(`${baseUrl}/user/log-in`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
            .then(res => res.json())
            .then(data => {
                if (data.status) {
                    const userData = data.data[0].data.name;
                    setUser(userData);
                    const token = data.data[0].token;
                    Cookies.set('token', `Bearer ${token}`);
                    toast({
                        title: "Login Successful",
                        description: (
                            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                                <code className="text-white">{JSON.stringify("Login Successfull", null, 2)}</code>
                            </pre>
                        ),
                    });
                    history('/Dashboard');
                } else {
                    toast({
                        title: "Error",
                        description: (
                            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                                <code className="text-white">{JSON.stringify(data.message, null, 2)}</code>
                            </pre>
                        ),
                    });
                }
            })
            .catch(err => {return err});
    };

    return (
        <>
            <div className='flex flex-col mb-12 lg:flex-row lg:mb-0 lg:h-full'>
                <div className='flex-6 ' >
                    <div className="lg:h-full p-4">
                        <img className="w-full h-full rounded-3xl" src="/subtleBackground/subtleBackground.jpg" alt="Background" />
                    </div>
                </div>

                <div className=' flex-6 w-full lg:w-2/3 flex flex-col justify-center space-y-4 items-center'>
                    <h1 className="text-5xl mt-12 lg:mt-0 font-bold text-center w-full">Welcome Back!</h1>
                    <p>Continue with Google or enter your details</p>
                    <div className="flex flex-col w-full items-center">
                        <GoogleLoginButton title="Log in with Google" />
                    </div>
                    <div className="flex  w-2/3 flex-col mt-16">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(submit)} className="space-y-8 mt-12 w-full">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem className="w-full flex flex-col items-start">
                                            <FormLabel className="text-lg">Email</FormLabel>
                                            <FormControl>
                                                <Input className="w-full h-12"
                                                    type='text'
                                                    placeholder="Please enter your email"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem className="w-full flex flex-col items-start">
                                            <FormLabel className="text-lg">Password</FormLabel>
                                            <FormControl>
                                                <Input className="w-full h-12"
                                                    type='password'
                                                    placeholder="Please enter your Password"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex justify-end w-full">
                                    <Link to="/sign-up" className="text-blue-600 -mt-4">Forgot Password?</Link>
                                </div>
                                <Button type="submit" className="w-full h-12 ">Login</Button>
                            </form>
                        </Form>
                        <div>
                            <p className="text-sm mt-8">Don't have an account? <Link to="/sign-up" className="text-blue-600">Register</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
