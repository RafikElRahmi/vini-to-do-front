'use client'
import { createContext, useContext, useState } from "react";
  //@ts-ignore
const LoaderContext = createContext();

export function Loader({ children }) {
  //@ts-ignore
  const [isLoading, setLoading]  = useState(true);

  return (
    <LoaderContext.Provider value={{ isLoading, setLoading }}>
      {children}
    </LoaderContext.Provider>
  );
}
export const useLoader = () => {
  const loaderContext = useContext(LoaderContext);
  return loaderContext;
};
export default Loader;
