import React, { createContext, useState } from 'react';

export const UserContext = createContext();

function UserContextProvider(props) {
  const [users, setusers] = useState([
    {
      id: 1, name: 'JJ Herrera',
      settings: {
        color: 'green'
      }
    },
    {
      id: 2, name: 'Carlos Lopez',
      settings: {
        color: 'blue'
      }
    },
    {
      id: 3, name: 'Mariana Arocha',
      settings: {
        color: 'pink'
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
