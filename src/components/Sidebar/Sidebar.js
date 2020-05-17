import React, { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { LayoutContext } from '../../contexts/LayoutContext';
import BulmaCalendar from '../BulmaCalendar/BulmaCalendar';


function Sidebar() {
  const { users, displayUsers, setdisplayUsers, currentUser, setcurrentUser, usersChanged, setusersChanged } = useContext(UserContext);
  const { sideBarToggled, setSideBarToggled } = useContext(LayoutContext);

  const handleCheck = (e) => {
    let userId = parseInt(e.target.id);
    if (displayUsers.includes(userId)) {
      let copyDispUsers = [...displayUsers];
      copyDispUsers.splice(copyDispUsers.indexOf(userId), 1);
      setdisplayUsers(copyDispUsers);
    } else {
      setdisplayUsers([...displayUsers, userId]);
    }
    setusersChanged(true);
  }

  const handleToggle = () => {
    setSideBarToggled(!sideBarToggled);
  };

  const handleUserChange = (e) => {
    let newUser = users.filter((user) => user.id === parseInt(e.target.value));
    setusersChanged(true);
    setcurrentUser(newUser[0].id);
    setdisplayUsers([newUser[0].id]);
  }

  return (
    <div className='calendar-sidebar'>
      <BulmaCalendar
        displayMode='inline'
      />
      <div className="calendar-sidebar__control">
        <div className="field">
          <label className="label">Switch User</label>
          <div className="select">
            <select onChange={(e) => handleUserChange(e)} value={currentUser}>
              {users.map((user) => (
                <option
                  id={user.id}
                  key={user.id}
                  value={user.id}
                >{user.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <label className="label">Display User Calendar</label>
        {
          users.map((user) => (
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

          ))
        }
        <p className="help">Edit events by using right-click</p>
      </div >
      <div className="calendar-sidebar__toggle" onClick={handleToggle}>
        {sideBarToggled ? <i className="fas fa-chevron-right"></i> : <i className="fas fa-chevron-left"></i>}
      </div>
    </div>

  )
}

export default Sidebar;
