import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter } from "react-router-dom";
import AllRoutes from "./Routes/index";
import AuthProvider from "./Contexts/auth";
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer autoClose={3000}/>
        <AllRoutes/>   
      </BrowserRouter>
    </AuthProvider>
    
  );
}

export default App;
