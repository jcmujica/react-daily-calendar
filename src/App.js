import React from 'react';
import './App.scss';
import '../node_modules/@fortawesome/fontawesome-free/css/all.css'
import LayoutContextProvider from './contexts/LayoutContext';
import Layout from './layouts/Layout';

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
