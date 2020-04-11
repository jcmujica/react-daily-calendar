import React, { useState } from 'react'
import { Resizable, ResizableBox } from 'react-resizable';

function CalendarwCols() {
  const [week, setweek] = useState({
    mon: ['m1: 1586174400000', 'm2: 1586175300000', 'm3: 1586176200000'],
    tue: ['t1: 1586260800000', 't2: 1586261700000', 't3: 1586262600000'],
    wed: ['w1: 1586347200000', 'w2: 1586348100000', 'w3: 1586349000000'],
  })
  const [columns, setcolumns] = useState({
    control: ['8:00', '8:15', '8:30'],
  })
  const [columnHeight, setcolumnHeight] = useState(50)

  const [events, setevents] = useState({})

  const createEvent = (e) => {
    setevents({
      ...events,
      [e.target.id]: {
        date: e.target.id
      }
    })
    console.log(events)
  }

  const EventBox = () => {
    return (<ResizableBox
      className='calendar-event'
      width={'100%'}
      height={columnHeight}
      axis='y'
      minConstraints={[100, 100]}
      maxConstraints={[300, 1000]}
      handleSize={[8, 8]}
      draggableOpts={{ grid: [columnHeight, 25] }}
      resizeHandles={['s']}>
      <span >Contents</span>
    </ResizableBox>)
  }

  const ResizeHandle = () => {
    return <hr />
  }

  const ColumnGrid = () => {
    let grid = []
    for (let i = 0; i < week.mon.length; i++) {
      for (let day in week) {
        let id = week[day][i]
        grid = [...grid,
        <div className='column is-one-third calendar-column' key={week[day][i]} style={{ 'height': `${columnHeight}px` }} id={id} onClick={!events[week[day][i]] ? (e) => createEvent(e) : null}>
          {events[week[day][i]] ? <EventBox /> : null}
        </div>
        ]
      }
    }
    return (
      <div className='columns is-multiline'>
        {grid}
      </div>
    )
  }

  // ColumnGrid()

  return (
    <div>
      <h1 className="title">Calendar with columns</h1>
      {ColumnGrid()}
    </div>
  )
}

export default CalendarwCols
