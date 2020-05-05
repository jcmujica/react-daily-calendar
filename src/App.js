import React from 'react';
import './App.scss';
import '../node_modules/@fortawesome/fontawesome-free/css/all.css'
import Calendar from './components/Calendar/Calendar';
import UserContextProvider from './contexts/UserContext';
import CalendarContextProvider from './contexts/CalendarContext';
import Sidebar from './components/Sidebar/Sidebar';
import LogRocket from 'logrocket';

// if (process.env.NODE_ENV !== 'production') {
//   const { whyDidYouUpdate } = require('why-did-you-update')
//   whyDidYouUpdate(React)
// }
// LogRocket.init('0oolaq/calendar');

function App() {
  return (
    <div className="App">
      <UserContextProvider>
        <CalendarContextProvider>
          <div className="columns">
            <div className="column is-narrow calendar-leftColumn">
              <Sidebar />
            </div>
            <div className="column calendar-rightColumn">
              <Calendar />
            </div>
          </div>
        </CalendarContextProvider>
      </UserContextProvider>
    </div>
  );
}

export default App;
