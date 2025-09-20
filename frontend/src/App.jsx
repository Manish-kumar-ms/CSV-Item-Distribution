import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Signup from './Components/Signup'
import Login from './Components/Login'
import Home from './Components/Home'
import AgentDetails from './Components/Agentdetails'
import { useContext } from 'react'
import { UserDataContext } from './context/UserContext'

const App = () => {
    const  {userData, setUserData,loading} = useContext(UserDataContext);
     if (loading) {
    return <div>Loading...</div>; // Or a spinner
  }

  return (
    <Routes>
      <Route path="/" element={ userData ? <Navigate to="/home" /> : <Navigate to="/login" />} />
      <Route path="/home" element={userData ? <Home /> : <Navigate to="/login" />} />
      <Route path="/signup" element={userData ? <Navigate to="/home" /> : <Signup />} />
      <Route path="/login" element={userData ? <Navigate to="/home" /> : <Login />} />
      <Route path="/agent/:id" element={userData?<AgentDetails />:<Navigate to="/login" />} />
    </Routes>
  )
}

export default App