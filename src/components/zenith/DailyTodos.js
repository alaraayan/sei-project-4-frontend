import React from 'react'
import { useLocation } from 'react-router-dom'

import FormStyle from '../../styles/styled-components/FormStyle'
import { UserContext } from '../context/UserContext'
import {
  editADailyToDo,
  newDailyToDo,
  getADailyToDo,
  deleteADailyToDo,
  getSingleSprint
} from '../../lib/api'

import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'

function DailyToDoList() {
  const location = useLocation()
  const { currentSprint } = React.useContext(UserContext)
  // const [ongoingSprint, setOngoingSprint] = React.useState([])
  const isLoading = !currentSprint
  const inputRefs = React.useRef([
    React.createRef(),
    React.createRef(),
    React.createRef(),
    React.createRef(),
    React.createRef()
  ])

  const [toDos, setToDos] = React.useState({
    toDo1: { draft: '', final: '', id: null },
    toDo2: { draft: '', final: '', id: null },
    toDo3: { draft: '', final: '', id: null },
    toDo4: { draft: '', final: '', id: null },
    toDo5: { draft: '', final: '', id: null },
  })

  React.useEffect(() => {
    if (!currentSprint) {
      return
    }
    const getData = async () => {
      const res = await getSingleSprint(currentSprint?.id)

      const fillerToDos = [...Array(5)].map(() => ({
        id: null,
        toDoItem: '',
      }))
      const temporaryToDos = [
        ...res.data.toDos.sort((a, b) => a.id - b.id),
        ...fillerToDos
      ]
      temporaryToDos.length = 5
      const syncedToDos = temporaryToDos.reduce(
        (newState, toDo, i) => ({
          ...newState,
          [`to-dos${i + 1}`]: {
            draft: '',
            final: toDo.toDoItem,
            id: toDo.id,
          },
        }),
        {}
      )
      setToDos(syncedToDos)
    }
    getData()
  }, [location])

  const handleChange = e => {
    setToDos({
      ...toDos,
      [e.target.name]: {
        draft: e.target.value,
        final: '',
        id: toDos[e.target.name].id,
      },
    })
  }

  const handleBlur = async e => {
    // this is where we update the back-end
    const existingId = toDos[e.target.name].id
    if (!e.target.value && !existingId) {
      return
    }
    const id = await updatedToDos(e.target.value, existingId)
    setToDos({
      ...toDos,
      [e.target.name]: { draft: '', final: e.target.value, id },
    })
  }

  const handleKeyDown = (event, index) => {
    if (event.key !== 'Enter') {
      return
    }
    if (index < 4) {
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

  const updatedToDos = async (toDoTextToUpdate, existingId) => {
    try {
      if (existingId) {
        const { data: putData } = await editADailyToDo(
          currentSprint?.id,
          existingId,
          { toDoItem: toDoTextToUpdate }
        )
        return putData.id
      }
      const { data: postData } = await newDailyToDo(currentSprint?.id, {
        toDoItem: toDoTextToUpdate,
      })
      return postData.id
    } catch (err) {
      console.log(err)
    }
  }

  const handleEdit = e => {
    setToDos({
      ...toDos,
      [e.currentTarget.id]: {
        draft: toDos[e.currentTarget.id].final,
        final: '',
        id: toDos[e.currentTarget.id].id,
      },
    })
  }

  const clearToDos = async () => {
    try {
      const { data } = await getADailyToDo(currentSprint?.id)
      for (const toDo of data) {
        try {
          await deleteADailyToDo(currentSprint?.id, toDo.id)
        } catch (err) {
          console.log(err)
        }
      }
      setToDos({
        toDo1: { draft: '', final: '', id: null },
        toDo2: { draft: '', final: '', id: null },
        toDo3: { draft: '', final: '', id: null },
        toDo4: { draft: '', final: '', id: null },
        toDo5: { draft: '', final: '', id: null },
      })
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
      <h3>My To-Do List For Today</h3>

      {toDos &&
        Object.entries(toDos).map(([label, toDo], i) => {
          return (
            <div key={label}>
              <label
                style={{ display: 'inline-block', width: 20, marginLeft: 20 }}
              >
                {i + 1}.{' '}
              </label>
              {toDo.final ? (
                <>
                  <Styled.P ref={inputRefs.current[i]}>{toDo.final}</Styled.P>
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
                  name={label}
                  ref={inputRefs.current[i]}
                  value={toDo.draft}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onKeyDown={e => handleKeyDown(e, i)}
                />
              )}
            </div>
          )
        })}
      <FormStyle.ButtonContainer>
        <ClearButton onClick={clearToDos}>Clear</ClearButton>
      </FormStyle.ButtonContainer>
    </>
  )
}

export default DailyToDoList

const Styled = {
  P: styled.p`
    display: inline-block;
    margin: 2px 5px;
  `,
  Input: styled.input`
    outline: none;
    border: none;
    background: rgba(247, 247, 247, 0.2);
    color: #262526;
    padding: 7px;
    margin: 2px 0 0 5px;
    height: 30px;
    width: 90%;
    &::placeholder {
      color: #100f10;
    }
  `,
  ButtonContainer: styled.div`
    margin: 0 auto;
    padding-top: 10px;
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
