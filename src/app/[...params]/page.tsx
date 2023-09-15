"use client";

import { useAuth } from "@/contexts/auth";
import { useLoader } from "@/contexts/loading";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const NotFound = () => {
  //@ts-ignore
  const { setLoading } = useLoader();
  //@ts-ignore
  const { isLogged } = useAuth();
  const router = useRouter();
  useEffect(() => {
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div>
      <h2>Page not found</h2>
      <button
        type="submit"
        onClick={() => router.push("/")}
        style={{ width: "150px" }}
      >
        go Home page
      </button>
    </div>
  );
};

export default NotFound;
