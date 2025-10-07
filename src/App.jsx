import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [token, setToken] = useState("");
  const [title, setTitle] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [message, setMessage] = useState("");

  const API_BASE = "http://wordpress.co/wp-json/reactwp/v1";

  // ---- check if token already exists ----
  useEffect(() => {
    const storedToken = localStorage.getItem("reactwp_token");
    if (storedToken) {
      setToken(storedToken);
      setLoggedIn(true);
      fetchTitle(storedToken);
    }
  }, []);

  // ---- login ----
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("در حال ورود...");
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setToken(data.token);
        localStorage.setItem("reactwp_token", data.token);
        setLoggedIn(true);
        setMessage("ورود موفق ✅");
        fetchTitle(data.token);
      } else {
        setMessage(data.error || "ورود ناموفق ❌");
      }
    } catch (err) {
      setMessage("خطا در ارتباط با سرور");
    }
  };

  // ---- fetch current title ----
  const fetchTitle = async (token) => {
    try {
      const res = await fetch(`${API_BASE}/get-title`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setTitle(data.title);
      } else {
        setMessage(data.error || "خطا در دریافت عنوان");
      }
    } catch (err) {
      setMessage("خطا در ارتباط با سرور");
    }
  };

  // ---- update title ----
  const handleUpdateTitle = async (e) => {
    e.preventDefault();
    if (!newTitle) return;
    setMessage("در حال بروزرسانی...");
    try {
      const res = await fetch(`${API_BASE}/update-title`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ title: newTitle }),
      });
      const data = await res.json();
      if (res.ok) {
        setTitle(newTitle);
        setMessage("عنوان با موفقیت بروزرسانی شد ✅");
        setNewTitle("");
      } else {
        setMessage(data.error || "خطا در بروزرسانی ❌");
      }
    } catch (err) {
      setMessage("خطا در ارتباط با سرور");
    }
  };

  // ---- logout ----
  const handleLogout = () => {
    localStorage.removeItem("reactwp_token");
    setLoggedIn(false);
    setToken("");
    setUsername("");
    setPassword("");
    setMessage("");
  };

  // ---- UI ----
  if (!loggedIn) {
    return (
      <div className="login-page">
        <h2>ورود به پروژه React</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="نام کاربری"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="رمز عبور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">ورود</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    );
  }

  return (
    <div className="main-page">
      <h2>تغییر عنوان سایت وردپرس</h2>
      <p><b>عنوان فعلی:</b> {title}</p>
      <form onSubmit={handleUpdateTitle}>
        <input
          type="text"
          placeholder="عنوان جدید..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          required
        />
        <button type="submit">ذخیره تغییرات</button>
      </form>
      <button onClick={handleLogout} style={{marginTop:"10px"}}>خروج</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default App;
