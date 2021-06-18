import React, { createContext, useState } from 'react'
import { getUser } from '../../lib/api'
import { getPayload } from '../../lib/auth'

// USER CONTEXT

//? 1. Create context
export const UserContext = createContext()

//? 2. Create provider
export const UserProvider = (props) => {

  // Put any kind of state or information you want inside your provider. 
  // This will be available to all children components via useContext.

  const { sub: userId } = getPayload() // getting the userID(sub) from the payload
  const [user, setUser] = useState(null)
  const currentSprint = user?.createdSprints.find(sprint => Date.parse(sprint.endDate) > Date.now() )

  React.useEffect(() => {
    const getData = async () => {
      try {
        const res = await getUser(userId)
        setUser(res.data)
      } catch (err) {
        console.log(err)
      }
    }
    getData()
  }, [userId])

  //? 3. Give provider value
  return (
  // This UserContext is the same UserContext created on line 6 when you called createContext()
  // createContext() returns a .Provider where you can give your context some value.
    <UserContext.Provider value={{ user, currentSprint }}>
      {/* props.children is a placeholder for all the component you are going to wrap your provider around. */}
      {props.children}
    </UserContext.Provider>
  )
}

// ? 4. Now go to your App.js (or whichever component contains all the other 
// ? components that you want to have access to your context) and wrap those components in our provider.
// ? 5. Now you can useContext() in any of the children to access the values you pass in the provider.
