import { useState } from 'react'
import './App.css'

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [title, setTitle] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [message, setMessage] = useState('')

  const apiBase = 'http://wordpress.co/wp-json/reactwp/v1'

  // ---- Login ----
  const handleLogin = async (e) => {
    e.preventDefault()
    setMessage('در حال ورود...')
    try {
      const res = await fetch(`${apiBase}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()
      if (res.ok) {
        setLoggedIn(true)
        setMessage('ورود موفق ✅')
        // گرفتن تایتل فعلی
        const titleRes = await fetch(`${apiBase}/get-title`)
        const titleData = await titleRes.json()
        setTitle(titleData.title)
      } else {
        setMessage(data.message || 'ورود ناموفق ❌')
      }
    } catch (err) {
      setMessage('خطا در ارتباط با سرور')
    }
  }

  // ---- Change Title ----
  const handleChangeTitle = async (e) => {
    e.preventDefault()
    setMessage('در حال بروزرسانی...')
    try {
      const res = await fetch(`${apiBase}/update-title`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ new_title: newTitle }),
      })
      const data = await res.json()
      if (res.ok) {
        setTitle(newTitle)
        setMessage('عنوان با موفقیت بروزرسانی شد ✅')
      } else {
        setMessage(data.message || 'خطا در بروزرسانی ❌')
      }
    } catch (err) {
      setMessage('خطا در ارتباط با سرور')
    }
  }

  // ---- UI ----
  if (!loggedIn)
    return (
      <div className="login-page">
        <h2>ورود به سایت وردپرس</h2>
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
    )

  return (
    <div className="main-page">
      <h2>تغییر عنوان سایت وردپرس</h2>
      <p><b>عنوان فعلی:</b> {title}</p>

      <form onSubmit={handleChangeTitle}>
        <input
          type="text"
          placeholder="عنوان جدید..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          required
        />
        <button type="submit">ذخیره تغییرات</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  )
}

export default App
