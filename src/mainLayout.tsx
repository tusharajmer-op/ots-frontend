
import { Outlet } from 'react-router-dom';
import Footer from './components/ui/footer.tsx'; // Adjust the path if necessary


const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;
