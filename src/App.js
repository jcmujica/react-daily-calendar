import React from 'react';
import './App.scss';
import '../node_modules/@fortawesome/fontawesome-free/css/all.css'
import Calendar from './components/Calendar/Calendar';
import UserContextProvider from './contexts/UserContext';
import Sidebar from './components/Sidebar/Sidebar';

// if (process.env.NODE_ENV !== 'production') {
//   const { whyDidYouUpdate } = require('why-did-you-update')
//   whyDidYouUpdate(React)
// }

function App() {
  return (
    <div className="App">
      <UserContextProvider>
        <div className="columns">
          <div className="column is-2 calendar-leftColumn">
            <Sidebar />
          </div>
          <div className="column is-10 calendar-rightColumn">
            <Calendar />
          </div>
        </div>
      </UserContextProvider>
    </div>
  );
}

export default App;
