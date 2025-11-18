import { useState, FormEvent } from "react";
import { useAuth } from "../../context/AuthProvider";
import { Navigate, useNavigate } from "react-router-dom";

interface LoginProps {
  switchToRegister: () => void;
}

export default function Login({ switchToRegister }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { login } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const success = await login(username, password);

    if (!success) {
      alert("Login failed");
      return;
    }

    alert("Login successful!");
    navigate("/");
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Login</h2>

      <div className="form-item">
        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>

      <div className="form-item">
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button className="btn" type="submit">
        Login
      </button>

      <p style={{ marginTop: "10px" }}>
        Don't have an account?{" "}
        <span style={styles.link} onClick={switchToRegister}>
          Sign Up
        </span>
      </p>
    </form>
  );
}

const styles: Record<string, React.CSSProperties> = {
  link: { color: "blue", cursor: "pointer", textDecoration: "underline" },
};
