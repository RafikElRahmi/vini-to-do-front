"use client";
import { useLoader } from "@/contexts/loading";
import SideBar from "./sidebar";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth";

function NavBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { isLogged, setLogout } = useAuth();
  //@ts-ignore
  const { setLoading } = useLoader();
  const [toggle, setToggle] = useState(true);
  const [isUserLogged, setIsLogged] = useState(false);
  const fetcher = async () => {
    const { Logged } = await isLogged();
    if (Logged) {
      setIsLogged(true);
    } else {
      setIsLogged(false);
    }
  };
  useEffect(() => {
    fetcher();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
  const handleToggle = () => {
    setToggle(!toggle);
  };
  return (
    <div>
      <nav>
        <div className="menu-toggle" onClick={handleToggle}>
          <div></div>
          <div></div>
          <div></div>
        </div>
        {isUserLogged ? (
          <div className="btn-nav">
            <button
              onClick={() => {
                setLogout();
                setLoading(true);
              }}
            >
              logout
            </button>
          </div>
        ) : (
          <div className="btn-nav">
            <button
              onClick={() => {
                if (pathname != "/login") {
                  setLoading(true);
                }
                router.push("/login");
              }}
            >
              login
            </button>
            <button
              onClick={() => {
                if (pathname != "/register") {
                  setLoading(true);
                }
                router.push("/register");
              }}
            >
              register
            </button>
          </div>
        )}
      </nav>
      {toggle && <SideBar />}
    </div>
  );
}

export default NavBar;
