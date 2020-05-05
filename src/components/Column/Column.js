import React, { useContext, useRef, useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import { v4 as uuid } from 'uuid';
import { UserContext } from '../../contexts/UserContext';
import { CalendarContext } from '../../contexts/CalendarContext';
import Event from '../Event/Event';

function Column(props) {
  const scrollPosition = useRef();
  const { columnHeight, events, setevents, handleCreate, centerStartTime, centerEndTime, handleEdit, timeRange } = useContext(CalendarContext);
  const { users, displayUsers, setdisplayUsers, currentUser, setcurrentUser } = useContext(UserContext);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(0);
  const { day } = props;


  const getDay = (a, b) => {
    if (a && b) {
      return (
        DateTime.fromMillis(parseInt(a)).startOf("day").ts === DateTime.fromMillis(parseInt(b)).startOf("day").ts);
    };
  };

  useEffect(() => {
    scrollPosition.current.scrollIntoView();
    setStartIndex(centerStartTime * (60 / timeRange));
    setEndIndex(centerEndTime * (60 / timeRange))
  }, [scrollPosition])

  return (
    <div className='calendar-day'>
      {day.map((time, i) => {
        let control = time.includes(':') ? true : false;
        return (
          <div
            key={control ? `${time}${uuid()}` : time}
            id={time}
            className={`${control ? 'calendar-time__control' : 'calendar-time'} ${i < startIndex || i >= endIndex ? 'calendar-ooRange' : null}`}
            // className={i < 9 ? 'calendar-ooRange' : null}
            style={{ 'height': `${columnHeight}px` }}
            onClick={control ? null : (e) => handleCreate(e)}
            ref={i === (centerStartTime * (60 / timeRange)) ? scrollPosition : null}
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
