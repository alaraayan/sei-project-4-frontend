import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { isAuthenticated } from '../../lib/auth'

// import gradientBackground from '../../assets/gradient-background.jpg'
import styled from 'styled-components'
import StyledCard from '../../styles/styled-components/Card'
import { HomeButton } from '../../styles/styled-components/Button'
import gradientBackground from '../../assets/gradient-background.jpg'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPrayingHands,
  faCheckCircle,
  faSpinner,
  faCompass,
  faSmileBeam,
  faRedoAlt
} from '@fortawesome/free-solid-svg-icons'
import GlassCard from '../../styles/styled-components/GlassCard'

function Home() {
  const isLoggedIn = isAuthenticated()
  useLocation()
  return (
    <Main>
      {/* <Wrapper> */}
      <Title>Hello World, I&apos;m zenith!</Title>

      <ButtonContainer>
        {!isLoggedIn ? (
          <>
            <Link to="/login">
              <HomeButton className="home-button">Login</HomeButton>
            </Link>
            <Link to="/register">
              <HomeButton className="home-button">Register</HomeButton>
            </Link>
          </>
        ) : (
          <Link to="/dashboard">
            <HomeButton className="home-button" width="195px">
              Dashboard
            </HomeButton>
          </Link>
        )}
      </ButtonContainer>
      <div style={{ width: '100%', margin: '0 auto' }}>
        <StyledCard
          isFlex
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          padding="1rem 4rem"
          margin="2rem"
          background="rgba(247, 247, 247, 0.658)"
          color="black"
        >
          <p>
            The ulitmate daily tool to get more done, develop yourself and
            achieve your dreams.
          </p>
          <p>
            With zenith you can apply agile methodologies to your personal life.
            Set yourself a 4-week sprint to work towards your goals and build on
            your daily habits. Track your progress with daily, weekly and
            monthly tasks such as:
          </p>
        </StyledCard>
      </div>

      <CardContainer>
        <HomeGlassCard
          icon={faCompass}
          text="Weekly intentions for grounding and balance"
        />
        <HomeGlassCard
          icon={faSpinner}
          text="Goals to work on during your 4-week sprint"
        />
        <HomeGlassCard
          icon={faRedoAlt}
          text="Daily habits to build into your practice"
        />
        <HomeGlassCard icon={faCheckCircle} text="Daily to-do lists" />
        <HomeGlassCard icon={faPrayingHands} text="Daily gratitude lists" />
        <HomeGlassCard
          icon={faSmileBeam}
          text="Daily moods and energy levels"
        />
      </CardContainer>

      <div style={{ width: '100%', margin: '0 auto' }}>
        <StyledCard
          isFlex
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          padding="1rem"
          margin="2rem"
          background="rgba(247, 247, 247, 0.658)"
          color="black"
          // boxShadow='rgba(136, 165, 191, 0.48) 6px 2px 16px 0px, rgba(255, 255, 255, 0.8) -6px -2px 16px 0px'
        >
          <section>
            <h3>
              <em>Zenith</em>
            </h3>
            <p>
              1. The zenith of something is the time when it is most successful
              or powerful. <br />
              <br />
              <em>Her career is now at its zenith.</em>
            </p>
            <p>
              2. The zenith is the point at which the sun or moon is directly
              above you and seems to be at its highest. <br />
              <br />
              <em>The sun rises, reaches its zenith and sets</em>
            </p>
            <p>
              <em>Synonyms: height, summit, peak, top</em>
            </p>
          </section>
        </StyledCard>
      </div>
    </Main>
  )
}

export default Home

const Main = styled.section`
  background-image: url(${gradientBackground});
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: top;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  padding: 3em 10em;
`

const Title = styled.h1`
  font-size: 3.5em;
  text-align: center;
  color: ${props => (props.darkMode ? '#F7F7F7' : '#F7F7F7')};
  font-family: 'Space Grotesk', sans-serif;
  margin-bottom: 0.7rem;
`

// const Wrapper = styled.section`
//   padding: 10em;
//   /* height: 100%; */
// //   background: #F7F7F7;
// `

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 10px auto;
`

const CardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-items: stretch;
  width: 90%;
  margin: 0 auto;
`
const HomeGlassCard = ({ icon, text }) => (
  <GlassCard
    isFlex
    alignItems="center"
    flexDirection="column"
    width="auto"
    background="rgba(247, 247, 247, 0.658)"
  >
    <FontAwesomeIcon icon={icon} size="3x" />
    <TextOnCard>{text}</TextOnCard>
  </GlassCard>
)

const TextOnCard = styled.p`
  margin-top: 25px;
  text-align: center;
`
