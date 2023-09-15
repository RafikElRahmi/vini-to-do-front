"use client";
import { useTheme } from "@/contexts/themes/useTheme";
import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingModal from "@/components/Loading";
import { useLoader } from "@/contexts/loading";
import NavBar from "./navBar";
const Body = ({ children }) => {
  const { getModeTheme } = useTheme();
  const mode = getModeTheme();
  useEffect(() => {
    const bodyElement = document.body;
    if (bodyElement) {
      bodyElement.classList.remove(bodyElement.classList[0]);
      bodyElement.classList.remove(bodyElement.classList[0]);
      const classes = mode.split(' ')
       bodyElement.classList.add(classes[0]);
       bodyElement.classList.add(classes[1]);
     }
  }, [mode]);
  //@ts-ignore
  const { isLoading } = useLoader();
  return (
    <body>
      {isLoading && <LoadingModal />}
      <NavBar />
      {children}
    </body>
  );
};

export default Body;
