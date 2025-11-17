import { useState } from "react";
import Login from "./Login";
import Register from "./Register";

import "./Auth.css";

export default function AuthLayout() {
  const [page, setPage] = useState<"login" | "register">("login");

  return (
    <div className="container">
      {page === "login" ? (
        <Login switchToRegister={() => setPage("register")} />
      ) : (
        <Register switchToLogin={() => setPage("login")} />
      )}
    </div>
  );
}
