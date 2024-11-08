import { ThemeProvider } from "@/components/theme-provider"
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './App.css'
import MenuBar from "./components/menu-bar"
import Home from "./pages/Home/Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MenuBar />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <div>LOGIN</div>,
      },
      {
        path: "/signup",
        element: <div>SIGN UP</div>,
      },
      {
        path: "/profile",
        element: <div>PROFILE</div>,
      },
      {
        path: "/draft",
        element: <div>DRAFT</div>,
      }
    ],
    errorElement: <div>404 - Page Not Found</div>
  },
]);

function App() {

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}

export default App
