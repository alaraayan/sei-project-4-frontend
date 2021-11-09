import React, { createContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { getUserWithReset, loginUser } from '../../lib/api'
import { getPayload, setToken } from '../../lib/auth'
import { toast } from 'react-toastify'

export const UserContext = createContext()

export const UserProvider = props => {
  const history = useHistory()
  const [user, setUser] = useState(null)
  const [userId, setUserId] = useState(null)
  const [shouldRefresh, setShouldRefresh] = React.useState(false)

  const currentSprint = user?.createdSprints?.find(
    sprint => Date.parse(sprint.endDate) > Date.now()
  )

  React.useEffect(() => {
    const id = userId || getPayload().sub
    if (!id) {
      return
    }
    const getData = async () => {
      try {
        const res = await getUserWithReset(id)
        console.log(res.data)
        setUser(res.data)
      } catch (err) {
        console.log(err)
      }
    }
    getData()
    setShouldRefresh(false)
  }, [userId, shouldRefresh])
  const login = async (e, formData, setIsError) => {
    e.preventDefault()
    try {
      const res = await loginUser(formData)
      setToken(res.data.token)
      const { sub } = getPayload()
      setUserId(sub)
      toast.dark('🚀 Successfully logged in!', {
        position: 'top-right',
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
      currentSprint ? history.push('/dashboard') : history.push('/sprints/new')
    } catch (e) {
      setIsError(true)
    }
  }

  const refreshUser = () => setShouldRefresh(true)

  return (
    <UserContext.Provider
      value={{
        user,
        currentSprint,
        login,
        setUser,
        refreshUser,
      }}
    >
      {props.children}
    </UserContext.Provider>
  )
}
