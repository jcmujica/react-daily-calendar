import React from 'react';
import './App.scss';
import '../node_modules/@fortawesome/fontawesome-free/css/all.css'
import Calendar from './components/Calendar/Calendar';

// if (process.env.NODE_ENV !== 'production') {
//   const { whyDidYouUpdate } = require('why-did-you-update')
//   whyDidYouUpdate(React)
// }

function App() {
  return (
    <div className="App">
      {/* <Calendar /> */}
      <Calendar />
    </div>
  );
}

export default App;
