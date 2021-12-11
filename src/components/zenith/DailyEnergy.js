import React from 'react'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

import { UserContext } from '../context/UserContext'
import { addEnergyLevel } from '../../lib/api'

function DailyEnergy() {
  const { currentSprint } = React.useContext(UserContext)
  const [num, setNum] = React.useState(null)

  const marks = {
    1: {
      style: {
        color: 'white',
        fontSize: '16px',
      },
      label: '😴',
    },
    2: {
      style: {
        color: 'white',
        fontSize: '16px',
      },
      label: '😩',
    },
    3: {
      style: {
        color: 'white',
        fontSize: '16px',
      },
      label: '😐',
    },
    4: {
      style: {
        color: 'white',
        fontSize: '16px',
      },
      label: '🙂',
    },
    5: {
      style: {
        color: 'white',
        fontSize: '16px',
      },
      label: '🥳',
    },
  }

  const handleAfterChange = async value => {
    try {
      const energyLevel = value
      setNum(energyLevel)
      const sprintId = currentSprint?.id
      await addEnergyLevel(sprintId, energyLevel)
    } catch (err) {
      console.log(err)
    }
  }
  console.log(num)
  return (
    <>
      <h3>My energy level:</h3>
      <Slider
        min={1}
        max={5}
        step={1}
        marks={marks}
        dots={true}
        // value={}
        onAfterChange={handleAfterChange}
        // defaultValue={1}
        // startPoint
        // ariaLabelledByForHandle={''}
        // renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
        handleStyle={{
          backgroundColor: 'white',
          border: 0,
        }}
        trackStyle={{
          // background: '#f06455',
          backgroundImage: 'linear-gradient(to right, purple, pink)',
        }}
        railStyle={{
          height: 2,
          background: 'white',
        }}
        dotStyle={{
          background: 'white',
        }}
        activeDotStyle={{
          background: 'white',
        }}
      />
    </>
  )
}

export default DailyEnergy
