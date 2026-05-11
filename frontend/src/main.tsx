import React from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Route,
  Routes,
  RouterProvider,
  Link,
} from "react-router-dom";

import "./index.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";

import User from "./ts/user";
import UserTransfer from "./ts/userTransfer";
import UserServices from "./ts/userServices";

// const router = createBrowserRouter([
//   {
//     path: "/",
//     // element: <RootLayout />,
//     // errorElement: <ErrorPage />,
//     children: [
//       {
//         path: "home",
//         element: <Home />,
//       },
//     ],
//   },
// ]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* Navigation */}
      <nav>
        <Link to="http://localhost:3000/services">Home</Link> |{" "}
        <Link to="/about">About</Link> | <Link to="/contact">Contact</Link>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<User />} />
        <Route path="/transfer" element={<UserTransfer />} />
        <Route path="/services" element={<UserServices />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
