import React, { useEffect, useContext } from 'react'
import Event from '../Event/Event';
import { CalendarContext } from '../Calendar/Calendar';

function Grid(props) {
  const { handleCreate } = props;
  const { columnHeight, eventList, week } = useContext(CalendarContext)
  let dayBlock = []

  console.log(week)

  for (let day in week) {
    dayBlock = [...dayBlock, week[day]]
  }
  useEffect(() => {
  }, [])

  // const getGrid = () => {
  //   let grid = [];
  //   let dayGrid = [];
  //   // for (let i = 0; i < week.control.length; i++) {
  //   let dayBlock = []
  //   for (let day in week) {
  //     dayBlock = [...dayBlock, week[day]]
  //   }
  //   console.log('arr', arr)
  //   {}
  //   // console.log(week[day])
  //   // {
  //   //   week[day].map((time) => (
  //   //     <div>
  //   //       {week[day][time]}
  //   //     </div>
  //   //   ))
  //   // }
  //   // for (let time in week[day]) {
  //   // let id = week[day][time]
  //   // console.log(id)
  //   // }
  //   // grid = [...grid,
  //   // <div
  //   //   className={day === 'control' ? 'calendar-column__control' : 'calendar-column'}
  //   //   key={id}
  //   //   style={{ 'height': `${columnHeight}px` }}
  //   //   id={id}
  //   //   onClick={!eventList[id] && day !== 'control' ? () => handleCreate(id) : null}
  //   // >
  //   //   {eventList[id] ?
  //   //     <Event
  //   //       id={id}
  //   //       eventList={eventList}
  //   //       columnHeight={columnHeight}
  //   //       week={week}
  //   //     /> :
  //   //     null}
  //   //   {day === 'control' ? <p className='calendar-control'>{week.control}</p> : null}
  //   // </div>
  //   // ]
  //   // }
  //   // }
  //   dayGrid = [...dayGrid, <div className="calendar-day">{grid}</div>]
  //   // }
  //   return (
  //     <div className='calendar-grid'>
  //       {dayBlock.map(()=> (
  //         <div>

  //       ))}
  //     </div>
  //   )
  // }


  return (
    <div className='calendar-grid'>
      {dayBlock.map((day) => (
        <div className='calendar-day'>
          {day.map((time) => (
            <div className='calendar-time'>
              {time.includes(':') ? time : null}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default Grid
