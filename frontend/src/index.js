import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import UploadPage from "./pages/uploadPage";
import AnnotatePage from "./pages/annotatePage";
import DownloadPage from "./pages/downloadPage";
import CustomizePage from "./pages/customizePage";
import LoginPage from "./pages/loginPage";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/customize",
    element: <CustomizePage />,
  },
  {
    path: "/upload",
    element: <UploadPage />,
  },
  {
    path: "/annotate",
    element: <AnnotatePage />,
  },
  {
    path: "/download",
    element: <DownloadPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router} />);
