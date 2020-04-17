import React, { useContext } from 'react'
import { UserContext } from '../../contexts/UserContext'

function Sidebar() {
  const { users, displayUsers, setdisplayUsers } = useContext(UserContext)

  const handleCheck = (e) => {
    let userId = parseInt(e.target.id)
    if (displayUsers.includes(userId)) {
      let copyDispUsers = [...displayUsers];
      copyDispUsers.splice(copyDispUsers.indexOf(userId), 1);
      setdisplayUsers(copyDispUsers);
    } else {
      setdisplayUsers([...displayUsers, userId]);
    }
  }
  console.log(displayUsers)

  return (
    <div className='calendar-sidebar'>
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
