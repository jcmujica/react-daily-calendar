import React, { useContext } from 'react'
import Event from '../Event/Event';
import { CalendarContext } from '../Calendar/Calendar';

function Grid(props) {
  const { handleCreate } = props;
  const { columnHeight, eventList, week } = useContext(CalendarContext)

  const getGrid = () => {
    let grid = []
    for (let i = 0; i < week.control.length; i++) {
      for (let day in week) {
        let id = week[day][i]
        grid = [...grid,
        <div
          className={day === 'control' ? 'calendar-column__control' : 'calendar-column'}
          key={id}
          style={{ 'height': `${columnHeight}px` }}
          id={id}
          onClick={!eventList[id] && day !== 'control' ? () => handleCreate(id) : null}
        >
          {eventList[id] ?
            <Event
              id={id}
              eventList={eventList}
              columnHeight={columnHeight}
              week={week}
            /> :
            null}
          {day === 'control' ? <p className='calendar-control'>{week.control[i]}</p> : null}
        </div>
        ]
      }
    }
    return (
      <div className='calendar-grid'>
        {grid}
      </div>
    )
  }


  return (
    <div>
      {getGrid()}
    </div>
  )
}

export default Grid
