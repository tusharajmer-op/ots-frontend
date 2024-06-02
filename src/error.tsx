import { useNavigate } from "react-router-dom";
import { Button } from "./components/ui/button";

export default function ErrorPage() {
    const navigate = useNavigate();
    return (
        <div className='h-full w-full flex justify-center items-center'>
            <div className="flex flex-col space-y-5">
                <h1 className="text-2xl">404 Not Found</h1>
                <p>Sorry, the page you are looking for does not exist.</p>
                <Button variant="black" onClick={() => navigate('/Dashboard')}>Go back to Home</Button>
            </div>
        </div>
    )
}
