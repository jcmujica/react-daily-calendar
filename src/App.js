import React from 'react';
import './App.scss';
import '../node_modules/@fortawesome/fontawesome-free/css/all.css'
import LayoutContextProvider from './contexts/LayoutContext';
import Layout from './layouts/Layout';

// if (process.env.NODE_ENV !== 'production') {
//   const { whyDidYouUpdate } = require('why-did-you-update')
//   whyDidYouUpdate(React)
// }
// LogRocket.init('0oolaq/calendar');

function App() {
  return (
    <div className="App">
      <LayoutContextProvider>
        <Layout />
      </LayoutContextProvider>
    </div>
  );
}

export default App;
