import React, { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import BulmaCalendar from '../BulmaCalendar/BulmaCalendar';


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
      <BulmaCalendar />
      <div className="calendar-sidebar__control">
        <div className="field">
          <label className="label">Current User</label>
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
        </div>
        {
          users.map((user) => {
            // console.log(user.id);
            return (
              <label
                className="checkbox"
                key={`label_${user.id}`}
                style={{ color: user.settings.color }}
              >
                <input
                  type="checkbox"
                  className="chk-input"
                  id={user.id}
                  key={user.id}
                  onChange={handleCheck}
                  checked={displayUsers.includes(user.id)} />
                {user.name}
              </label>

            )
          })
        }
        <p className="help">Edit events by using right-click</p>
      </div >
    </div>

  )
}

export default Sidebar
