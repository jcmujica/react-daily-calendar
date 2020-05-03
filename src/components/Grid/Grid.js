import React, { useState, useEffect, useContext } from 'react'
import { CalendarContext } from '../../contexts/CalendarContext';
import Column from '../Column/Column';
import { v4 as uuid } from 'uuid';

function Grid(props) {
  const { dayViewDay, setdayViewDay } = useContext(CalendarContext);
  const { week } = props;

  // console.log(week);
  // console.log(dayViewDay);
  // console.log(week[0]);
  // console.log(week[1].includes(dayViewDay));
  return (
    <div className='calendar-grid'>
      {week
        .map((day) => {
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
