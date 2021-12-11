import React from 'react'
import { useLocation } from 'react-router-dom'

import { UserContext } from '../context/UserContext'
import {
  editADailyGratitude,
  newDailyGratitude,
  getADailyGratitude,
  deleteADailyGratitude,
  getSingleSprint
} from '../../lib/api'

import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import FormStyle from '../../styles/styled-components/FormStyle'

function DailyGratitudes() {
  const location = useLocation()
  const { currentSprint } = React.useContext(UserContext) //getting current sprint from context
  const isLoading = !currentSprint
  const inputRefs = React.useRef([
    React.createRef(),
    React.createRef(),
    React.createRef()
  ]) // creating 3 refs so that we can assign the inputs to them and have access to .focus() and .blur() (methods on inputs)
  const [gratitudes, setGratitudes] = React.useState({
    // creating state to hold the 3 gratitudes (3 because we decided on 3). State ALWAYS needs to have 3 gratitudes in it because we are mapping over the objects in state to render a <p> tag/input
    gratitude1: { draft: '', final: '', id: null }, // id: null is so that we can edit. Id's are only added once they are sent to back-end
    gratitude2: { draft: '', final: '', id: null },
    gratitude3: { draft: '', final: '', id: null },
  })

  React.useEffect(() => {
    if (!currentSprint) {
      // checking if current sprint is defined yet
      return
    }
    const getData = async () => {
      const res = await getSingleSprint(currentSprint?.id)

      const fillerGratitudes = [...Array(3)].map(() => ({
        id: null,
        dailyGratitude: '',
      })) // create placeholder/filler objects (in case there are fewer than 3 gratitudes coming back from the back-end) eg.  this morning I was only grateful for chocolate and nothing else. So this will fill the other 2 with the fillerGratitudes objects (this will also mean that the remaining 2 can be filled in)

      const temporaryGratitudes = [
        // making sure that we have at least 3 objects that we can use to create the state we need with the .reduce()
        ...res.data.dailyGratitudes.sort((a, b) => a.id - b.id), // getting the gratitudes from the sprint (if any) in the back-end, spread over them and sort by id (this is to make sure they render in order - they were coming back in a jumbled order!)
        ...fillerGratitudes // filling the array with placeholder objects (fillerGratitudes) that mirror the initial state, so that we know that we have an array of at least 'length 3'. We need 'length 3' because there are 3 gratitudes to render
      ]
      temporaryGratitudes.length = 3 // because we always want to render just 3 gratitude slots (even though temporaryGratitudes may be more than that)
      const syncedGratitudes = temporaryGratitudes.reduce(
        // transforming the array of back-end gratitude objects/placeholders into a new object with .reduce() so that we can update state in the format that we need for the UI ({ id: ?, draft: ?, final: ? })
        (newState, gratitude, i) => ({
          // The callback function returns is going to be the accumulator on the next iteration or that is returned from the whole reduce (when you get to the last element in the array). The object we are returning is going to be the new state
          ...newState, // spreading over the newState (the accumulator)
          [`gratitude${i + 1}`]: {
            draft: '',
            final: gratitude.dailyGratitude,
            id: gratitude.id,
          }, // converting the object from the back-end OR the placeholder into the shape of object that we need for the front-end and to set in state
        }),
        {} // saying that what we return from the reduce() is going to be an object (the data type that we are going to accumulate)
      )
      setGratitudes(syncedGratitudes) // the result of the reduce() is being set as setGratitudes
    }
    getData()
  }, [location]) // run useEffect again once we have the currentSprint from the back-end

  const handleChange = e => {
    setGratitudes({
      // updating the state
      ...gratitudes,
      [e.target.name]: {
        draft: e.target.value,
        final: '',
        id: gratitudes[e.target.name].id,
      },
      // takes the name on the input and updating that property so that it's draft is the value of whats in the input. The final is a blank string so that we continue to render the input and the id is whatever it already was - either null or the id from the back-end. This is just updating the state.
    })
  }

  const handleBlur = async e => {
    // this is where we update the back-end
    const existingId = gratitudes[e.target.name].id
    if (!e.target.value && !existingId) {
      return
    }
    const id = await updateGratitudes(e.target.value, existingId)
    setGratitudes({
      ...gratitudes,
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
      nextElement.focus() // accessing the ref's, move to the next one if we are in the 1st or the 2nd input. Focusing elsewhere automatically calls the .blur() method
    } else {
      inputRefs.current[index].current.blur() // if we are on the 3rd input then pressing enter will .blur() (we have completed our 3 gratitudes)
    }
  }

  const updateGratitudes = async (gratitudeText, existingId) => {
    try {
      if (existingId) {
        const { data: putData } = await editADailyGratitude(
          currentSprint?.id,
          existingId,
          { dailyGratitude: gratitudeText }
        )
        return putData.id
      }
      const { data: postData } = await newDailyGratitude(currentSprint?.id, {
        dailyGratitude: gratitudeText,
      })
      return postData.id
    } catch (err) {
      console.log(err)
    }
  }

  const handleEdit = e => {
    setGratitudes({
      ...gratitudes,
      [e.currentTarget.id]: {
        draft: gratitudes[e.currentTarget.id].final,
        final: '',
        id: gratitudes[e.currentTarget.id].id,
      },
    })
  }

  const clearGratitudes = async () => {
    try {
      const { data } = await getADailyGratitude(currentSprint?.id)
      for (const gratitude of data) {
        try {
          await deleteADailyGratitude(currentSprint?.id, gratitude.id)
        } catch (err) {
          console.log(err)
        }
      }
      setGratitudes({
        gratitude1: { draft: '', final: '', id: null },
        gratitude2: { draft: '', final: '', id: null },
        gratitude3: { draft: '', final: '', id: null },
      })
    } catch (err) {
      console.log(err)
    }
  }

  // this is what Object.entries(gratitudes) will look like:
  //  const array = [
  //    ['gratitude1', { draft: '', final: '', id: null }],
  //    ['gratitude2', { draft: '', final: '', id: null }],
  //    ['gratitude3', { draft: '', final: '', id: null }],
  //   ]

  return (
    <>
      {isLoading && (
        <div>
          <p>ॐ..loading...ॐ</p>
        </div>
      )}
      <h3>Daily Gratitude</h3>
      <p>Today I am grateful for...</p>
      {gratitudes &&
        Object.entries(gratitudes).map(([label, gratitude], i) => {
          // mapping over our state. Object.entries means that we can convert the object into an array of arrays where the first element of each sub-array is the property's key (eg. gratitude1, gratitude2..) and the second element of the sub-array is the property's value (the object of the gratitude - { draft: '', final: '', id: null }) SEE LINE 127 above for const array.
          return (
            <div key={label}>
              <label
                style={{ display: 'inline-block', width: 20, marginLeft: 20 }}
              >
                {i + 1}.{' '}
              </label>
              {gratitude.final ? ( // conditionally rendering whether a p tag or an input is displayed, depending on if there is a gratitude.final that we have set in the useEffect
                <>
                  <FormStyle.P ref={inputRefs.current[i]}>
                    {gratitude.final}
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
                <Styled.Input
                  placeholder=""
                  name={label} // we give it a name so that we can do clever things with handle change
                  ref={inputRefs.current[i]} // the ref is something in react which enables us to access DOM elements directly (kinda like document.getElementBy). We have multiple refs (createRef()) so here we are assigning each input to the array of refs. A ref has .current method on it and in this instance it is an array (because that's what we set it to initially). We are assigning the input to the array of refs at the index(0, 1 or 2)
                  value={gratitude.draft} // value of the input is going to be the draft on each gratitude object
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onKeyDown={e => handleKeyDown(e, i)}
                />
              )}
            </div>
          )
        })}
      <FormStyle.ButtonContainer>
        <ClearButton onClick={clearGratitudes}>Clear</ClearButton>
      </FormStyle.ButtonContainer>
    </>
  )
}

export default DailyGratitudes

const Styled = {
  P: styled.p`
    display: inline-block;
    margin-left: 5px;
  `,
  Input: styled.input`
    outline: none;
    border: none;
    background: rgba(247, 247, 247, 0.2);
    color: #262526;
    padding: 7px;
    margin: 2px 0 0 5px;
    margin-left: 5px;
    height: 30px;
    width: 80%;
    &::placeholder {
      color: #100f10;
    }
  `,
  ButtonContainer: styled.div`
    margin: 0 auto;
    padding: 10px;
  `,
}

const ClearButton = styled.button`
  margin: 0 auto;
  padding: 5px;
  font-size: 14px;
  border-radius: 5px;
  background-color: #ffffff73;
  color: #100f10;
`

// ? DEBUG TOOLS
// const logGratitudes = () => {
//   axios
//     .get(`api/sprints/${currentSprint?.id}/gratitudes/`)
//     .then(({ data }) => console.log(data))
//     .catch((err) => console.error(err))
// }
// const clearGratitudes = async () => {
//   try {
//     const { data } = await axios.get(`/api/sprints/${currentSprint?.id}/gratitudes/`)
//     for (const gratitude of data) {
//       try {
//         await axios.delete(`/api/sprints/${currentSprint?.id}/gratitudes/${gratitude.id}/`)
//       } catch (err) {
//         console.log(err)
//       }
//     }
//     setGratitudes({
//       gratitude1: { draft: '', final: '', id: null },
//       gratitude2: { draft: '', final: '', id: null },
//       gratitude3: { draft: '', final: '', id: null },
//     })
//     console.log('Gratitudes deleted')
//   } catch (err) {
//     console.log(err)
//   }
// }

// ? BUTTONS FOR THE DEBUGGING
// <button onClick={logGratitudes}>Log Gratitudes</button>
// <button onClick={clearGratitudes}>Clear Gratitudes</button>
