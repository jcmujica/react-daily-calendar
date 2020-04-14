import React, { useState, useEffect } from 'react';
import { Resizable } from 're-resizable';
import { DateTime, Duration } from 'luxon';

function CalendarwCols() {
  const [week, setweek] = useState({ control: [], mon: [], tue: [], wed: [], thu: [], fri: [], sat: [], sun: [] });
  const [columnHeight, setcolumnHeight] = useState(50);;
  const [events, setevents] = useState({});
  const [cellRange, setcellRange] = useState(15)
  const cellDuration = Duration.fromObject({ minutes: cellRange })
  const resizeHandleDirection = { bottom: true }
  const startTime = Duration.fromObject({ hours: 8 })
  const endTime = Duration.fromObject({ hours: 20 })
  const start = DateTime.local().startOf('day').plus(startTime)
  const end = DateTime.local().startOf('day').plus(endTime)
  const range = end.diff(start, ['hours']).hours
  const today = DateTime.local()
  const [activeWeek, setactiveWeek] = useState(today.startOf('week'))

  const getTimeSlots = (start, dur, range) => {
    let slotRange = range * 4
    let timeSlot = start
    let day = today.startOf('week').plus(startTime)
    let monday = day
    let tuesday = day.plus({ days: 1 })
    let wednesday = day.plus({ days: 2 })
    let thursday = day.plus({ days: 3 })
    let friday = day.plus({ days: 4 })
    let saturday = day.plus({ days: 5 })
    let sunday = day.plus({ days: 6 })
    let week = { control: [], mon: [], tue: [], wed: [], thu: [], fri: [], sat: [], sun: [] }
    for (let i = 0; i <= slotRange; i++) {
      week = {
        ...week,
        control: [...week.control, timeSlot.toLocaleString(DateTime.TIME_24_SIMPLE)],
        mon: [...week.mon, monday.toMillis().toString()],
        tue: [...week.tue, tuesday.toMillis().toString()],
        wed: [...week.wed, wednesday.toMillis().toString()],
        thu: [...week.thu, thursday.toMillis().toString()],
        fri: [...week.fri, friday.toMillis().toString()],
        sat: [...week.sat, saturday.toMillis().toString()],
        sun: [...week.sun, sunday.toMillis().toString()],
      }
      timeSlot = timeSlot.plus(dur)
      monday = monday.plus(dur)
      tuesday = tuesday.plus(dur)
      wednesday = wednesday.plus(dur)
      thursday = thursday.plus(dur)
      friday = friday.plus(dur)
      saturday = saturday.plus(dur)
      sunday = sunday.plus(dur)
    }
    return week
  }

  const createEvent = (e) => {
    const startTime = DateTime.fromMillis(parseInt(e.target.id));
    setevents({
      ...events,
      [e.target.id]: {
        date: e.target.id,
        height: columnHeight,
        startTime: startTime,
        endTime: startTime.plus(cellDuration)
      }
    })
  }

  useEffect(() => {
    setweek(getTimeSlots(start, cellDuration, range))
  }, [])

  const EventBox = (props) => {
    const { id } = props
    console.log(events[id])
    const { height } = events[id]
    return (
      <Resizable
        className='calendar-resizable'
        enable={resizeHandleDirection}
        grid={[0, (columnHeight)]}
        minHeight={columnHeight}
        size={{ width: '100%', height: height }}
        onResizeStop={(e, dir, ref, delta) => handleResizeStop(e, dir, ref, delta, id)}
      >
        {id}
      </Resizable >
    )
  }

  const ResizeHandle = () => {
    return <hr />
  }

  const getMaxHeight = (id) => {
    let indexOfNext = -1
    for (let days in week) {
      let day = week[days]
      if (day.indexOf(id) !== -1) {
        //Check the next event in the day
        let restOfDay = day.slice(day.indexOf(id) + 1)
        for (const time of restOfDay) {
          if (events[time]) {
            indexOfNext = restOfDay.indexOf(time)
            break
          }
        }
      }
    }
    if (indexOfNext !== -1) {
      return columnHeight * (indexOfNext + 1)
    } else {
      return Infinity
    }
  }

  const calculateEndTime = (height, id) => {
    const steps = height / columnHeight
    const startTime = events[id].startTime
    console.log(cellRange * steps)
    console.log(cellRange)
    console.log(steps)
    const endTime = startTime.plus({ minutes: (cellRange * steps) })
    return endTime
  }

  const handleResizeStop = (e, dir, ref, delta, id) => {
    const maxHeight = getMaxHeight(id)
    const resizedHeight = events[id].height + delta.height
    const appliedHeight = resizedHeight <= maxHeight ? resizedHeight : maxHeight
    const newEndTime = calculateEndTime(appliedHeight, id)
    setevents({
      ...events,
      [id]: {
        ...events[id],
        height: appliedHeight,
        endTime: newEndTime.toString()
      }
    })
  }

  const ColumnGrid = () => {
    let grid = []
    console.log(week)
    for (let i = 0; i < week.control.length; i++) {
      for (let day in week) {
        let id = week[day][i]
        grid = [...grid,
        <div
          className='calendar-column'
          key={id}
          style={{ 'height': `${columnHeight}px` }}
          id={id}
          onClick={!events[id] ? (e) => createEvent(e) : null}>
          {id}
          {events[id] ? <EventBox id={id} /> : null}
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

  return (
    <div>
      <h1 className="title">Calendar with columns</h1>
      {ColumnGrid()}
    </div>
  )
}

export default CalendarwCols
