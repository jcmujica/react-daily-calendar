import React, { useState, useEffect, useContext } from 'react'
import { CalendarContext } from '../../contexts/CalendarContext';
import Column from '../Column/Column';
import { v4 as uuid } from 'uuid';

function Grid(props) {
  const { dayViewDay, viewMode } = useContext(CalendarContext);
  const { week } = props;
  const [displayWeek, setDisplayWeek] = useState(week);

  useEffect(() => {
    let dayViewWeek = [];
    if (viewMode === 'day') {
      dayViewWeek = week.filter((day) => day.includes(dayViewDay))[0];
      if (dayViewWeek) {
        setDisplayWeek([week[0], dayViewWeek]);
      }
    } else {
      setDisplayWeek(week);
    }
  }, [viewMode, week, dayViewDay])

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
