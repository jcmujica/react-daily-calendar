import React, { useState, useEffect, useContext } from 'react'
import { CalendarContext } from '../Calendar/Calendar';
import Column from '../Column/Column';
import { v4 as uuid } from 'uuid';

function Grid() {
  const { week, handleEdit } = useContext(CalendarContext);
  const [days, setdays] = useState([]);
  let dayBlock = [];

  useEffect(() => {
    for (let day in week) {
      dayBlock = [...dayBlock, week[day]]
    };
    setdays(dayBlock)
  }, [week]);

  return (
    <div className='calendar-grid'>
      {days.map((day) => {
        return (
          <Column
            day={day}
            key={uuid()}
          />
        )
      })}
    </div>
  )
}

export default Grid
