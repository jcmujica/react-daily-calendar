import React, { useState, useEffect } from 'react';
import { Resizable } from 're-resizable';
import { DateTime, Duration } from 'luxon';

function CalendarwCols() {
  const [week, setweek] = useState({ control: [], mon: [], tue: [], wed: [], thu: [], fri: [], sat: [], sun: [] });
  const [columnHeight, setcolumnHeight] = useState(30);;
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
  const [displayMonthYear, setdisplayMonthYear] = useState(activeWeek.toFormat('LLLL yyyy'))

  const getTimeSlots = (start, dur, range) => {
    let slotRange = range * 4
    let timeSlot = start

    let day = activeWeek.plus(startTime)
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

  useEffect(() => {
    setweek(getTimeSlots(start, cellDuration, range))
  }, [activeWeek])

  const handleWeekChange = (action) => {
    action === 'forward' ?
      setactiveWeek(activeWeek.plus({ week: 1 })) :
      setactiveWeek(activeWeek.minus({ week: 1 }))

    setdisplayMonthYear(activeWeek.toFormat('LLLL yyyy'))
    // setweek(getTimeSlots(start, cellDuration, range))
  }

  const EventBox = (props) => {
    const { id } = props
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
        endTime: newEndTime
      }
    })
  }

  const getWeekDays = () => {
    let arr = []
    for (let i = 0; i < 7; i++) {
      let dayOfWeek = activeWeek.plus({ days: i })

      let dayDisplayFormat = {
        letters: dayOfWeek.toFormat('EEE'),
        number: dayOfWeek.toFormat('dd')
      }
      arr = [...arr, {
        formatted: dayDisplayFormat,
        date: dayOfWeek
      }]
    }
    return arr
  }

  const weekDays = getWeekDays()

  const ColumnGrid = () => {
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
          onClick={!events[id] && day !== 'control' ? (e) => createEvent(e) : null}
        >
          {events[id] ? <EventBox id={id} /> : null}
          {Object.keys(week) === 'control' ? 'h' : null}
          {day === 'control' ? <p className='calendar-control'>{week.control[i]}</p> : null}
          {/* {DateTime.fromMillis(parseInt(id)).toLocaleString(DateTime.DATE_FULL)} */}
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
      <h1 className="title calendar-title">
        <span onClick={() => handleWeekChange('back')}>{'<'}</span>
        {displayMonthYear}
        <span onClick={() => handleWeekChange('forward')}>{'>'}</span>
      </h1>
      <div className='calendar-header'>
        <div className='calendar-header__element-first'></div>
        {weekDays.map((day) => (
          <div key={day.formatted.letters} className='calendar-header__element'>
            <span className='calendar-letters'>
              {day.formatted.letters}
            </span>
            <span className={
              today.hasSame(day.date, 'day') ?
                'calendar-today' :
                'calendar-notToday'
            }>
              {day.formatted.number}
            </span>
          </div>
        ))}

      </div>
      {ColumnGrid()}
    </div>
  )
}

export default CalendarwCols
