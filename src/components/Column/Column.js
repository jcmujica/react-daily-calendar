import React, { useState, useContext } from 'react';
import { CalendarContext } from '../Calendar/Calendar';
import { DateTime } from 'luxon';
import Event from '../Event/Event';

function Column(props) {
  const { columnHeight, events, setevents, handleCreate, handleEdit } = useContext(CalendarContext);
  const { day } = props;

  // const createEvent = (e) => {
  //   console.log('events', events)
  //   let startTime = e.target.id;
  //   let endTime = day[day.indexOf(e.target.id) + 1]; //+2 ??
  //   let newEvent = {
  //     id: uuid(),
  //     startTime,
  //     endTime,
  //     owner: '',
  //     participant: [{}, {}, {}],
  //     resources: [],
  //     color: 'blue',
  //     name: 'Event ',
  //     desc: '',
  //     height: columnHeight,
  //     width: 90,
  //     seq: [startTime, endTime],
  //     yOffset: day.indexOf(e.target.id) * columnHeight,
  //     xOffset: 0,
  //     zIndex: 0
  //   };
  //   let updEvents = [...events, newEvent];
  //   getCollisions(updEvents)
  //   setevents(updEvents);
  //   console.log(newEvent.seq);
  // };

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
            key={time}
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
        events.filter((event) => getDay(event.startTime, day[0])).map((event) => (
          <Event
            day={day}
            event={event}
          />
        ))
        : null}
    </div>
  )
}

export default Column
