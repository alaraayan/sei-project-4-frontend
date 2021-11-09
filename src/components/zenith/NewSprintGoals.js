import React from 'react'
import styled from 'styled-components'
import FormStyle from '../../styles/styled-components/FormStyle'

import { UserContext } from '../context/UserContext'
import axios from 'axios'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'

function NewSprintGoals() {
  const { currentSprint } = React.useContext(UserContext) //getting current sprint from context
  const inputRefs = React.useRef([
    React.createRef(),
    React.createRef(),
    React.createRef()
  ]) // creating 3 refs so that we can assign the inputs to them and have access to .focus() and .blur() (methods on inputs)
  const [sprintGoals, setSprintGoals] = React.useState({
    // creating state to hold the 3 gratitudes (3 because we decided on 3). State ALWAYS needs to have 3 gratitudes in it because we are mapping over the objects in state to render a <p> tag/input
    sprintGoal1: { draft: '', final: '', id: null }, // id: null is so that we can edit. Id's are only added once they are sent to back-end
    sprintGoal2: { draft: '', final: '', id: null },
    sprintGoal3: { draft: '', final: '', id: null },
  })

  React.useEffect(() => {
    if (!currentSprint) {
      // checking if current sprint is defined yet
      return
    }
    const fillerSprintGoals = [...Array(3)].map(() => ({
      id: null,
      goalName: '',
    })) // create placeholder/filler objects (in case there are fewer than 3 gratitudes coming back from the back-end) eg.  this morning I was only grateful for chocolate and nothing else. So this will fill the other 2 with the fillerGratitudes objects (this will also mean that the remaining 2 can be filled in)

    const temporarySprintGoals = [
      // making sure that we have at least 3 objects that we can use to create the state we need with the .reduce()
      ...currentSprint.sprintGoals.sort((a, b) => a.id - b.id), // getting the gratitudes from the sprint (if any) in the back-end, spread over them and sort by id (this is to make sure they render in order - they were coming back in a jumbled order!)
      ...fillerSprintGoals // filling the array with placeholder objects (fillerGratitudes) that mirror the initial state, so that we know that we have an array of at least 'length 3'. We need 'length 3' because there are 3 gratitudes to render
    ]
    temporarySprintGoals.length = 3 // because we always want to render just 3 gratitude slots (even though temporaryGratitudes may be more than that)
    const syncedSprintGoals = temporarySprintGoals.reduce(
      // transforming the array of back-end gratitude objects/placeholders into a new object with .reduce() so that we can update state in the format that we need for the UI ({ id: ?, draft: ?, final: ? })
      (newState, sprintGoal, i) => ({
        // The callback function returns is going to be the accumulator on the next iteration or that is returned from the whole reduce (when you get to the last element in the array). The object we are returning is going to be the new state
        ...newState, // spreading over the newState (the accumulator)
        [`sprintGoals${i + 1}`]: {
          draft: '',
          final: sprintGoal.goalName,
          id: sprintGoal.id,
        }, // converting the object from the back-end OR the placeholder into the shape of object that we need for the front-end and to set in state
      }),
      {} // saying that what we return from the reduce() is going to be an object (the data type that we are going to accumulate)
    )
    setSprintGoals(syncedSprintGoals) // the result of the reduce() is being set as setGratitudes
  }, [currentSprint]) // run useEffect again once we have the currentSprint from the back-end

  const handleChange = e => {
    setSprintGoals({
      // updating the state
      ...sprintGoals,
      [e.target.name]: {
        draft: e.target.value,
        final: '',
        id: sprintGoals[e.target.name].id,
      }, // takes the name on the input and updating that property so that it's draft is the value of whats in the input. The final is a blank string so that we continue to render the input and the id is whatever it already was - either null or the id from the back-end. This is just updating the state.
    })
  }

  const handleBlur = async e => {
    // this is where we update the back-end
    const existingId = sprintGoals[e.target.name].id
    if (!e.target.value && !existingId) {
      return
    }
    const id = await updateSprintGoals(e.target.value, existingId)
    setSprintGoals({
      ...sprintGoals,
      [e.target.name]: { draft: '', final: e.target.value, id },
    })
  }

  const handleKeyDown = (event, index) => {
    // firing when any key is pressed but we only care if its the enter key
    if (event.key !== 'Enter') {
      return
    }
    if (index < 2) {
      const nextElement = inputRefs.current[index + 1].current
      if (nextElement.tagName === 'P') {
        inputRefs.current[index].current.blur()
        return
      }
      console.dir(inputRefs.current[index + 1].current)
      nextElement.focus()
    } else {
      inputRefs.current[index].current.blur()
    }
  }

  const updateSprintGoals = async (sprintGoalToUpdate, existingId) => {
    try {
      if (existingId) {
        const { data: putData } = await axios.put(
          `${process.env.REACT_APP_PROD_URL}/sprints/${currentSprint?.id}/sprint-goals/${existingId}/`,
          { goalName: sprintGoalToUpdate }
        )
        return putData.id
      }
      const { data: postData } = await axios.post(
        `${process.env.REACT_APP_PROD_URL}/sprints/${currentSprint?.id}/sprint-goals/`,
        {
          goalName: sprintGoalToUpdate,
        }
      )
      return postData.id
    } catch (err) {
      console.log(err)
    }
  }

  const handleEdit = e => {
    setSprintGoals({
      ...sprintGoals,
      [e.currentTarget.id]: {
        draft: sprintGoals[e.currentTarget.id].final,
        final: '',
        id: sprintGoals[e.currentTarget.id].id,
      },
    })
  }

  const clearSprintGoals = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_PROD_URL}/sprints/${currentSprint?.id}/sprint-goals/`
      )
      for (const sprintGoal of data) {
        try {
          await axios.delete(
            `${process.env.REACT_APP_PROD_URL}/sprints/${currentSprint?.id}/sprint-goals/${sprintGoal.id}/`
          )
        } catch (err) {
          console.log(err)
        }
      }
      setSprintGoals({
        sprintGoal1: { draft: '', final: '', id: null },
        sprintGoal2: { draft: '', final: '', id: null },
        sprintGoal3: { draft: '', final: '', id: null },
      })
      console.log('All goals deleted')
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <>
      <h3>Goals I Want To Achieve</h3>
      <p>We recommend up to 3 goals per sprint, add them below:</p>
      {sprintGoals &&
        Object.entries(sprintGoals).map(([label, sprintGoal], i) => {
          // mapping over our state. Object.entries means that we can convert the object into an array of arrays where the first element of each sub-array is the property's key (eg. gratitude1, gratitude2..) and the second element of the sub-array is the property's value (the object of the gratitude - { draft: '', final: '', id: null }) SEE LINE 127 above for const array.
          return (
            <div key={label}>
              <label style={{ display: 'inline-block', width: 20 }}>
                {i + 1}.{' '}
              </label>
              {sprintGoal.final ? ( // conditionally rendering whether a p tag or an input is displayed, depending on if there is a gratitude.final that we have set in the useEffect
                <>
                  <FormStyle.P ref={inputRefs.current[i]}>
                    {sprintGoal.final}
                  </FormStyle.P>
                  <span
                    id={label}
                    onClick={handleEdit}
                    style={{ marginLeft: 10 }}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </span>
                </>
              ) : (
                <FormStyle.Input
                  placeholder="My goal is..."
                  name={label} // we give it a name so that we can do clever things with handle change
                  ref={inputRefs.current[i]} // the ref is something in react which enables us to access DOM elements directly (kinda like document.getElementBy). We have multiple refs (createRef()) so here we are assigning each input to the array of refs. A ref has .current method on it and in this instance it is an array (because that's what we set it to initially). We are assigning the input to the array of refs at the index(0, 1 or 2)
                  value={sprintGoal.draft} // value of the input is going to be the draft on each gratitude object
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onKeyDown={e => handleKeyDown(e, i)}
                />
              )}
            </div>
          )
        })}
      <FormStyle.ButtonContainer>
        <ClearButton onClick={clearSprintGoals} className="clear-button">
          Clear All<span className="material-icons">delete_forever</span>
        </ClearButton>
      </FormStyle.ButtonContainer>
    </>
  )
}

export default NewSprintGoals

const ClearButton = styled.button`
  margin: 2px;
  padding: 5px;
  font-size: 14px;
  border-radius: 5px;
  background-color: rgb(166, 152, 228);
  color: #100f10;
  margin-left: 860px;
  :hover {
    background-color: rgb(125, 100, 236);
    color: white;
  }
