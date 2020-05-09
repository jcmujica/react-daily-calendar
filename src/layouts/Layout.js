import React, { useContext } from 'react';
import Calendar from '../components/Calendar/Calendar';
import UserContextProvider from '../contexts/UserContext';
import CalendarContextProvider from '../contexts/CalendarContext';
import Sidebar from '../components/Sidebar/Sidebar';
import { LayoutContext } from '../contexts/LayoutContext';

function Layout() {
  const { sideBarToggled } = useContext(LayoutContext);

  return (
    <div>
      <UserContextProvider>
        <CalendarContextProvider>
          <div className="columns">
            <div className={`column calendar-leftColumn is-narrow ${sideBarToggled ? `calendar-sidebar__toggleBar` : ``}`}>
              <Sidebar />
            </div>
            <div className="column calendar-rightColumn">
              <Calendar />
            </div>
          </div>
        </CalendarContextProvider>
      </UserContextProvider>
    </div>
  )
}

export default Layout
