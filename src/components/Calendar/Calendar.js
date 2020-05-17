import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import { DateTime, Duration } from 'luxon';
import Modal from '../Modal/Modal';
import Grid from '../Grid/Grid';
import { CalendarContext } from '../../contexts/CalendarContext';
import useTraceUpdate from '../../hooks/useTraceUpdate'



function Calendar() {
  console.log('Calendar in')
  // useTraceUpdate(props);
  const { timeRange, setactiveModal, activeModal, modalMode, activeWeek, setactiveWeek, viewMode, setviewMode, dayViewDay, setdayViewDay, setScrolled } = useContext(CalendarContext);
  const today = DateTime.local();
  const [displayMonthYear, setdisplayMonthYear] = useState(today.startOf('week').toFormat('LLLL yyyy'));
  const [displayDays, setDisplayDays] = useState([]);
  const [week, setweek] = useState([[], [], [], [], [], [], []]);
  const cellDuration = Duration.fromObject({ minutes: timeRange });
  const start = today.startOf('day');
  const end = today.endOf('day');
  const range = Math.ceil(end.diff(start, ['hours']).hours);




  useMemo(() => {
    console.log('Memo ran')
    console.log('Memo ran: ', activeWeek)
    console.log('Memo ran: ', viewMode)

    /* Start of week array creation */
    let dur = cellDuration;
    let rate = 60 / timeRange;
    let slotRange = (range * rate);
    let week = [[], [], [], [], [], [], []];
    let weekDay = '';
    for (let k = 0; k < week.length; k++) {
      weekDay = activeWeek.plus({ days: k });
      for (let i = 0; i <= slotRange; i++) {
        if (i !== slotRange) {
          week[k].push(weekDay.plus(dur * i).toMillis().toString());
        } else {
          week[k].push(weekDay.plus((dur - 1) * i).toMillis().toString());
        }
      }
    }
    let controlDay = [...week[0]];
    controlDay = controlDay.map(day => DateTime.fromMillis(parseInt(day)).toLocaleString(DateTime.TIME_SIMPLE));
    week.unshift(controlDay);

    /* End of week array creation */
    /* Start of formatted day display */

    let dayDisplay = []
    for (let i = 0; i < 7; i++) {
      let dayOfWeek = activeWeek.plus({ days: i })
      let dayDisplayFormat = {
        letters: dayOfWeek.toFormat('EEE'),
        number: dayOfWeek.toFormat('dd')
      }
      dayDisplay = [...dayDisplay, {
        formatted: dayDisplayFormat,
        date: dayOfWeek
      }]
    };
    /* End of formatted day display */

    /* Start of Month and Year Display */
    let firstMonth = activeWeek.startOf('week').toFormat('LLLL');
    let secondMonth = activeWeek.endOf('week').toFormat('LLLL');
    let firstYear = activeWeek.startOf('week').toFormat('yyyy');
    let secondYear = activeWeek.endOf('week').toFormat('yyyy');
    let formattedMonthYear = '';
    if (firstMonth !== secondMonth) {
      if (firstYear !== secondYear) {
        formattedMonthYear = `${firstMonth} ${firstYear} / ${secondMonth} ${secondYear}`
      } else {
        formattedMonthYear = `${firstMonth}/${secondMonth} ${firstYear}`
      }
    } else {
      formattedMonthYear = activeWeek.startOf('week').toFormat('LLLL yyyy')
    }
    /* End of Month and Year Display */
    setweek(week);
    if (viewMode === 'week') {
      setDisplayDays(dayDisplay);
    }
    setdisplayMonthYear(activeWeek.startOf('week').toFormat('LLLL yyyy'));
  }, [activeWeek.ts, viewMode]);

  const handleDayView = useCallback((date) => {
    setviewMode('day');
    setdayViewDay(date.ts.toString());
  }, [setviewMode, activeWeek, setdayViewDay]);

  const handleTimeSpanChange = useCallback((action) => {
    setScrolled(false);
    if (viewMode === 'week') {
      if (action === 'forward') {
        setactiveWeek(activeWeek.plus({ week: 1 }));
      } else if (action === 'back') {
        setactiveWeek(activeWeek.minus({ week: 1 }));
      } else if (action === 'today') {
        setactiveWeek(today.startOf('week'));
      }
    } else if (viewMode === 'day') {
      let newDay = DateTime.fromMillis(parseInt(dayViewDay));
      if (action === 'forward') {
        newDay = newDay.plus({ day: 1 });
        handleDayView(newDay);
        setactiveWeek(newDay.startOf('week'));
      } else if (action === 'back') {
        newDay = newDay.minus({ day: 1 });
        handleDayView(newDay);
        setactiveWeek(newDay.startOf('week'));
      } else if (action === 'today') {
        handleDayView(today);
        setactiveWeek(today.startOf('week'));
      }
    }
  }, [viewMode, handleDayView, setactiveWeek]);


  useEffect(() => {
    if (dayViewDay) {
      let date = DateTime.fromMillis(parseInt(dayViewDay));
      setDisplayDays([{
        formatted: {
          letters: date.toFormat('EEE'),
          number: date.toFormat('dd')
        },
        date: date
      }]);
    }
  }, [dayViewDay]);

  const handleViewChange = useCallback((e) => {
    setScrolled(false);
    setviewMode(e.target.value);
    if (e.target.value === 'day') {
      handleDayView(activeWeek.startOf('week'));
    }
  }, [setScrolled, setviewMode, handleDayView, activeWeek])

  return (
    <div className='calendar'>
      {activeModal ?
        <Modal
          week={week}
          duration={cellDuration}
          active={setactiveModal}
          modalMode={modalMode}
        /> :
        null}
      <nav className="level calendar-weekControl">
        <div className="level-left">
          <button className="button is-small" onClick={() => handleTimeSpanChange('back')}><i className="fas fa-chevron-left"></i></button>
          <button className="button is-small" onClick={() => handleTimeSpanChange('forward')}><i className="fas fa-chevron-right"></i></button>
          <button className="button is-small is-primary" onClick={() => handleTimeSpanChange('today')}><span>Today</span></button>
          <h1 className="title">
            {displayMonthYear}
          </h1>
        </div>
        <div className="level-right">
          <div className="select">
            <select value={viewMode} onChange={(e) => handleViewChange(e)}>
              <option value="week" >Week</option>
              <option value="day">Day</option>
            </select>
          </div>
        </div>
      </nav>
      <div className='calendar-header'><div className='calendar-header__element-first'></div>
        {displayDays.length > 0 ? displayDays.map((day) => (
          <div key={day.formatted.letters} className='calendar-header__element' onClick={() => handleDayView(day.date)}>
            <span className='calendar-letters'>
              {day.formatted.letters}
            </span>
            <span className=
              {
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
        cellRange={timeRange}
        week={week}
      />
    </div>
  )
}

export default Calendar;