`

//////////////////////////////////////////////////////////////////
// import React from 'react'
// import { UserContext } from '../context/UserContext'

// export default function SprintGoalsDisplay() {
//   const { currentSprint } = React.useContext(UserContext)
//   const [goals, setGoals] = React.useState([])
//   const isLoading = !currentSprint
//   const currentGoals = currentSprint?.sprintGoals

//   React.useEffect(() => {
//     const getCurrentGoals = () => {
//       setGoals(currentGoals)
//     }
//     getCurrentGoals()
//   }, [currentGoals])

//   return (
//     <>
//       {isLoading && (
//         <div>
//           <p>loading...</p>
//         </div>
//       )}
//       {currentSprint && (
//         <>
//           <h3>Sprint Goals</h3>
//           <ol>
//             {currentSprint?.sprintGoals.map(goal => (
//               <li key={goal.id}>
//                 <p>{goal.goalName}</p>
//                 <p>{goal.goalDescription}</p>
//               </li>
//             ))}
//           </ol>
//         </>
//       )}
//     </>
//   )
// }

// import React from 'react'

// import { UserContext } from '../context/UserContext'

// function SprintGoal() {

//   const { currentSprint } = React.useContext(UserContext)

//   const isLoading = !currentSprint

//   return (
//     <>
//       {isLoading && <div><p>loading...</p></div>}
//       {currentSprint &&
//       <>
//         <h3>Sprint Goals</h3>
//         {currentSprint?.sprintGoals.map(goal => (
//           <div key={goal.id}>
//             <p>{goal.goalName}</p>
//             <p>{goal.goalDescription}</p>

//           </div>

//         ))}
//       </>
//       }

//     </>
//   )

// }

// export default SprintGoal
