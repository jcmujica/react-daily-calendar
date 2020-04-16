import React from 'react'
import Event from '../Event/Event';

function Grid(props) {
  const {
    week,
    columnHeight,
    eventList,
    handleCreate,
    handleEdit,
    cellRange
  } = props;

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
              onClick={(id) => handleEdit(id)}
              eventList={eventList}
              columnHeight={columnHeight}
              handleEdit={handleEdit}
              week={week}
              cellRange={cellRange}
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
