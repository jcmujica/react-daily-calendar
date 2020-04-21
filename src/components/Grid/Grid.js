import React, { useState, useEffect, useContext } from 'react'
import Event from '../Event/Event';
import { DateTime } from 'luxon';
import { CalendarContext } from '../Calendar/Calendar';
import Column from '../Column/Column';
import { v4 as uuid } from 'uuid';

function Grid(props) {
  const { handleCreate } = props;
  const { columnHeight, eventList, week } = useContext(CalendarContext)
  let dayBlock = []

  // console.log(week)

  for (let day in week) {
    dayBlock = [...dayBlock, week[day]]
  }

  const handleClick = (e) => {
    console.log(e.target)
  }

  useEffect(() => {
  }, [])

  const [events, setevents] = useState([
    // {
    //   id: '1',
    //   startTime: '1586781000000',
    //   endTime: '',
    //   owner: '',
    //   participant: [{}, {}, {}],
    //   resources: [],
    //   color: 'blue',
    //   name: 'Event1',
    //   desc: '',
    //   height: columnHeight,
    //   yOffset: 30,
    //   xOffset: 0
    // },
    // {
    //   id: '2',
    //   startTime: '1586867400000',
    //   endTime: '',
    //   owner: '',
    //   participant: [{}, {}, {}],
    //   resources: [],
    //   color: 'blue',
    //   name: 'Event2',
    //   desc: '',
    //   height: columnHeight,
    //   yOffset: 0,
    //   xOffset: 0
    // },
  ])
  // const events = 
  // console.log(dayBlock)

  return (
    <div className='calendar-grid'>
      {dayBlock.map((day) => {
        return (
          <Column
            day={day}
            key={uuid()}
            onClick={(e) => handleClick(e)}
            events={events}
            setevents={setevents}
          />
        )
      })}
    </div>
  )
}

export default Grid
