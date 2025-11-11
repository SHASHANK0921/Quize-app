// Context.jsx
import React, { createContext, useState } from "react";
import QuzeData from "./QuzeData.json";
import Router from "./Router";

export const MyContext = createContext();

const Context = () => {
  const [data, setData] = useState(QuzeData);
  const [index, setIndex] = useState(0);

  return (
    <MyContext.Provider value={{ data, setData, index, setIndex }}>
      <Router />
    </MyContext.Provider>
  );
};

export default Context;
