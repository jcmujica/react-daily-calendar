import React, { useState, useEffect, useContext, useMemo } from 'react';
import { DateTime, Duration } from 'luxon';
import Modal from '../Modal/Modal';
import Grid from '../Grid/Grid';
import { CalendarContext } from '../../contexts/CalendarContext';



function Calendar() {
  const { timeRange, setactiveModal, activeModal, modalMode, activeWeek, setactiveWeek, viewMode, setviewMode, setdayViewDay } = useContext(CalendarContext);
  const today = DateTime.local();
  const [displayMonthYear, setdisplayMonthYear] = useState(today.startOf('week').toFormat('LLLL yyyy'));
  const [weekDays, setweekDays] = useState([]);
  const [week, setweek] = useState([[], [], [], [], [], [], []]);
  const cellDuration = Duration.fromObject({ minutes: timeRange });
  const startTime = Duration.fromObject({ hours: 8 });
  const endTime = Duration.fromObject({ hours: 20 });
  const start = today.startOf('day');
  const end = today.endOf('day');
  const range = Math.ceil(end.diff(start, ['hours']).hours);


  useMemo(() => {
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
    setweekDays(dayDisplay);
    setdisplayMonthYear(activeWeek.startOf('week').toFormat('LLLL yyyy'));
  }, [activeWeek]);

  const handleWeekChange = (action) => {
    if (action === 'forward') {
      setactiveWeek(activeWeek.plus({ week: 1 }));
    } else if (action === 'back') {
      setactiveWeek(activeWeek.minus({ week: 1 }));
    } else if (action === 'today') {
      setactiveWeek(today.startOf('week'));
    }
  }

  const handleDayView = (date) => {
    setviewMode('day');
    console.log(date.ts)
    setdayViewDay(date.ts.toString());
  }

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
          <button className="button is-small" onClick={() => handleWeekChange('back')}><i className="fas fa-chevron-left"></i></button>
          <button className="button is-small" onClick={() => handleWeekChange('forward')}><i className="fas fa-chevron-right"></i></button>
          <button className="button is-small is-primary" onClick={() => handleWeekChange('today')}><span>Today</span></button>
          <h1 className="title">
            {displayMonthYear}
          </h1>
        </div>
        {/* <div className="level-item" >
          </div> */}
      </nav>
      <div className='calendar-header'><div className='calendar-header__element-first'></div>
        {weekDays.length > 0 ? weekDays.map((day) => (
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

export default Calendar
