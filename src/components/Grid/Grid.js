import React, { useState, useEffect, useContext } from 'react'
import { CalendarContext } from '../Calendar/Calendar';
import Column from '../Column/Column';
import { v4 as uuid } from 'uuid';
import Modal from '../Modal/Modal';

function Grid(props) {
  const { week } = useContext(CalendarContext);
  let dayBlock = [];

  for (let day in week) {
    dayBlock = [...dayBlock, week[day]]
  };

  useEffect(() => {
  }, []);
  const [events, setevents] = useState([]);

  return (
    <div className='calendar-grid'>
      {/* <Modal /> */}
      {dayBlock.map((day) => {
        return (
          <Column
            day={day}
            key={uuid()}
            events={events}
            setevents={setevents}
          />
        )
      })}
    </div>
  )
}

export default Grid
