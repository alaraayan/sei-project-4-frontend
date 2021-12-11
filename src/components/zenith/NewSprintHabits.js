import React from 'react'
import styled from 'styled-components'
import FormStyle from '../../styles/styled-components/FormStyle'

import { UserContext } from '../context/UserContext'
import {
  editASprintHabit,
  newSprintHabit,
  getASprintHabit,
  deleteASprintHabit
} from '../../lib/api'

import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function NewSprintHabits() {
  const { currentSprint } = React.useContext(UserContext)
  const isLoading = !currentSprint
  const inputRefs = React.useRef([
    React.createRef(),
    React.createRef(),
    React.createRef()
  ])
  const [habits, setHabits] = React.useState({
    habit1: { draft: '', final: '', id: null },
    habit2: { draft: '', final: '', id: null },
    habit3: { draft: '', final: '', id: null },
  })

  React.useEffect(() => {
    if (!currentSprint) {
      return
    }
    const fillerHabits = [...Array(3)].map(() => ({
      id: null,
      toDoItem: '',
    }))
    const temporaryHabits = [
      ...currentSprint.sprintHabits.sort((a, b) => a.id - b.id),
      ...fillerHabits
    ]
    temporaryHabits.length = 3
    const syncedHabits = temporaryHabits.reduce(
      (newState, habit, i) => ({
        ...newState,
        [`to-dos${i + 1}`]: {
          draft: '',
          final: habit.habitName,
          id: habit.id,
        },
      }),
      {}
    )
    setHabits(syncedHabits)
  }, [currentSprint])

  const handleChange = e => {
    setHabits({
      ...habits,
      [e.target.name]: {
        draft: e.target.value,
        final: '',
        id: habits[e.target.name].id,
      },
    })
  }

  const handleBlur = async e => {
    // this is where we update the back-end
    const existingId = habits[e.target.name].id
    if (!e.target.value && !existingId) {
      return
    }
    const id = await updatedHabits(e.target.value, existingId)
    setHabits({
      ...habits,
      [e.target.name]: { draft: '', final: e.target.value, id },
    })
  }

  const handleKeyDown = (event, index) => {
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

  const updatedHabits = async (habitToUpdate, existingId) => {
    try {
      if (existingId) {
        const { data: putData } = await editASprintHabit(
          currentSprint?.id,
          existingId,
          { habitName: habitToUpdate }
        )
        return putData.id
      }
      const { data: postData } = await newSprintHabit(currentSprint?.id, {
        habitName: habitToUpdate,
      })
      return postData.id
    } catch (err) {
      console.log(err)
    }
  }

  const handleEdit = e => {
    setHabits({
      ...habits,
      [e.currentTarget.id]: {
        draft: habits[e.currentTarget.id].final,
        final: '',
        id: habits[e.currentTarget.id].id,
      },
    })
  }

  const clearSprintHabits = async () => {
    try {
      const { data } = await getASprintHabit(currentSprint?.id)
      for (const sprintHabit of data) {
        try {
          await deleteASprintHabit(currentSprint?.id, sprintHabit.id)
        } catch (err) {
          console.log(err)
        }
      }
      setHabits({
        habit1: { draft: '', final: '', id: null },
        habit2: { draft: '', final: '', id: null },
        habit3: { draft: '', final: '', id: null },
      })
      console.log('All habits are deleted')
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <>
      {isLoading && (
        <div>
          <p>ॐ..loading...ॐ</p>
        </div>
      )}
      <h3>Habits I Want To Build</h3>
      <p>We recommend up to 3 habits per sprint, add them below:</p>
      {habits &&
        Object.entries(habits).map(([label, habit], i) => {
          return (
            <div key={label}>
              <label style={{ display: 'inline-block', width: 20 }}>
                {i + 1}.{' '}
              </label>
              {habit.final ? (
                <>
                  <FormStyle.P ref={inputRefs.current[i]}>
                    {habit.final}
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
                  placeholder="My habit is..."
                  name={label}
                  ref={inputRefs.current[i]}
                  value={habit.draft}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onKeyDown={e => handleKeyDown(e, i)}
                />
              )}
            </div>
          )
        })}
      <FormStyle.ButtonContainer>
        <ClearButton onClick={clearSprintHabits} className="clear-button">
          Clear All<span className="material-icons">delete_forever</span>
        </ClearButton>
      </FormStyle.ButtonContainer>
    </>
  )
}

export default NewSprintHabits

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

// import React from 'react'

// import { newSprintHabit } from '../../lib/api'
// import { UserContext } from '../context/UserContext'
// import useForm from '../hooks/useForm'
// import Card from '../../styles/styled-components/Card'

// export default function AddHabitsToNewSprint() {
//   const { currentSprint, hasNewHabitOrGoal, setHasNewHabitOrGoal } =
//     React.useContext(UserContext)
//   // const isLoading = !currentSprint
//   const { formData, formErrors, handleChange, setFormData } = useForm({
//     habitName: '',
//   })

//   const handleNewHabit = async event => {
//     event.preventDefault()
//     try {
//       console.log(currentSprint.id)
//       console.log(formData)
//       await newSprintHabit(currentSprint.id, formData)
//       setFormData({
//         habitName: '',
//       })
//       setHasNewHabitOrGoal(!hasNewHabitOrGoal)
//     } catch (e) {
//       console.log(e)
//     }
//   }

//   return (
//     <div>
//       <Card>
//         <form onSubmit={handleNewHabit}>
//           <div>
//             <input
//               placeholder="Drink 2L water every day"
//               onChange={handleChange}
//               name="habitName"
//               value={formData.habitName}
//             />
//             {formErrors.habitName && <p>{formErrors.habitName}</p>}
//           </div>
//           <button>done!</button>
//         </form>
//       </Card>
//     </div>
//   )
// }
