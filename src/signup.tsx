import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import './App.css'
import { z } from 'zod';
import Cookies from "js-cookie"
import GoogleLoginButton from './components/ui/googleLoginButton';
import { Link, useNavigate } from "react-router-dom"
import { useContext } from "react"
import { UserContext } from "./utils/userContext"

function Signup() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  // Define validation schema using zod
  const schema = z.object({
    name: z.string().min(3, { message: 'Name must be at least 3 characters long' }),
    email: z.string().email().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, { message: 'Email must be a valid gmail address' }),
    password: z.string().min(6).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/, { message: 'Password must contain at least one uppercase letter, one number and one special character' }),
    confirmPassword: z.string().min(6).regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' }),
  });

  // Initialize react-hook-form with the validation schema and default values
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  })

  // Handle form submission
  const submit = (data: z.infer<typeof schema>) => {
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const body = {
      name: data.name,
      email: data.email,
      password: data.password
    }

    // Check if password and confirm password match
    if (data.password !== data.confirmPassword) {
      toast({
        title: "Error",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">Passwords do not match</code>
          </pre>
        ),
      })
      return;
    }

    // Send form data to the server for signup
    fetch(`${baseUrl}/user/sign-up`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }).then(res => res.json()).then(data => {
      if (data.status) {
        const userData = data.data[0].data.name
        setUser(userData);
        const token = data.data[0].token;
        Cookies.set('token', `Bearer ${token}`);
        toast({
          title: "Signup Successful",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">Signup successfull</code>
            </pre>
          ),
        })
        navigate('/Dashboard');
      }
      else {
        toast({
          title: "Error",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">{data.message}</code>
            </pre>
          ),
        })
      }
    }).catch(()=>{return});
  }

  return (
    <>
      <div className='flex flex-col mb-12 lg:flex-row lg:mb-0 lg:h-full'>
        <div className='flex-6' >
          <div className="h-full p-4">
            <img className="w-full h-full rounded-3xl" src="/subtleBackground/subtleBackground.jpg" alt="Background" />
          </div>
        </div>
        <div className='flex-6  lg:w-2/3 flex flex-col justify-center space-y-4 items-center'>
          <h1 className="text-5xl font-bold text-center w-full">Create new account</h1>
          <p>Continue with Google or enter your details</p>
          <div className="flex flex-col w-full items-center">
            <GoogleLoginButton title="Sign up with Google" />
          </div>
          <div className="flex  w-2/3 flex-col mt-16">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(submit)} className="space-y-8 mt-12 w-full">
                {['name', 'email', 'password', 'confirmPassword'].map((fieldName) => (
                  <FormField
                    key={fieldName}
                    control={form.control}
                    name={fieldName as "name" | "email" | "password" | "confirmPassword"}
                    render={({ field }) => (
                      <FormItem className="w-full flex flex-col items-start">
                        <FormLabel className="text-lg">{fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}</FormLabel>
                        <FormControl>
                          <Input className="w-full h-12"
                            type={fieldName.includes('password') || fieldName.includes('confirmPassword') ? 'password' : 'text'}
                            placeholder={fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                <Button className="w-full h-12 " type="submit">Submit</Button>
              </form>
            </Form>
          </div>
          <div>
            <p className="text-sm mt-8">Already have an account? <Link to="/log-in" className="text-blue-600">Login</Link></p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Signup
