import React, { createContext, useState, useEffect, useContext } from 'react';
import { DateTime, Duration } from 'luxon';
import Modal from '../Modal/Modal';
import Grid from '../Grid/Grid';
import { UserContext } from '../../contexts/UserContext';

export const CalendarContext = createContext();

function Calendar() {
  const today = DateTime.local();
  const [week, setweek] = useState({ control: [], mon: [], tue: [], wed: [], thu: [], fri: [], sat: [], sun: [] });;
  const [columnHeight, setcolumnHeight] = useState(30);
  const [eventList, seteventList] = useState({});
  const [cellRange, setcellRange] = useState(15);
  const [activeWeek, setactiveWeek] = useState(today.startOf('week'));
  const [displayMonthYear, setdisplayMonthYear] = useState(today.startOf('week').toFormat('LLLL yyyy'));
  const [activeModal, setactiveModal] = useState(false);
  const [activeEventId, setactiveEvent] = useState('');
  const [modalMode, setmodalMode] = useState('');
  const [weekDays, setweekDays] = useState([]);

  const cellDuration = Duration.fromObject({ minutes: cellRange });
  const startTime = Duration.fromObject({ hours: 8 });
  const endTime = Duration.fromObject({ hours: 12 });
  const start = DateTime.local().startOf('day').plus(startTime);
  const end = DateTime.local().startOf('day').plus(endTime);
  const range = end.diff(start, ['hours']).hours;

  /* CONTEXT */

  const { users } = useContext(UserContext);
  // console.log(users);
  /* HOOKS */

  useEffect(() => {
    let weekCalculation = getTimeSlots();
    setweek(weekCalculation);
    setdisplayMonthYear(getWeekDisplay(activeWeek));
    setweekDays(getWeekDays(activeWeek))
  }, [activeWeek]);

  useEffect(() => {
    let weekCalculation = getTimeSlots();
    setweek(weekCalculation);
  }, [eventList]);

  useEffect(() => {
    let weekCalculation = getTimeSlots();
    setweek(weekCalculation);
  }, []);

  /* WEEK */

  const getTimeSlots = () => {
    // console.log('get time slots')
    let dur = cellDuration;
    let slotRange = range * 4
    let timeSlot = start
    let day = activeWeek.plus(startTime)
    let monday = day
    let tuesday = day.plus({ days: 1 })
    let wednesday = day.plus({ days: 2 })
    let thursday = day.plus({ days: 3 })
    let friday = day.plus({ days: 4 })
    let saturday = day.plus({ days: 5 })
    let sunday = day.plus({ days: 6 })
    let week = { control: [], mon: [], tue: [], wed: [], thu: [], fri: [], sat: [], sun: [] }
    for (let i = 0; i <= slotRange; i++) {
      week = {
        ...week,
        control: [...week.control, timeSlot.toLocaleString(DateTime.TIME_24_SIMPLE)],
        mon: [...week.mon, monday.toMillis().toString()],
        tue: [...week.tue, tuesday.toMillis().toString()],
        wed: [...week.wed, wednesday.toMillis().toString()],
        thu: [...week.thu, thursday.toMillis().toString()],
        fri: [...week.fri, friday.toMillis().toString()],
        sat: [...week.sat, saturday.toMillis().toString()],
        sun: [...week.sun, sunday.toMillis().toString()],
      }
      timeSlot = timeSlot.plus(dur)
      monday = monday.plus(dur)
      tuesday = tuesday.plus(dur)
      wednesday = wednesday.plus(dur)
      thursday = thursday.plus(dur)
      friday = friday.plus(dur)
      saturday = saturday.plus(dur)
      sunday = sunday.plus(dur)
    }
    return week
  };

  const getWeekDisplay = (activeWeek) => {
    let firstMonth = activeWeek.startOf('week').toFormat('LLLL');
    let secondMonth = activeWeek.endOf('week').toFormat('LLLL');
    let firstYear = activeWeek.startOf('week').toFormat('yyyy');
    let secondYear = activeWeek.endOf('week').toFormat('yyyy');
    let displayReturn = '';
    if (firstMonth !== secondMonth) {
      if (firstYear !== secondYear) {
        displayReturn = `${firstMonth} ${firstYear} - ${secondMonth} ${secondYear}`
      } else {
        displayReturn = `${firstMonth} - ${secondMonth} ${firstYear}`
      }
    } else {
      displayReturn = activeWeek.startOf('week').toFormat('LLLL yyyy')
    }
    return displayReturn
  };

  const handleWeekChange = (action) => {
    action === 'forward' ?
      setactiveWeek(activeWeek.plus({ week: 1 })) :
      setactiveWeek(activeWeek.minus({ week: 1 }))
  }

  const getWeekDays = (activeWeek) => {
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

  /* DAY */

  /* EVENT */

  /* RENDER */

  const handleCreate = (id) => {
    setactiveEvent(id)
    setmodalMode('create')
    setactiveModal(true)
  }

  const handleEdit = (id) => {
    setactiveEvent(id)
    setmodalMode('edit')
    setactiveModal(true)
  }

  return (
    <div className='calendar'>
      <CalendarContext.Provider value={{ cellRange, columnHeight, eventList, seteventList, week, handleEdit, id: activeEventId }}>
        {activeModal ?
          <Modal
            duration={cellDuration}
            active={setactiveModal}
            modalMode={modalMode} /> :
          null}
        <div className="calendar-weekControl">
          <span className="calendar-weekControl__left" onClick={() => handleWeekChange('back')}>
            <i className="fas fa-arrow-circle-left"></i>
          </span>
          <h1 className="calendar-weekControl__month">
            {displayMonthYear}
          </h1>
          <span className="calendar-weekControl__right" onClick={() => handleWeekChange('forward')}>
            <i className="fas fa-arrow-circle-right"></i>
          </span>
        </div>
        <div className='calendar-header'><div className='calendar-header__element-first'></div>
          {weekDays.length > 0 ? weekDays.map((day) => (
            <div key={day.formatted.letters} className='calendar-header__element'>
              <span className='calendar-letters'>
                {day.formatted.letters}
              </span>
              <span className={
                today.hasSame(day.date, 'day') ?
                  'calendar-today' :
                  'calendar-notToday'
              }>
                {day.formatted.number}
              </span>
            </div>
          )) : null}
        </div>
        <Grid
          cellRange={cellRange}
          handleCreate={handleCreate}
        />
      </CalendarContext.Provider>
    </div>
  )
}

export default Calendar
