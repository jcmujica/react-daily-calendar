import React, { useState, useEffect, useContext } from 'react'
import { Rnd } from 'react-rnd'
import { UserContext } from '../../contexts/UserContext';
import { CalendarContext } from '../../contexts/CalendarContext';

function Event({ event, day }) {
  const { columnHeight, events, setevents, handleEdit, activeModal, newEvent, setNewEvent } = useContext(CalendarContext);
  const [zIndexState, setzIndexState] = useState(0);
  const { users, displayUsers, setdisplayUsers, currentUser, setcurrentUser, usersChanged, setusersChanged } = useContext(UserContext);

  const getCollisions = (events = [], day) => {
    let sorted = [];
    let width;
    let updEvents;
    let index;
    let eventsCopy;
    let eventsInDiffSlots;
    let modifiedEvents;
    let modifiedEventsList;
    let eventCopy;
    let parentEvents;
    let sortByWidth;
    let baseWidth;
    let updWidths = [];
    let filteredEvents = events.filter((event) => (displayUsers.includes(event.owner)));
    let zIndex = 0;
    setzIndexState(zIndex);
    for (let slot of day) {
      let eventsInThisSlot = filteredEvents.filter((event) => (
        event.startTime === slot
      ));
      if (eventsInThisSlot.length > 0) {
        sorted = sortArrays(eventsInThisSlot);
        width = 100;
        updEvents = [...events];
        index = -1;
        for (let event of sorted) {
          eventsCopy = [];
          eventsInDiffSlots = [];
          modifiedEvents = {};
          modifiedEventsList = [];
          eventCopy = [];
          parentEvents = [];
          sortByWidth = [];
          baseWidth = 90;
          eventsCopy = [...events];
          eventsInDiffSlots = eventsCopy.filter((event) => (
            event.startTime !== slot
          ));
          /* Remove last position as it is not part of the visual area */
          eventCopy = [...eventsInDiffSlots]
          for (let event of eventCopy) {
            if (event.id) {
              let seqCopy = event.seq.slice(0, -1);
              modifiedEvents = { ...event, seq: seqCopy };
              modifiedEventsList = [...modifiedEventsList, modifiedEvents];
            };
          };
          parentEvents = modifiedEventsList.filter((event) => event.seq.includes(slot));
          sortByWidth = sortArrays(parentEvents);
          if (sortByWidth.length > 0) {
            baseWidth = sortByWidth[sortByWidth.length - 1].width - 10;
          }
          index = updEvents.findIndex(obj => obj.id === event.id);
          updEvents[index].width = baseWidth * (1 - (sorted.indexOf(event) / sorted.length));
          updEvents[index].zIndex = zIndex;
          zIndex++;
          updWidths = [...updEvents];
        };
      }
    }
    setzIndexState(zIndex);
    return updWidths
  };

  const handleResizeStop = (e, dir, ref, delta, id, height) => {
    let updEvents = [...events];
    let index = updEvents.findIndex(obj => obj.id === id);
    let newStartTime = updEvents[index].startTime;
    let newEndTime = updEvents[index].endTime;
    let updWidths = [];
    updEvents[index].height = height + delta.height;
    if (dir === 'top') {
      updEvents[index].yOffset = updEvents[index].yOffset - delta.height;
      newStartTime = day[day.indexOf(updEvents[index].startTime) - (delta.height / columnHeight)];
      updEvents[index].startTime = newStartTime;
    } else if (dir === 'bottom') {
      newEndTime = day[day.indexOf(updEvents[index].endTime) + (delta.height / columnHeight)];
      if (newEndTime) {
        updEvents[index].endTime = newEndTime;
      } else {
        newEndTime = day[day.indexOf(updEvents[index].endTime) + (delta.height / columnHeight) - 1];
        updEvents[index].height = height + delta.height - columnHeight;
        updEvents[index].endTime = newEndTime;
      }
    };
    updEvents[index].seq = getSequence(newStartTime, newEndTime, day);
    console.log(updEvents[index].seq)
    updWidths = getCollisions(updEvents, day)
    setevents([
      ...updWidths,
    ]);
  };

  const handleDragStop = (data, id, height) => {
    let offset = 0;
    console.log('height', height)
    let eventTop = data.y / columnHeight;
    console.log('section', eventTop)
    let eventBottom = (data.y + height) / columnHeight;
    console.log('eventBottom', eventBottom);
    console.log('day length', day.length);
    let int = parseInt(eventTop);
    let dec = (eventTop - int) * 100;
    let updWidths = [];
    console.log('dec', dec);


    if (eventBottom > (day.length - 1)) {
      if (dec === 0) {
        console.log('<50')
        offset = columnHeight * (int - 1);
      } else if (dec < 50) {
        console.log('>50')
        offset = columnHeight * (int);
      } else {
        offset = columnHeight * (int);
      }
    } else {
      if (dec < 50) {
        offset = columnHeight * int;
      } else {
        offset = columnHeight * (int + 1);
      }
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
    updWidths = getCollisions(updEvents, day)
    setevents([
      ...updWidths,
    ]);
  };

  const getSequence = (start, end, array) => {
    let arrayCopy = [...array];
    return arrayCopy.splice(arrayCopy.indexOf(start), (arrayCopy.indexOf(end) - arrayCopy.indexOf(start) + 1));
  };

  const sortArrays = (filteredEvents) => {
    return filteredEvents.sort((a, b) => (
      b.seq.length - a.seq.length
    ))
  };

  useEffect(() => {
    let updWidths = [];
    if (newEvent) {
      setNewEvent(false);
      updWidths = getCollisions(events, day);
      setevents([
        ...updWidths
      ])
    }
  }, [newEvent]);

  useEffect(() => {
    let updWidths = [];
    if (usersChanged) {
      setusersChanged(false);
      updWidths = getCollisions(events, day);
      setevents([
        ...updWidths
      ])

    }
  }, [usersChanged]);

  return (
    <>
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
        style={{
          backgroundColor: users.filter((el) => el.id === event.owner)[0].settings.color,
          zIndex: event.zIndex
        }}
        onContextMenu={(e) => handleEdit(e)}
        onResizeStop={(e, dir, ref, delta) => handleResizeStop(e, dir, ref, delta, event.id, event.height)}
        onDragStop={(e, data) => handleDragStop(data, event.id, event.height)}

      >
        <span>{event.name}</span>
      </Rnd>
    </>
  )
}

export default Event
