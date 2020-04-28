import React, { createContext, useState } from 'react';

export const UserContext = createContext();

function UserContextProvider(props) {
  const [users, setusers] = useState([
    {
      id: 1, name: 'User 1',
      settings: {
        color: '#48BB78'
      }
    },
    {
      id: 2, name: 'User 2',
      settings: {
        color: '#4299E1'
      }
    },
    {
      id: 3, name: 'User 3',
      settings: {
        color: '#FC8181'
      }
    }
  ])

  const [displayUsers, setdisplayUsers] = useState([1]);
  const [currentUser, setcurrentUser] = useState(1);
  const [usersChanged, setusersChanged] = useState(false);
  return (
    <UserContext.Provider value={{ users, displayUsers, setdisplayUsers, currentUser, setcurrentUser, usersChanged, setusersChanged }}>
      {props.children}
    </UserContext.Provider>
  )
}

export default UserContextProvider
