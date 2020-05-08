import React, { useEffect, useContext, useRef } from 'react';
import { DateTime } from 'luxon';
import { CalendarContext } from '../../contexts/CalendarContext';
import bulmaCalendar from '../../../node_modules/bulma-calendar/dist/js/bulma-calendar';

function BulmaCalendar() {
  const monthCalendarRef = useRef();
  const { setactiveWeek, viewMode, setdayViewDay } = useContext(CalendarContext);
  useEffect(() => {
    const calendars = bulmaCalendar.attach('[type="date"]', {
      displayMode: 'inline',
      weekStart: 1,
      showClearButton: false,
      dataIsRange: false,
      showHeader: false
    });
    calendars.forEach((calendar) => {
      calendar.on('date:selected', (date) => {
      });
    });
    const element = monthCalendarRef.current;
    if (element) {
      element.bulmaCalendar.on('select', (datepicker) => {
        if (viewMode === 'week') {
          let selected = DateTime.fromFormat(datepicker.data.value(), 'D').ts;
          setactiveWeek(DateTime.fromMillis(parseInt(selected)).startOf('week'));
        } else if (viewMode === 'day') {
          let selected = DateTime.fromFormat(datepicker.data.value(), 'D').ts;
          setdayViewDay(DateTime.fromFormat(datepicker.data.value(), 'D').ts.toString());
          setactiveWeek(DateTime.fromMillis(parseInt(selected)).startOf('week'));
        }
      });
    };

  }, [viewMode]);
  return (
    <div className="calendar-bulmaCalendar">
      <input ref={monthCalendarRef} type="date" />
    </div>
  )
};

export default BulmaCalendar;
