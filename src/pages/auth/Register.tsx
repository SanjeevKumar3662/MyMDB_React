import { useState, FormEvent } from "react";

interface RegisterProps {
  switchToLogin: () => void;
}

export default function Register({ switchToLogin }: RegisterProps) {
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URI}/api/v1/user/register`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, fullname, email, password }),
        }
      );

      const data = await res.json();
      if (!res.ok) return alert(data.message || "Registration failed");

      alert("Account created successfully!");
      switchToLogin();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  return (
    <form className="auth-form" onSubmit={handleRegister}>
      <h2>Register</h2>

      <div className="form-item">
        <label>User name</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>

      <div className="form-item">
        <label>Full name</label>
        <input
          type="text"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
          required
        />
      </div>

      <div className="form-item">
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
        Sign Up
      </button>

      <p style={{ marginTop: "10px" }}>
        Already have an account?{" "}
        <span style={styles.link} onClick={switchToLogin}>
          Login
        </span>
      </p>
    </form>
  );
}

const styles: Record<string, React.CSSProperties> = {
  link: { color: "blue", cursor: "pointer", textDecoration: "underline" },
};
