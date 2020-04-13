import React, { useState } from 'react'
import { Resizable, ResizableBox } from 'react-resizable';

function CalendarwCols() {
  const [week, setweek] = useState({
    con: ['8:00', '8:15', '8:30', '9:00', '9:30', '10:00', '10:30', '11:00'],
    mon: ['mon1', 'mon2', 'mon3', 'mon4', 'mon5', 'mon6', 'mon7', 'mon8'],
    tue: ['tue1', 'tue2', 'tue3', 'tue4', 'tue5', 'tue6', 'tue7', 'tue8'],
    wed: ['wed1', 'wed2', 'wed3', 'wed4', 'wed5', 'wed6', 'wed7', 'wed8'],
    thu: ['thu1', 'thu2', 'thu3', 'thu4', 'thu5', 'thu6', 'thu7', 'thu8'],
    fri: ['fri1', 'fri2', 'fri3', 'fri4', 'fri5', 'fri6', 'fri7', 'fri8'],
    sat: ['sat1', 'sat2', 'sat3', 'sat4', 'sat5', 'sat6', 'sat7', 'sat8'],
    sun: ['sun1', 'sun2', 'sun3', 'sun4', 'sun5', 'sun6', 'sun7', 'sun8'],
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
        date: e.target.id,
        height: columnHeight
      }
    })
    console.log(events)
  }

  const EventBox = (props) => {
    const { date: id, height } = props.data
    return (<ResizableBox
      className='calendar-event'
      width={'100%'}
      height={height}
      axis='y'
      minConstraints={[100, 100]}
      maxConstraints={[300, 1000]}
      handleSize={[8, 8]}
      draggableOpts={{ grid: [25, height] }}
      resizeHandles={['s']}
      onResizeStart={(e) => handleResizeStart(e)}
      onResizeStop={(e, data) => handleResizeStop(e, data, id)}
    >

      <span >Contents</span>
    </ResizableBox>)
  }

  const ResizeHandle = () => {
    return <hr />
  }

  const handleResizeStart = (e) => {
    console.log('hola')
  }
  const handleResizeStop = (e, data, id) => {
    let newHeight = data.node.parentElement.offsetHeight

    setevents({
      ...events,
      [id]: {
        ...[id],
        height: newHeight
      }
    })
  }

  const ColumnGrid = () => {
    let grid = []
    for (let i = 0; i < week.mon.length; i++) {
      for (let day in week) {
        let id = week[day][i]
        grid = [...grid,
        <div
          className='calendar-column'
          key={id}
          style={{ 'height': `${columnHeight}px` }}
          id={id}
          onClick={!events[id] ? (e, data) => createEvent(e, data) : null}>
          {id}
          {events[id] ? <EventBox data={events[id]} /> : null}
        </div>
        ]
      }
    }
    return (
      <div className='calendar'>
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
