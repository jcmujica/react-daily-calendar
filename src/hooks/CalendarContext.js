import React, { useState } from 'react';

const CalendarContext = React.createContext([{}, () => { }]);

const CalendarProvider = (props) => {
  const [state, setstate] = useState({});
  return (
    <CalendarContext.Provider value={[state, setstate]}>
      {props.children}
    </CalendarContext.Provider>
  );
}

export { CalendarContext, CalendarProvider };