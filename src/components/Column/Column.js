import React, { useState, useContext, useEffect } from 'react';
import { CalendarContext } from '../Calendar/Calendar';
import { Rnd } from 'react-rnd';
import { DateTime } from 'luxon';
import { v4 as uuid } from 'uuid';

function Column(props) {
  const { columnHeight } = useContext(CalendarContext);
  const { day, events, setevents } = props;
  const [zIndexState, setzIndexState] = useState(0);

  const createEvent = (e) => {
    console.log('events', events)
    let startTime = e.target.id;
    let endTime = day[day.indexOf(e.target.id) + 1]; //+2 ??
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
      xOffset: 0,
      zIndex: 0
    };
    let updEvents = [...events, newEvent];
    getCollisions(updEvents)
    setevents(updEvents);
    console.log(newEvent.seq);
  };

  useEffect(() => {
    // getCollisions()
  })

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
      // console.log(day.indexOf(updEvents[index].endTime))
      // console.log(delta.height / columnHeight)
      updEvents[index].endTime = newEndTime;
    };
    updEvents[index].seq = getSequence(newStartTime, newEndTime, day);
    console.log(updEvents[index].seq);
    setevents([
      ...updEvents,
    ]);
    getCollisions(updEvents)
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
    console.log(newStartTime)
    console.log(newEndTime)
    updEvents[index].yOffset = offset;
    updEvents[index].startTime = newStartTime;
    updEvents[index].endTime = newEndTime;
    updEvents[index].seq = getSequence(newStartTime, newEndTime, day);
    console.log(updEvents[index].seq);
    setevents([
      ...updEvents,
    ]);
    getCollisions(updEvents);
  };

  const getSequence = (start, end, array) => {
    let arrayCopy = [...array];
    // console.log(arrayCopy.indexOf(start))
    // console.log(arrayCopy.indexOf(end))
    return arrayCopy.splice(arrayCopy.indexOf(start), (arrayCopy.indexOf(end) - arrayCopy.indexOf(start) + 1));
  };

  const getDay = (a, b) => {
    if (a && b) {
      return (
        DateTime.fromMillis(parseInt(a)).startOf("day").ts === DateTime.fromMillis(parseInt(b)).startOf("day").ts);
    };
  };

  const getCollisions = (events = []) => {
    console.log('entry', events)
    let zIndex = 0;
    setzIndexState(0);
    for (let slot of day) {
      let eventsInThisSlot = events.filter((event) => (
        event.startTime === slot
      ));
      if (eventsInThisSlot.length > 0) {
        console.log('eventsInThisSlot', eventsInThisSlot)
        let sorted = sortArrays(eventsInThisSlot);
        // console.log(sorted)
        let width = 100;
        let updEvents = [...events];
        let index = -1;
        for (let event of sorted) {
          // console.log('width1', width)
          // console.log(event.id)
          width = findParentWidth(slot);
          index = updEvents.findIndex(obj => obj.id === event.id);
          updEvents[index].width = width * (1 - (sorted.indexOf(event) / sorted.length));
          updEvents[index].zIndex = zIndex;
          console.log('zindex', updEvents[index].zIndex)
          zIndex++;
          console.log('localZIndex', zIndex)
          setevents([
            ...updEvents
          ]);
        };
        // findParentWidth(slot)
        // console.log('sorted', sorted)
        // console.log('exclude', findParentWidth(slot))
      }
    }
    setzIndexState(zIndex);

  }

  const findParentWidth = (slot) => {
    let eventsCopy = [];
    let eventsInDiffSlots = [];
    let modifiedEvents = {};
    let modifiedEventsList = [];
    let eventCopy = [];
    let parentEvents = [];
    let sortByWidth = [];
    let baseWidth = 90;
    eventsCopy = [...events];
    eventsInDiffSlots = eventsCopy.filter((event) => (
      event.startTime !== slot
    ));
    /* Remove last position as it is not part of the visual area */
    eventCopy = [...eventsInDiffSlots]
    for (let event of eventCopy) {
      if (event.id) {
        let seqCopy = event.seq.slice(0, -1);
        modifiedEvents = {
          ...event,
          seq: seqCopy
        };
        modifiedEventsList = [...modifiedEventsList, modifiedEvents];
      };
    };
    parentEvents = modifiedEventsList.filter((event) => event.seq.includes(slot));
    // console.log('find parent width', parentEvents)
    sortByWidth = sortArrays(parentEvents);
    console.log('sortByWidth', sortByWidth)
    if (sortByWidth.length > 0) {
      baseWidth = sortByWidth[sortByWidth.length - 1].width - 10;
    }
    return baseWidth;
  }

  const sortArrays = (filteredEvents) => {
    return filteredEvents.sort((a, b) => (
      b.seq.length - a.seq.length
    ))
  }

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
          size={{ width: `${event.width}%`, height: `${event.height}` }}
          style={{ backgroundColor: '#1a73e8', zIndex: event.zIndex }}
          onResizeStop={(e, dir, ref, delta) => handleResizeStop(e, dir, ref, delta, event.id, event.height)}
          onDragStop={(e, data) => handleDragStop(e, data, event.id, event.yOffset, events)}
        // onHover={alert()}
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
