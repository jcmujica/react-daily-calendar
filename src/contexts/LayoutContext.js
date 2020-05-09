import React, { createContext, useState } from 'react';

export const LayoutContext = createContext();

function LayoutContextProvider(props) {
  const [sideBarToggled, setSideBarToggled] = useState(false);

  return (
    <LayoutContext.Provider value={{ sideBarToggled, setSideBarToggled }}>
      {props.children}
    </LayoutContext.Provider>
  )
}

export default LayoutContextProvider
