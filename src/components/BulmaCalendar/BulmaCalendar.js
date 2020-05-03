import React, { useEffect, useContext, useRef } from 'react'
import { DateTime } from 'luxon';
import { CalendarContext } from '../../contexts/CalendarContext';
import bulmaCalendar from '../../../node_modules/bulma-calendar/dist/js/bulma-calendar';

function BulmaCalendar() {
  const monthCalendarRef = useRef();
  const { setactiveWeek } = useContext(CalendarContext);
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
        let selected = DateTime.fromFormat(datepicker.data.value(), 'D').ts
        setactiveWeek(DateTime.fromMillis(parseInt(selected)).startOf('week'));
      });
    };

  }, [])
  return (
    <div className="calendar-bulmaCalendar">
      <input ref={monthCalendarRef} type="date" />
    </div>
  )
};

export default BulmaCalendar;
