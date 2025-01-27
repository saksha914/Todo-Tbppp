import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const SignIn = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // For demo purposes, just navigate to dashboard
    navigate('/')
  }

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Sign In</h1>
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
        />
        <button type="submit">Sign In</button>
        <p>
          Dont have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </form>
    </div>
  )
}

export default SignIn 