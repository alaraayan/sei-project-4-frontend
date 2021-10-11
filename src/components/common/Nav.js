import React, { useState } from 'react'
import Hamburger from 'hamburger-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faHome,
  faSearch,
  faUsers,
  faUserPlus,
  faOm,
  faSignOutAlt,
  faRocket
  // faStarHalfAlt,
  // faLocationArrow
} from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components'
import { Link, useHistory } from 'react-router-dom'
import { isAuthenticated, removeToken } from '../../lib/auth'
// import logo from '../../assets/zenithLogo.png'

function Nav() {
  const history = useHistory()
  // const location = useLocation()
  const isLoggedIn = isAuthenticated()
  const [showColor, setShowColor] = React.useState(false)
  const [sidebarShow, setSidebarShow] = useState(false)

  const handleSideBar = () => setSidebarShow(!sidebarShow)

  const handleLogout = () => {
    removeToken()
    history.push('/')
  }

  React.useEffect(() => {
    const scrollListener = () => {
      window.scrollY > 150 ? setShowColor(true) : setShowColor(false)
    }
    window.addEventListener('scroll', scrollListener)
    return () => {
      window.removeEventListener('scroll', scrollListener)
    }
  }, [])

  return (
    <>
      <div
        className={`navbar ${
          showColor ? 'navbar-show-color' : 'navbar-default-color'
        }`}
      >
        <Link to="/">
          <ZenithH1>
            <Logo />
            zenith
          </ZenithH1>
        </Link>
        {/* <LogoImg src={logo} alt='logo' />
        <ZenithH1>zenith</ZenithH1> */}

        <div className="menu-items-end" onClick={handleSideBar}>
          <Hamburger toggled={sidebarShow} toggle={setSidebarShow} />
        </div>
      </div>
      <div
        className={
          sidebarShow
            ? 'side-nav-menu-container active'
            : 'side-nav-menu-container'
        }
      >
        <div className="navbar-content-container" onClick={handleSideBar}>
          <NavLink to="/" icon={faHome} text="Home" />
          {isLoggedIn ? (
            <>
              <NavLink to="/dashboard" text="Dashboard" icon={faOm} />
              <NavLink
                to="/sprints/new"
                text="Start a new Sprint"
                icon={faRocket}
              />
              <NavLink to="/" text="Past Sprints" icon={faSearch} />
              {/* <NavLink to="/" text="Change location" icon={faLocationArrow} /> */}
              {/* <NavLink to="/" text="Dark Mode" icon={faStarHalfAlt} /> */}
              <p className="navbar-item logout-link" onClick={handleLogout}>
                <FontAwesomeIcon
                  className="fa-items-icon"
                  icon={faSignOutAlt}
                />
                Log out
              </p>
            </>
          ) : (
            <>
              <NavLink to="/register" icon={faUserPlus} text="Register" />
              <NavLink to="/login" icon={faUsers} text="Log In" />
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default Nav

const ZenithH1 = styled.h1`
  font-size: 3rem;
  background: linear-gradient(45deg, #7b81ec, #acafee);
  background-clip: text;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -moz-text-fill-color: transparent;
  -webkit-text-fill-color: transparent;
  display: inline-block;
`

function Logo() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      data-prefix="fas"
      data-icon="rocket"
      className="svg-inline--fa fa-rocket fa-w-16 fa-xs "
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      style={{ marginRight: 10 }}
    >
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop
            offset="0%"
            style={{ stopColor: '#7b81ec', stopOpacity: 1 }}
          ></stop>
          <stop
            offset="100%"
            style={{ stopColor: '#7b81ec', stopOpacity: 1 }}
          ></stop>
        </linearGradient>
      </defs>
      <path
        fill="url(#grad1)"
        d="M505.12019,19.09375c-1.18945-5.53125-6.65819-11-12.207-12.1875C460.716,0,435.507,0,410.40747,0,307.17523,0,245.26909,55.20312,199.05238,128H94.83772c-16.34763.01562-35.55658,11.875-42.88664,26.48438L2.51562,253.29688A28.4,28.4,0,0,0,0,264a24.00867,24.00867,0,0,0,24.00582,24H127.81618l-22.47457,22.46875c-11.36521,11.36133-12.99607,32.25781,0,45.25L156.24582,406.625c11.15623,11.1875,32.15619,13.15625,45.27726,0l22.47457-22.46875V488a24.00867,24.00867,0,0,0,24.00581,24,28.55934,28.55934,0,0,0,10.707-2.51562l98.72834-49.39063c14.62888-7.29687,26.50776-26.5,26.50776-42.85937V312.79688c72.59753-46.3125,128.03493-108.40626,128.03493-211.09376C512.07526,76.5,512.07526,51.29688,505.12019,19.09375ZM384.04033,168A40,40,0,1,1,424.05,128,40.02322,40.02322,0,0,1,384.04033,168Z"
      ></path>
    </svg>
  )
}

function NavLink({ to, icon, text }) {
  return (
    <p>
      <Link to={to} className="navbar-item">
        <FontAwesomeIcon className="fa-items-icon" icon={icon} />
        {text}
      </Link>
    </p>
  )
}
//   padding-left: 30px;
//   margin-left: 80px;
// `
// const LogoImg = styled.img`
//   height: 60px;
//   width: 60px;

// `
