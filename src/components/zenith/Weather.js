import React from 'react'
import axios from 'axios'

import { UserContext } from '../context/UserContext'
import styled from 'styled-components'

function Weather() {
  const { user } = React.useContext(UserContext)

  const baseUrl =
    'https://api.weatherapi.com/v1/current.json?key=490b3fab853a4ecebb8191747210811'

  const [weatherData, setWeatherData] = React.useState(null)
  const isLoading = !weatherData

  React.useEffect(() => {
    if (!user) {
      return
    }
    const getData = async () => {
      try {
        const res = await axios.get(baseUrl + `&q=${user.city}`)
        setWeatherData(res.data)
      } catch (err) {
        console.log(err)
      }
    }
    getData()
  }, [user])

  return (
    <>
      {isLoading ? (
        <p>ॐ..loading...ॐ</p>
      ) : (
        <>
          {weatherData !== null ? (
            <>
              <Container>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <h3>
                    <i className="fa fa-street-view"></i>{' '}
                    {weatherData.location.name} | {weatherData.location.country}
                  </h3>
                  <img
                    src={weatherData.current.condition.icon}
                    alt="current weather icon"
                    style={{ flex: '0 0 50px', height: 50 }}
                  />
                  <p>{weatherData.current.temp_c}&deg;C</p>
                </div>
              </Container>
            </>
          ) : null}
        </>
      )}
    </>
  )
}

export default Weather

const Container = styled.div`
  display: flex;
  justify-content: flex-end;
`
