import React, { useContext, useRef, useEffect, useState, useMemo } from 'react';
import { DateTime } from 'luxon';
import { v4 as uuid } from 'uuid';
import { UserContext } from '../../contexts/UserContext';
import { CalendarContext } from '../../contexts/CalendarContext';
import Event from '../Event/Event';

function Column(props) {
  const scrollPosition = useRef();
  const { columnHeight, events, handleCreate, centerStartTime, centerEndTime, timeRange, scrolled, setScrolled } = useContext(CalendarContext);
  const { displayUsers } = useContext(UserContext);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(0);
  const { day, view } = props;


  const getDay = (a, b) => {
    if (a && b) {
      return (
        DateTime.fromMillis(parseInt(a)).startOf("day").ts === DateTime.fromMillis(parseInt(b)).startOf("day").ts);
    };
  };

  useEffect(() => {
    if (!scrolled) {
      setScrolled(true);
      scrollPosition.current.scrollIntoView();
    }
  }, [scrollPosition, scrolled, setScrolled]);

  useMemo(() => {
    setStartIndex(centerStartTime * (60 / timeRange));
    setEndIndex(centerEndTime * (60 / timeRange));
  }, [centerEndTime, centerStartTime, timeRange]);

  return (
    <div className={view === 'week' ? 'calendar-day' : 'calendar-dayFull'}>
      {day.map((time, i) => {
        let control = time.includes(':') ? true : false;
        return (
          <div
            key={control ? `${time}${uuid()}` : time}
            id={time}
            className={`${control ? 'calendar-time__control' : 'calendar-time'} ${(i < startIndex || i >= endIndex) && !control ? 'calendar-ooRange' : '  '}`}
            style={{ 'height': `${columnHeight}px` }}
            onClick={control ? null :
              i !== (day.length - 1) ? (e) => handleCreate(e) : null}
            ref={i === (centerStartTime * (60 / timeRange) - 1) ? scrollPosition : null}
          >
            {control ? <span>{time}</span> : null}
          </div>
        )
      })}
      {events.length > 0 ?
        events
          .filter((event) => getDay(event.startTime, day[0]))
          .filter((event) => (displayUsers.includes(event.owner)))
          .map((event) => (
            <Event
              day={day}
              event={event}
              key={uuid()}
            />
          ))
        : null}
    </div>
  )
}

export default Column;
