/* import { useState } from "react";

export const TestAuth = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          email: `${username}@test.com`,
        }),
      });
      const data = await res.json();
      setMessage(data.message || data.error);
    } catch (err) {
      setMessage("Connection failed!");
      console.error(err);
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        background: "#1a1a1a",
        color: "cyan",
        borderRadius: "8px",
      }}
    >
      <h3>Neo Tokyo Terminal: Auth Test</h3>
      <input
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
        style={{ display: "block", marginBottom: "10px" }}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: "block", marginBottom: "10px" }}
      />
      <button onClick={handleRegister}>Create Player</button>
      <p>{message}</p>
    </div>
  );
};
 */
