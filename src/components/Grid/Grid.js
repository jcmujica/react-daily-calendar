import React, { useState, useEffect, useContext } from 'react'
import { CalendarContext } from '../../contexts/CalendarContext';
import Column from '../Column/Column';
import { v4 as uuid } from 'uuid';

function Grid(props) {
  const { dayViewDay, setdayViewDay, viewMode } = useContext(CalendarContext);
  const { week } = props;
  const [displayWeek, setDisplayWeek] = useState(week);

  useEffect(() => {
    let dayViewWeek = [];
    if (viewMode === 'day') {
      dayViewWeek = [...week.filter((day) => day.includes(dayViewDay))[0]];
      setDisplayWeek([week[0], dayViewWeek]);
    } else {
      setDisplayWeek(week);
    }
  }, [viewMode, week])

  // console.log(week[0]);
  // console.log(week[1].includes(dayViewDay));

  console.log(displayWeek)
  return (
    <div className='calendar-grid'>
      {displayWeek
        .map((day) => {
          return (
            <Column
              day={day}
              key={uuid()}
              view={viewMode}
            />
          )
        })}
    </div>
  )
}

export default Grid
