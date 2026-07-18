import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap-icons/font/bootstrap-icons.css";

import User from "./js/user";
import UserTransfer from "./js/userTransfer";
import UserServices from "./js/userServices";

const router = createBrowserRouter([
  {
    path: "/",
    element: <User />,
  },
  {
    path: "/transfer",
    element: <UserTransfer />,
  },
  {
    path: "/services",
    element: <UserServices />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
