import React, { useState } from 'react'
import { DateTime, Duration } from 'luxon'
import Draggable from 'react-draggable'

function Calendar() {

  const startTime = Duration.fromObject({ hours: 8 })
  const endTime = Duration.fromObject({ hours: 20 })
  const start = DateTime.local().startOf('day').plus(startTime)
  const end = DateTime.local().startOf('day').plus(endTime)
  const dur = Duration.fromObject({ minutes: 15 })
  const range = end.diff(start, ['hours']).hours
  const today = DateTime.local()

  const [activeWeek, setactiveWeek] = useState(today.startOf('week'))
  const [events, setevents] = useState({})
  const [DisplayMonthYear, setDisplayMonthYear] = useState(activeWeek.toFormat('LLLL yyyy'))


  const getTimeSlots = (start, dur, range) => {
    let slotRange = range * 4
    let arr = []
    for (let i = 0; i <= slotRange; i++) {
      arr = [...arr, {
        formatted: start.toLocaleString(DateTime.TIME_24_SIMPLE),
        date: start
      }]
      start = start.plus(dur)
    }
    return arr
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
  const timeSlots = getTimeSlots(start, dur, range)
  // console.log(timeSlots)


  const handleEntryCreation = (e) => {
    setevents({
      ...events,
      [e.target.id]: {
        date: DateTime.fromFormat(e.target.id, 'EEE dd')
      }
    })
    console.log(events)
  }

  const calculateSlotDate = (day, time) => {
    const slotDate = day.plus({ hours: time.c.hour, minutes: time.c.minute })
    return slotDate
  }

  const handleWeekChange = (action) => {
    action === 'forward' ?
      setactiveWeek(activeWeek.plus({ week: 1 })) :
      setactiveWeek(activeWeek.minus({ week: 1 }))
    setDisplayMonthYear(activeWeek.toFormat('LLLL yyyy'))
  }

  const handleStart = () => {
    console.log('start')
  }
  const handleDrag = () => {
    console.log('drag')
  }
  const handleStop = () => {
    console.log('stop')
  }

  const Box = () => {
    return (
      <Draggable
        axis="y"
        // handle=".handle"
        // defaultPosition={{ x: 0, y: 0 }}
        position={null}
        grid={[25, 25]}
        scale={1}
        onStart={handleStart}
        onDrag={handleDrag}
        onStop={handleStop} >
        <div>I can now be moved around!</div>
      </Draggable >
    )
  }

  return (
    <div className="calendar">
      <h1 className="title calendar-title">{DisplayMonthYear}</h1>
      < table className="table is-bordered is-fullwidth" >
        <thead>
          <tr>
            <th onClick={() => handleWeekChange('back')}>{'<'}</th>
            {weekDays.map((day) => (
              <th key={day.date.ts}>
                {day.formatted.letters}
                <br />
                <span className={
                  today.hasSame(day.date, 'day') ?
                    'calendar-today' :
                    'calendar-notToday'
                }>{day.formatted.number}</span>
              </th>
            ))}
            <th onClick={() => handleWeekChange('forward')}>{'>'}</th>
          </tr>
        </thead>
        <tbody>
          {timeSlots.map((time) => (
            <tr key={time.date.ts}>
              <td key={`right_${time.date.ts}`}>
                {time.formatted}
              </td>
              {weekDays.map((day) => {
                const slotValue = calculateSlotDate(day.date, time.date)
                return (
                  <td
                    key={slotValue.toMillis()}
                    id={slotValue.toMillis()}
                    onClick={handleEntryCreation}
                  >
                    {events[slotValue.toMillis()] ?
                      <Box /> :
                      null
                    }

                  </td>
                )
              })}
              <td key={`left_${time.date.ts}`}>{time.formatted}</td>
            </tr>
          ))}
        </tbody>
      </table >
    </div>
  )
}

export default Calendar


