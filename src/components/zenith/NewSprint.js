import React from 'react'
import { addNewSprint } from '../../lib/api'
import { useHistory } from 'react-router-dom'
import { isAuthenticated } from '../../lib/auth'
import { UserContext } from '../context/UserContext'
import useForm from '../hooks/useForm'
import styled from 'styled-components'
// import FormStyle from '../../styles/styled-components/FormStyle'
import StyledCard from '../../styles/styled-components/Card'

export default function NewSprint() {
  // const [isError, setIsError] = React.useState(null)
  const isLoggedIn = isAuthenticated()
  const [isStartingNewSprint, setisStartingNewSprint] = React.useState(false)
  const history = useHistory()
  const { user, refreshUser } = React.useContext(UserContext)
  // console.log(user)
  const isLoading = !user
  const { formData, formErrors, handleChange } = useForm({
    sprintName: '',
  })

  const handleStartToggle = () => {
    setisStartingNewSprint(!isStartingNewSprint)
  }

  const handleNewSprint = async event => {
    event.preventDefault()
    try {
      await addNewSprint(formData)
      refreshUser()
      history.push('/sprints/new/setup')
    } catch (e) {
      console.log(e)
    }
  }

  // if (currentSprint) {
  //   history.push('/dashboard')
  // }

  if (!isLoggedIn) {
    history.push('/401')
  }

  return (
    <>
      {isLoading && (
        <Container>
          <p>ॐ..loading...ॐ</p>
        </Container>
      )}
      {user && (
        <>
          <Section>
            <Container>
              <StyledCard
                background="rgba(247, 247, 247, 0.658)"
                color="#100f10"
              >
                <div className={isStartingNewSprint ? 'no-show' : ''}>
                  <h2>Hey {user.name},</h2>
                  <h4>Welcome to Zenith!</h4>

                  <p>
                    It looks like you&apos;re not currently in an active sprint.{' '}
                  </p>
                  <p>Begin your new sprint now. </p>
                  <button onClick={handleStartToggle}>New sprint</button>
                </div>
                <div className={isStartingNewSprint ? '' : 'no-show'}>
                  <form onSubmit={handleNewSprint}>
                    <p>
                      First things first, let&apos;s give your sprint a name..
                    </p>

                    <Input
                      placeholder="My awesome sprint..."
                      onChange={handleChange}
                      name="sprintName"
                      value={formData.sprintName}
                    />
                    {formErrors.sprintName && <p>{formErrors.sprintName}</p>}

                    <button>Done</button>
                  </form>
                </div>
              </StyledCard>
            </Container>
          </Section>
        </>
      )}
    </>
  )
}

const Section = styled.section`
  background-image: url('https://wallpapertag.com/wallpaper/full/d/2/b/194863-red-gradient-background-2880x1800-for-iphone-5s.jpg');
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
  background-position: bottom;
  min-height: calc(100% - var(--navbar-height));
  display: flex;
  justify-content: center;
  align-items: center;
  p {
    color: #434457;
  }
`

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100% - var(--navbar-height));
  text-align: center;
  h2 {
    color: #7b81ec;
  }
`
const Input = styled.input`
  outline: none;
  border: 0.5px solid rgba(247, 247, 247, 0.658);
  background: rgba(247, 247, 247, 0.45);
  color: #434457;
  padding: 7px;
  margin: 10px;
  display: inline-block;
  width: 90%;
  font-size: 16px;
  border-radius: 0.5rem;
  &::placeholder {
    color: #434457;
  }
`
