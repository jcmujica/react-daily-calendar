import React, { useContext } from 'react'
import { DateTime } from 'luxon';
import { Resizable } from 're-resizable';
import { CalendarContext } from '../Calendar/Calendar';

function Event(props) {
  const { id } = props;
  const { cellRange, columnHeight, eventList, seteventList, week, handleEdit } = useContext(CalendarContext);
  const { height } = eventList[id];

  const handleResizeStop = (e, dir, ref, delta, id) => {
    const maxHeight = getMaxHeight(id);
    const resizedHeight = eventList[id].height + delta.height;
    const appliedHeight = resizedHeight <= maxHeight ? resizedHeight : maxHeight;
    const newEndTime = calculateEndTime(appliedHeight, id);
    seteventList({
      ...eventList,
      [id]: {
        ...eventList[id],
        height: appliedHeight,
        endTime: newEndTime
      }
    })
  };

  const getMaxHeight = (id) => {
    let indexOfNext = -1
    for (let days in week) {
      let day = week[days]
      if (day.indexOf(id) !== -1) {
        //Check the next event in the day
        let restOfDay = day.slice(day.indexOf(id) + 1)
        for (const time of restOfDay) {
          if (eventList[time]) {
            indexOfNext = restOfDay.indexOf(time)
            break;
          }
        }
      }
    }
    if (indexOfNext !== -1) {
      return columnHeight * (indexOfNext + 1)
    } else {
      return Infinity
    }
  };

  const calculateEndTime = (height, id) => {
    const steps = height / columnHeight
    console.log(id)
    const startTime = DateTime.fromJSDate(eventList[id].startTime)
    const endTime = startTime.plus({ minutes: (cellRange * steps) })
    return endTime
  }

  return (
    <div>
      <Resizable
        className='calendar-resizable'
        enable={{ top: true, bottom: true }}
        grid={[0, (columnHeight)]}
        key={id}
        minHeight={columnHeight}
        size={{ width: '100%', height: height }}
        onClick={() => handleEdit(id)}
        onResizeStop={(e, dir, ref, delta) => handleResizeStop(e, dir, ref, delta, id)}
      >
        {eventList[id].title}
      </Resizable >
    </div>
  )
}

export default Event
