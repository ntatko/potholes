import React, { useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0()

  return <div className='waves-effect waves-light btn' onClick={() => loginWithRedirect()}>Log in</div>
}

const LogoutButton = () => {
  const { logout } = useAuth0()

  return <div className='waves-effect waves-light btn' onClick={() => logout({
    returnTo: window.location.origin
  })}>Log out</div>
}

const ProfileHeader = () => {
  const { user, isAuthenticated } = useAuth0()

  useEffect(() => {
    const windowFetch = async (isAuthenticated, user) => {
      if (isAuthenticated && user.name && user.email && !window?.user?.business?.length) {
        const response = await fetch(`${window.serviceBindings.GEOKIT_API_URL}/user`, {
          method: "POST",
          headers: {
            "content-type": "application/json"
          },
          body: JSON.stringify({
            email: user.email,
            name: user.name
          })
        })

        const businesses = await response.json()
        window.user = businesses
      }
    }
    windowFetch(isAuthenticated, user)
  }, [user, isAuthenticated])

  return (
    <div style={{ position: 'absolute', top: '5px', right: '5px'}}>
      { isAuthenticated ? (
        <div style={{display: 'flex', alignItems: 'center'}}>
          <LogoutButton />
          <img style={{ height: '50px', width: '50px', borderRadius: '25px'}} src={user.picture} alt={user.name} />
          <p>{user.name}</p>
        </div>
      ) : (
        <LoginButton />
      )}
    </div>
  )
}

export default ProfileHeader