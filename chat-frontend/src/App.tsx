import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./pages/Home";
const App = () => {
  const router = createBrowserRouter([
    {
      path: "/home",
      element: <Home />,
    },
  ]);
  return <RouterProvider router={router} />;
};

export default App;
