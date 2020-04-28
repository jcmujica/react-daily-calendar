import React, { useContext } from 'react'
import { UserContext } from '../../contexts/UserContext'

function Sidebar() {
  const { users, displayUsers, setdisplayUsers, currentUser, setcurrentUser, usersChanged, setusersChanged } = useContext(UserContext);

  const handleCheck = (e) => {
    let userId = parseInt(e.target.id)
    if (displayUsers.includes(userId)) {
      let copyDispUsers = [...displayUsers];
      copyDispUsers.splice(copyDispUsers.indexOf(userId), 1);
      setdisplayUsers(copyDispUsers);
    } else {
      setdisplayUsers([...displayUsers, userId]);
    }
    setusersChanged(true);
  }

  const handleUserChange = (e) => {
    let newUser = users.filter((user) => user.name === e.target.value);
    setusersChanged(true);
    setcurrentUser(newUser[0].id)
    setdisplayUsers([newUser[0].id]);
  }

  return (
    <div className='calendar-sidebar'>
      <div className="select">
        <select onChange={(e) => handleUserChange(e)}>
          {users.map((user) => (
            <option
              id={user.id}
              key={user.id}
              selected={currentUser === user.id ? true : false}
            >{user.name}
            </option>
          ))}
        </select>
      </div>
      {users.map((user) => {
        // console.log(user.id);
        return (<label className="checkbox" key={`label_${user.id}`}>
          <input type="checkbox" className="chk-input" id={user.id} key={user.id} onChange={handleCheck} checked={displayUsers.includes(user.id)} />
          {user.name}
        </label>
        )
      })}
    </div >
  )
}

export default Sidebar
