"use client";
import { useAuth } from "@/contexts/auth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useLoader } from "@/contexts/loading";
import axiosApi from "@/utils/api/axiosapi";
function Page() {
  //@ts-ignore
  const { setLoading } = useLoader();
  const { isLogged, refresh, setLogout } = useAuth();
  const router = useRouter();
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const fetcher = async () => {
    const { Logged, isVerified } = await isLogged();
    setIsLoading(false);
    if (Logged) {
      if (isVerified) {
        router.push("/events");
      } else {
        setLoading(false);
      }
    } else {
      router.push("/login");
    }
  };
  useEffect(() => {
    fetcher();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  let retry = false;
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setCodeError("");
    if (parseInt(code) < 100000000 && parseInt(code) >= 10000000) {
      await axiosApi
        .post("/verifyemail", { code })
        .then(async (res) => {
          await fetcher();
          setLoading(false);
        })
        .catch(async (err) => {
          const status = err.response?.status;
          switch (status) {
            case 400:
              setCodeError("invalid code");
              setLoading(false);
              break;
            case 404:
              setLogout();
              break;
            case 401:
              setLoading(false);
              console.log(retry);
              if (!retry) {
                retry = true;
                await refresh();
                await handleSubmit(e);
              } else {
                setLogout();
              }
              break;
          }
        });
    } else {
      setLoading(false);
      setCodeError("invalid code");
    }
  };
  const sendMail = async (e) => {
    e.preventDefault();
    setLoading(true);
    axiosApi
      .get("/resendmail")
      .then((res) => {
        setLoading(false);
      })
      .catch(async (err) => {
        const status = err.response?.status;
        switch (status) {
          case 404:
            setLogout();
            break;
          case 401:
            setLoading(false);
            if (!retry) {
              retry = true;
              await refresh();
              await sendMail(e);
            } else {
              setLogout();
            }
            break;
        }
      });
  };
  return isLoading ? null : (
        <div >
          <h2>Verify your Email</h2>
          <div className="inbox">
            <input
              type="text"
              required
              onChange={(e) => setCode(e.target.value)}
              value={code}
            />
            <span>Write the code here</span>
            <i></i>
            {codeError.length > 0 && (
              <div className="inputError">{codeError}</div>
            )}
          </div>
          <button type="submit" className="btn-forget" onClick={handleSubmit}>
            send
          </button>
          <button
            type="submit"
            className="btn-forget"
            style={{ width: "150px", left: "40px" }}
            onClick={sendMail}
          >
            resend mail
          </button>
        </div>
  );
}

export default Page;
