import React, { useState, useContext, useEffect } from 'react';
import { CalendarContext } from '../Calendar/Calendar';
import { Rnd } from 'react-rnd';
import { DateTime } from 'luxon';
import { v4 as uuid } from 'uuid';

function Column(props) {
  const { columnHeight } = useContext(CalendarContext);
  const { day, events, setevents } = props;

  const createEvent = (e) => {
    let startTime = e.target.id;
    let endTime = day[day.indexOf(e.target.id) + 2];
    let newEvent = {
      id: uuid(),
      startTime,
      endTime,
      owner: '',
      participant: [{}, {}, {}],
      resources: [],
      color: 'blue',
      name: 'Event ',
      desc: '',
      height: columnHeight,
      width: 90,
      seq: [startTime, endTime],
      yOffset: day.indexOf(e.target.id) * columnHeight,
      xOffset: 0
    };
    let updEvents = [...events, newEvent]
    setevents(updEvents);
    // console.log(newEvent.seq);
  };
  const [zIndex, setzIndex] = useState(0)

  const handleResizeStop = (e, dir, ref, delta, id, height) => {
    let updEvents = [...events];
    let index = updEvents.findIndex(obj => obj.id === id);
    let newStartTime = updEvents[index].startTime;
    let newEndTime = updEvents[index].endTime;
    updEvents[index].height = height + delta.height;
    if (dir === 'top') {
      updEvents[index].yOffset = updEvents[index].yOffset - delta.height;
      newStartTime = day[day.indexOf(updEvents[index].startTime) - (delta.height / columnHeight)];
      updEvents[index].startTime = newStartTime;
    } else if (dir === 'bottom') {
      newEndTime = day[day.indexOf(updEvents[index].endTime) + (delta.height / columnHeight)];
      updEvents[index].endTime = newEndTime;
    };
    updEvents[index].seq = getSequence(newStartTime, newEndTime, day);
    // console.log(updEvents[index].seq);
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
    let arrayRange = day.indexOf(updEvents[index].endTime) - day.indexOf(updEvents[index].startTime);
    let newStartTime = day[offset / columnHeight];
    let newEndTime = day[arrayRange + (offset / columnHeight)];
    updEvents[index].yOffset = offset;
    updEvents[index].startTime = newStartTime;
    updEvents[index].endTime = newEndTime;
    updEvents[index].seq = getSequence(newStartTime, newEndTime, day);
    // console.log(updEvents[index].seq);
    setevents([
      ...updEvents,
    ]);
  };

  const getSequence = (start, end, array) => {
    let arrayCopy = [...array];
    return arrayCopy.splice(arrayCopy.indexOf(start), (arrayCopy.indexOf(end) - arrayCopy.indexOf(start)));
  };

  const getDay = (a, b) => {
    if (a && b) {
      return (
        DateTime.fromMillis(parseInt(a)).startOf("day").ts === DateTime.fromMillis(parseInt(b)).startOf("day").ts);
    };
  };

  const calculateWidth = () => {

  }

  const getCollisions = (slot) => {
    for (let slot of day) {
      let eventsInThisSlot = events.filter((event) => (
        event.startTime === slot
      ))
      if (eventsInThisSlot.length > 0) {
        // console.log(eventsInThisSlot)
        let sorted = sortArrays(eventsInThisSlot);
        console.log(sorted)
        let width = 100;
        let updEvents = [...events];
        let index = -1;
        let localZIndex = 0; 
        for (let event of sorted) {
          console.log('width1', width)
          // console.log(event.id)
          index = updEvents.findIndex(obj => obj.id === event.id);
          updEvents[index].width = width * ((sorted.indexOf(event) + 1) / sorted.length);
          updEvents[index].zIndex = localZIndex;
          localZIndex++
          console.log(localZIndex)
          setevents([
            ...updEvents
          ]);
          // console.log('sorted length',sorted.length) 
          // console.log('width before',width) 
          // // width = width * ((sorted.indexOf(event) + 1) / sorted.length)
          // console.log('width after',width) 
        }
        setzIndex(localZIndex)
        console.log('sorted', sorted)
      }

    }
  }

  const sortArrays = (filteredEvents) => {
    return filteredEvents.sort((a, b) => (
      a.seq.length - b.seq.length
    ))
  }
  // getCollisions();

  useEffect(() => {

  }, [])

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
      <button onClick={getCollisions} >Test</button>
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
          size={{ width: `${event.width}%`, height: event.height }}
          style={{ backgroundColor: '#1a73e8', zIndex: event.zIndex }}
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
