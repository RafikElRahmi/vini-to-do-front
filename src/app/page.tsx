"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth";
import { useState, useEffect } from "react";
import { useLoader } from "@/contexts/loading";
function Page() {
  const router = useRouter();
  //@ts-ignore
  const { setLoading } = useLoader();
  const [isLoading, setIsLoading] = useState(true);
  //@ts-ignore
  const { isLogged } = useAuth();
  const fetcher = async () => {
    const { Logged, isVerified } = await isLogged();
    setIsLoading(false);
    if (Logged) {
      if (isVerified) {
        router.push("/events");
      } else {
        router.push("/verifyemail");
      }
    } else {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetcher();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div>
      <h2>Welcome to VINI-TO-DO</h2>
      <h2> Tired of missing important events and job tasks ? </h2>
      {/* eslint-disable-next-line react/no-unescaped-entities */}
      <h2>It's time to take control, get organized, and achieve success!</h2>
      <h2>
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        Join our to-do site today, and we'll make sure you never miss a task
        again.
      </h2>
    </div>
  );
}
export default Page;
