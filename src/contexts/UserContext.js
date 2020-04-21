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

  const [displayUsers, setdisplayUsers] = useState([1])
  return (
    <UserContext.Provider value={{ users, displayUsers, setdisplayUsers }}>
      {props.children}
    </UserContext.Provider>
  )
}

export default UserContextProvider
