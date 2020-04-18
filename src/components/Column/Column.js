import React, { useContext } from 'react'
import { CalendarContext } from '../Calendar/Calendar';
import { v4 as uuid } from 'uuid';
import { Rnd } from 'react-rnd'

function Column(props) {
  const { columnHeight, eventList, week } = useContext(CalendarContext)
  const { day, events, setevents } = props;

  const handleClick = (e) => {
    console.log(e.currentTarget)
  }


  const handleResizeStop = (e, dir, ref, delta, id, height) => {
    var updEvents = [...events];
    var index = updEvents.findIndex(obj => obj.id === id);
    updEvents[index].height = height + delta.height;
    setevents([
      ...updEvents,
    ])
  }

  const handleDragStop = (e, data, id) => {
    console.log('e', e)
    console.log('data', data.y)
    let offset = 0;

    let section = data.y / columnHeight;
    let int = parseInt(section);
    let dec = (section - int) * 100;
    if (dec < 50) {
      offset = columnHeight * int;
    } else {
      offset = columnHeight * (int + 1);
    }


    var updEvents = [...events];
    var index = updEvents.findIndex(obj => obj.id === id);
    updEvents[index].yOffset = offset;
    setevents([
      ...updEvents,
    ])
    console.log('drag stopped')
  }

  return (
    <div className='calendar-day'>
      {day.map((time) => (
        <div
          key={time}
          id={time}
          className='calendar-time'
          style={{ 'height': `${columnHeight}px` }}
          onClick={(e) => handleClick(e)}
        >
          {time.includes(':') ? time : null}
        </div>
      ))}
      {events.map((event) => (
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
          // dragGrid={[0, columnHeight]}
          minHeight={columnHeight}
          size={{ width: '100%', height: event.height }}
          style={{ backgroundColor: 'blue' }}
          onResizeStop={(e, dir, ref, delta) => handleResizeStop(e, dir, ref, delta, event.id, event.height)}
          onDragStop={(e, data) => handleDragStop(e, data, event.id, event.yOffset, events)}
        >
          {event.name}
        </Rnd>

      ))

      }
    </div>
  )
}

export default Column
