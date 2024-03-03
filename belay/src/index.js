import React from 'react'
import ReactDOM from 'react-dom/client'
import reportWebVitals from './reportWebVitals'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Register from './components/Register/Register.component'
import Login from './components/Login/Login.component'
import Main from './components/MainPage/MainPage'
import Profile from './components/UserProfile/Profile.component'
import { useEffect } from 'react'

import "semantic-ui-css/semantic.min.css"

function App () {
  const [user, setUser] = React.useState(null)

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem('storedUser'))
    if (localUser) {
      setUser(localUser)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('storedUser', JSON.stringify(user))
  }, [user])

  console.log(localStorage.getItem('storedUser'))

  return (
    < React.StrictMode >
      <Router>
        <Routes>
          <Route path="/login" element={<Login user={user} setUser={setUser} />} />
          <Route path="/register" element={<Register user={user} setUser={setUser} />}></Route>
          <Route path="/" element={<Main user={user} setUser={setUser} />}></Route>
          <Route path="/profile" element={<Profile user={user} setUser={setUser} />}></Route>
        </Routes>
      </Router>
    </React.StrictMode >
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <App />
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
