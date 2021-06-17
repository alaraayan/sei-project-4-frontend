import React from 'react'
import { useHistory, Link } from 'react-router-dom'
import { loginUser } from '../../lib/api'
import { setToken } from '../../lib/auth'
import useForm from '../hooks/useForm'
import { ToastContainer, toast } from 'react-toastify'

function Login() {
  const history = useHistory()
  const [isError, setIsError] = React.useState(false)
  const { formData, handleChange } = useForm({
    email: '',
    passwords: '',
  })

  const handleSubmit = async event => {
    event.preventDefault()

    try {
      const res = await loginUser(formData)
      setToken(res.data.token)
      toast.dark('🚀 Successfully logged in!', {
        position: 'top-right',
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
      history.push('/dashboard')
    } catch (e) {
      setIsError(true)
    }
  }

  return (
    <section className="user-forms">
      <section className="form-container">
        <h1 className="user-form">Log In</h1>
        <form className="user-form" onSubmit={handleSubmit} >
          
          <div>
            <input
              className="user-form user-info"
              placeholder="Email"
              name="email"
              onChange={handleChange}
            />
          </div>
          <div>
            <input
              className="user-form user-info"
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
            />
          </div>
          {isError && (
            <p>
            Either email or password were incorrect
            </p>
          )}
        
          <div>
            <button type="submit" className="user-form submit-button">
            Log In
            </button>
          </div>
            
        </form>
        <footer>
          <h5 className="user-form">New to Zenith? <span><Link to="/register">Register now</Link></span></h5>
        </footer>
        
      </section>
      <ToastContainer />
    </section>
            
  )
} 

export default Login