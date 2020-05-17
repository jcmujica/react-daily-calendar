import React, { useEffect, useRef } from 'react';
import { DateTime } from 'luxon';
import bulmaCalendar from '../../../node_modules/bulma-calendar/dist/js/bulma-calendar';
function DateInput({ displayMode, modalSelectedDate, setModalSelectedDate, dateChanged, setDateChanged }) {
  const monthCalendarRef = useRef();
  const selectedDate = useRef(null);

  useEffect(() => {
    console.log('DateInput', modalSelectedDate)
    if (DateTime.fromMillis(parseInt(modalSelectedDate)).toISO() && selectedDate !== modalSelectedDate) {
      console.log('DateInput in', modalSelectedDate)
      let date = new Date(DateTime.fromMillis(parseInt(modalSelectedDate)).toISO());

      const calendars = bulmaCalendar.attach('[type="date"]', {
        displayMode: displayMode,
        type: 'date',
        weekStart: 1,
        showClearButton: false,
        dataIsRange: false,
        showHeader: false,
        enableYearSwitch: true,
        startDate: date
      });
      calendars.forEach((calendar) => {
        calendar.on('date:selected', (date) => {
        });
      });
      const element = monthCalendarRef.current;
      if (element) {
        element.bulmaCalendar.on('select', (datepicker) => {
          selectedDate.current = datepicker.data.value();
          setModalSelectedDate(selectedDate.current);
          setDateChanged(true)
        });
      };
    }

  }, [modalSelectedDate, displayMode, setDateChanged, setModalSelectedDate]);


  return (
    <div className="calendar-bulmaCalendar">
      <input ref={monthCalendarRef} type="date" className="is-small" />
    </div>
  )
};

export default DateInput;
