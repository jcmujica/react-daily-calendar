import React, { useContext } from 'react';
import { DateTime } from 'luxon';
import { v4 as uuid } from 'uuid';
import { UserContext } from '../../contexts/UserContext';
import { CalendarContext } from '../../contexts/CalendarContext';
import Event from '../Event/Event';

function Column(props) {
  const { columnHeight, events, setevents, handleCreate, handleEdit } = useContext(CalendarContext);
  const { users, displayUsers, setdisplayUsers, currentUser, setcurrentUser } = useContext(UserContext);
  const { day } = props;


  const getDay = (a, b) => {
    if (a && b) {
      return (
        DateTime.fromMillis(parseInt(a)).startOf("day").ts === DateTime.fromMillis(parseInt(b)).startOf("day").ts);
    };
  };

  return (
    <div className='calendar-day'>
      {day.map((time) => {
        let control = time.includes(':') ? true : false;
        return (
          <div
            key={control ? `${time}${uuid()}` : time}
            id={time}
            className={control ? 'calendar-time__control' : 'calendar-time'}
            style={{ 'height': `${columnHeight}px` }}
            onClick={control ? null : (e) => handleCreate(e)}
          >
            {control ? <span>{time}</span> : null}
          </div>
        )
      })}
      {events.length > 0 ?
        events
          .filter((event) => getDay(event.startTime, day[0]))
          .filter((event) => (displayUsers.includes(event.owner)))
          .map((event) => (
            <Event
              day={day}
              event={event}
              key={uuid()}
            />
          ))
        : null}
    </div>
  )
}

export default Column
