import React, { createContext, useState } from 'react';
import { DateTime } from 'luxon';

export const CalendarContext = createContext();
function CalendarContextProvider(props) {

  const [activeModal, setactiveModal] = useState(false);
  const [modalMode, setmodalMode] = useState('');
  const [newEvent, setNewEvent] = useState(false);
  const [timeRange, setTimeRange] = useState(15); //minutes
  const [columnHeight, setcolumnHeight] = useState(30); //cellHeight
  const [activeWeek, setactiveWeek] = useState(DateTime.local().startOf('week'));
  const [activeEventId, setactiveEvent] = useState('');
  const [events, setevents] = useState([]);
  const [viewMode, setviewMode] = useState('week');
  const [dayViewDay, setdayViewDay] = useState('');

  const handleCreate = (e) => {
    console.log(e.target.id)
    setactiveEvent(e.target.id);
    setmodalMode('create');
    setactiveModal(true);
  };

  const handleEdit = (e) => {
    e.preventDefault();
    setactiveEvent(e.target.id);
    setmodalMode('edit');
    setactiveModal(true);
  };

  return (
    <CalendarContext.Provider value={{
      activeModal,
      setactiveModal,
      newEvent,
      setNewEvent,
      timeRange,
      columnHeight,
      handleCreate,
      handleEdit,
      id: activeEventId,
      events,
      setevents,
      modalMode,
      activeWeek,
      setactiveWeek,
      viewMode,
      setviewMode,
      dayViewDay,
      setdayViewDay
    }}>
      {props.children}
    </CalendarContext.Provider>
  )
}

export default CalendarContextProvider
