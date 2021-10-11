import React from 'react'
import useForm from '../hooks/useForm'
import { registerUser } from '../../lib/api'
import { useHistory, Link } from 'react-router-dom'
import { toast } from 'react-toastify'

import styled from 'styled-components'
import FormStyle from '../../styles/styled-components/FormStyle'
import Card from '../../styles/styled-components/GlassCard'
// import gradientBackground from '../../assets/gradient-background.jpg'

function Register() {
  const history = useHistory()
  const [error, setError] = React.useState('')
  const { formData, formErrors, handleChange, clearForm } = useForm({
    name: '',
    username: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    city: '',
  })

  const handleSubmit = async event => {
    event.preventDefault()
    try {
      console.log(formData)
      await registerUser(formData)
      toast.dark('🚀 Thanks for registering. Welcome to zenith!', {
        position: 'top-right',
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
      history.push('/login')
    } catch (e) {
      setError(e.response.data.message)
    }
  }

  return (
    <Section>
      <Card isFlex flexDirection="column" alignItems="center" width="40%">
        <h1>Create a new account</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <FormStyle.Input
              placeholder="Name"
              onChange={handleChange}
              name="name"
              value={formData.name}
            />
            {formErrors.name && <p>{formErrors.name}</p>}
          </div>
          <div>
            <FormStyle.Input
              placeholder="Username"
              onChange={handleChange}
              name="username"
              value={formData.username}
            />
            {formErrors.username && <p>{formErrors.username}</p>}
          </div>
          <div>
            <FormStyle.Input
              className="user-form user-info"
              placeholder="Email"
              onChange={handleChange}
              name="email"
              value={formData.email}
            />
            {formErrors.email && <p>{formErrors.email}</p>}
          </div>
          <div>
            <FormStyle.Input
              type="password"
              placeholder="Password"
              onChange={handleChange}
              name="password"
              value={formData.password}
            />
            {formErrors.password && <p>{formErrors.password}</p>}
          </div>
          <div>
            <FormStyle.Input
              type="password"
              placeholder="Password Confirmation"
              onChange={handleChange}
              name="passwordConfirmation"
              value={formData.passwordConfirmation}
            />
            {formErrors.passwordConfirmation && (
              <p>{formErrors.passwordConfirmation}</p>
            )}
          </div>
          {error && <p>{error}</p>}
          <div>
            <FormStyle.Input
              placeholder="Your city"
              onChange={handleChange}
              name="city"
              value={formData.city}
            />
          </div>
          {error && <p>{error}</p>}
          <ButtonContainer>
            <button type="submit">Register</button>
            <button type="button" onClick={clearForm}>
              Clear Form
            </button>
          </ButtonContainer>
        </form>
        <FormStyle.P>
          Already signed up? <Link to="/login">Login instead.</Link>
        </FormStyle.P>
      </Card>
    </Section>
  )
}

export default Register

const Section = styled.section`
  background-image: url('https://images.unsplash.com/photo-1528722828814-77b9b83aafb2?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3300&q=80');
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
  background-position: center;
  height: calc(100% - var(--navbar-height));
  display: flex;
  justify-content: center;
  align-items: center;
`
const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px;
`
