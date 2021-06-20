import React from 'react'
import { UserContext } from '../context/UserContext'
import axios from 'axios'

import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'

function WeeklyIntention() {
  const { currentSprint } = React.useContext(UserContext)
  const inputRef = React.useRef()
  const isLoading = !currentSprint
  const [ intention, setIntention ] = React.useState({
    draft: '', final: '', id: null,
  })

  console.log(currentSprint)

  React.useEffect(() => {
    if (!currentSprint) {
      return
    }
    setIntention({ 
      draft: '', 
      final: currentSprint.weeklyIntentions[0].weeklyIntention, 
      id: currentSprint.weeklyIntentions[0].id })
  }, [currentSprint])

  const handleChange = (e) => {
    setIntention({
      ...intention,
      draft: e.target.value, 
    }
    )
  }

  const handleBlur = async (e) => {
    const existingId = intention.id
    if (!e.target.value && !existingId) {
      return
    }
    const id = await updateIntention(e.target.value, existingId)
    setIntention({ ...intention, final: e.target.value, id })

  }

  const handleKeyDown = (e) => {
    if (e.key !== 'Enter') {
      return
    } 
    inputRef.current.blur()
  }

  const updateIntention = async (intentionText, existingId) => {
    try {
      if (existingId) {
        const { data: putData } = await axios.put(
          `/api/sprints/${currentSprint?.id}/intentions/${existingId}/`,
          { weeklyIntention: intentionText }
        )
        return putData.id
      }
      const { data: postData } = await axios.post(
        `/api/sprints/${currentSprint?.id}/intentions/`,
        { weeklyIntention: intentionText, 
        }
      )
      return postData.id 
    } catch (err) {
      console.log(err)
    }
  }
  

  const handleEdit = () => {
    setIntention({
      draft: intention.final,
      final: '',
      id: intention.id,
    })
  }

  return (
    <>
      {isLoading && <div><p>ॐ..loading...ॐ</p></div>}
      <h3>Intention for this week:</h3>
      {intention.final ? (
        <>
          <Styled.P>{intention.final}</Styled.P>
          <FontAwesomeIcon icon={faEdit} onClick={handleEdit} style= {{ marginLeft: 10 }}/>
        </>
      ) : (
        <Styled.Input 
          placeholder="I am / I will..."
          value={intention.draft}
          ref={inputRef}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown} />
      )}
      
    </>
  )
}

export default WeeklyIntention

const Styled = {
  P: styled.p`
    display: inline-block;
  `,
  Input: styled.input`
    outline: none;
    border: none;
    background: rgba(247, 247, 247, 0.2);
    color: #262526;
    padding: 7px;
    margin: 1px;
    &::placeholder {
      color: #100f10;
    }
  `,
}
