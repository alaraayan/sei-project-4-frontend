import React from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import Card from '../../styles/styled-components/GlassCard'
import { UserContext } from '../context/UserContext'
import DailyGratitudes from '../zenith/DailyGratitudes'
import DisplaySprintGoals from '../zenith/DisplaySprintGoals'
import SprintHabits from '../zenith/SprintHabits'
import DailyTodos from '../zenith/DailyTodos'
import WeeklyIntention from '../zenith/WeeklyIntention'
import DailyMoods from '../zenith/DailyMood'
import DailyEnergy from '../zenith/DailyEnergy'
import ZenQuote from '../zenith/ZenQuote'
import Calendar from '../zenith/Calendar'
import Weather from '../zenith/Weather'
import { isAuthenticated } from '../../lib/auth'
import Section from '../../styles/styled-components/GradientBackground'
// import gradientBackground from '../../assets/gradient-background.jpg'
import Spinner from '../common/Spinner'

import { DateTime } from 'luxon'

function calculateDaysIntoSprint(startDate) {
  const today = DateTime.now()
  const start = DateTime.fromISO(startDate) //takes the argument of a date (coming from currentSprint?.startDate)
  const diff = today.diff(start, 'days') // the difference from start in 'days'
  console.log(diff.toObject())
  return Math.floor(diff.toObject().days) + 1
}

function Dashboard() {
  const history = useHistory()
  const isLoggedIn = isAuthenticated()
  const { user, currentSprint } = React.useContext(UserContext)
  const currentDay = calculateDaysIntoSprint(currentSprint?.startDate)
  if (user && !currentSprint) {
    history.push('/sprints/new')
  }

  if (!user) {
    return <Spinner />
  }
  if (!isLoggedIn) {
    history.push('/401')
  }

  return (
    <>
      <Section>
        <Wrapper>
          <Row>
            <Header>
              <Card width="100%">
                <h2>
                  Nice to see you, {user?.name}, welcome to your daily
                  dashboard!
                </h2>
                <p>
                  You are currently on{' '}
                  <strong>{currentSprint?.sprintName}</strong> and you are on
                  day <strong>{currentDay} of 28.</strong> You got this &mdash;
                  bon courage!
                </p>
                <Weather />
              </Card>
            </Header>
          </Row>
          <Row>
            <Card width="100%">
              <WeeklyIntention />
            </Card>
            <Card width="100%">
              <ZenQuote />
            </Card>
          </Row>

          <Row>
            <Card width="auto" flex={1}>
              <DailyGratitudes />
            </Card>
            <Card width="auto" flex={2}>
              <DailyTodos />
            </Card>
          </Row>

          <Row>
            <Card>
              <DisplaySprintGoals />
            </Card>
            <Card>
              <SprintHabits />
            </Card>
          </Row>

          <Row>
            <Column>
              <Card width="auto" flex={2}>
                <DailyMoods />
              </Card>
              <Card width="auto" flex={1}>
                <DailyEnergy />
              </Card>
            </Column>
            <Card flex={2}>
              <Calendar />
            </Card>
          </Row>
        </Wrapper>
      </Section>
    </>
  )
}

export default Dashboard

// const Section = styled.section`
//   background-image: url(${gradientBackground});
//   background-repeat: no-repeat;
//   background-attachment: fixed;
//   background-position: center;
//   /* display: flex;
//   flex-direction: column;
//   flex-wrap: wrap; */
// `
const Header = styled.section`
  width: 100%;
  display: flex;
  flex-direction: row;
`
const Wrapper = styled.section`
  margin: 0 150px;
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
`

const Column = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`
