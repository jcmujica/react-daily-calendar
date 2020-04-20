import React, { useContext } from 'react';
import { CalendarContext } from '../Calendar/Calendar';
import { Rnd } from 'react-rnd';
import { DateTime } from 'luxon';

function Column(props) {
  const { columnHeight, eventList, week } = useContext(CalendarContext);
  const { day, events, setevents } = props;

  const createEvent = (e) => {
    let endTime = day[day.indexOf(e.target.id) + 1];
    let newEvent = {
      id: e.target.id,
      startTime: e.target.id,
      endTime,
      owner: '',
      participant: [{}, {}, {}],
      resources: [],
      color: 'blue',
      name: 'Event ',
      desc: '',
      height: columnHeight,
      yOffset: day.indexOf(e.target.id) * columnHeight,
      xOffset: 0
    };
    let updEvents = [...events, newEvent]
    setevents(updEvents)
    console.log(newEvent.endTime);
  };


  const handleResizeStop = (e, dir, ref, delta, id, height) => {
    var updEvents = [...events];
    var index = updEvents.findIndex(obj => obj.id === id);
    updEvents[index].height = height + delta.height;
    if (dir === 'top') {
      updEvents[index].yOffset = updEvents[index].yOffset - delta.height;
      // need to update starttime on top drag
      updEvents[index].startTime = day[updEvents[index].yOffset - delta.height / columnHeight]
    } else if (dir === 'bottom') {
      updEvents[index].endTime = day[day.indexOf(updEvents[index].endTime) + delta.height / columnHeight];
    }
    console.log(updEvents[index].endTime);
    setevents([
      ...updEvents,
    ]);
  };

  const handleDragStop = (e, data, id) => {
    let offset = 0;
    let section = data.y / columnHeight;
    let int = parseInt(section);
    let dec = (section - int) * 100;
    if (dec < 50) {
      offset = columnHeight * int;
    } else {
      offset = columnHeight * (int + 1);
    }
    let updEvents = [...events];
    let index = updEvents.findIndex(obj => obj.id === id);
    let newStartTime = day[offset / columnHeight];
    let arrayRange = day.indexOf(updEvents[index].endTime) - day.indexOf(newStartTime);

    let newEndTime = day[arrayRange + (offset / columnHeight)];
    console.log(newEndTime)
    updEvents[index].yOffset = offset;
    updEvents[index].startTime = newStartTime;
    updEvents[index].endTime = newEndTime;
    setevents([
      ...updEvents,
    ]);
  };

  const getDay = (a, b) => {
    if (a && b) {
      return (
        DateTime.fromMillis(parseInt(a)).startOf("day").ts === DateTime.fromMillis(parseInt(b)).startOf("day").ts)
    }
  }

  // const getCollisions = () => {
  //   let eventsCopy = [...events]
  //   for (let event of eventsCopy) {
  //     //get first element

  //     //get range of first element

  //     //check if there are more elements in that range

  //     //
  //     console.log(event.id)
  //     // get all
  //   }
  // }
  // getCollisions()

  return (
    <div className='calendar-day'>
      {day.map((time) => (
        <div
          key={time}
          id={time}
          className='calendar-time'
          style={{ 'height': `${columnHeight}px` }}
          onClick={(e) => createEvent(e)}
        >
          {/* {time.includes(':') ? time : null} */}
          {time}
        </div>
      ))}
      {events.filter((event) => getDay(event.startTime, day[0])).map((event) => (
        <Rnd
          className='calendar-resizable'
          dragAxis={'y'}
          bounds={'parent'}
          default={{ x: 0, y: columnHeight }}
          key={event.id}
          id={event.id}
          position={{ x: event.xOffset, y: event.yOffset }}
          enableResizing={{ top: true, bottom: true }}
          resizeGrid={[0, columnHeight]}
          minHeight={columnHeight}
          size={{ width: '100%', height: event.height }}
          style={{ backgroundColor: event.color }}
          onResizeStop={(e, dir, ref, delta) => handleResizeStop(e, dir, ref, delta, event.id, event.height)}
          onDragStop={(e, data) => handleDragStop(e, data, event.id, event.yOffset, events)}
        // onClick={alert('hola')}
        >
          {event.startTime}
        </Rnd>
      ))
      }
    </div>
  )
}

export default Column
