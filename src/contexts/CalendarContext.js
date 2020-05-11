import React, { createContext, useState } from 'react';
import { DateTime } from 'luxon';

export const CalendarContext = createContext();
function CalendarContextProvider(props) {

  const [activeModal, setActiveModal] = useState(false);
  const [modalMode, setmodalMode] = useState('');
  const [newEvent, setNewEvent] = useState(false);
  const [timeRange, setTimeRange] = useState(15); //minutes
  const [columnHeight, setColumnHeight] = useState(30); //cellHeight
  const [centerStartTime, setCenterStartTime] = useState(8);
  const [centerEndTime, setCenterEndTime] = useState(18);
  const [activeWeek, setActiveWeek] = useState(DateTime.local().startOf('week'));
  const [activeEventId, setactiveEvent] = useState('');
  const [events, setEvents] = useState([]);
  const [viewMode, setviewMode] = useState('week');
  const [dayViewDay, setDayViewDay] = useState('');
  const [scrolled, setScrolled] = useState(false);

  const handleCreate = (e) => {
    setactiveEvent(e.target.id);
    setmodalMode('create');
    setActiveModal(true);
  };

  const handleEdit = (e, event) => {
    e.preventDefault();
    setactiveEvent(event.id);
    setmodalMode('edit');
    setActiveModal(true);
  };

  return (
    <CalendarContext.Provider value={{
      activeEventId,
      activeModal,
      activeWeek,
      centerEndTime,
      centerStartTime,
      columnHeight,
      dayViewDay,
      events,
      handleCreate,
      handleEdit,
      newEvent,
      modalMode,
      scrolled,
      setactiveModal: setActiveModal,
      setactiveWeek: setActiveWeek,
      setdayViewDay: setDayViewDay,
      setevents: setEvents,
      setNewEvent,
      setScrolled,
      setviewMode,
      timeRange,
      viewMode,
    }}>
      {props.children}
    </CalendarContext.Provider>
  )
}

export default CalendarContextProvider
