"use client";
import { useAuth } from "@/contexts/auth";
import { useLoader } from "@/contexts/loading";
import axiosApi from "@/utils/api/axiosapi";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

function Page() {
  const { userId } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const [first, setfirst] = useState("");
  const [password, setPassword] = useState("");
  const [confpass, setConfpass] = useState("");
  const [confError, setConfError] = useState("");
  const [passError, setPassError] = useState("");
  //@ts-ignore
  const { isLogged } = useAuth();
  //@ts-ignore
  const { setLoading } = useLoader();
  const fetcher = async () => {
    const { Logged, isVerified } = await isLogged();
    await axiosApi
      .get(`/resetpassword/${userId}?code=${code}`)
      .then((res) => {});
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
  const handleConfirm = async (e) => {
    e.preventDefault();
    setLoading(true);
    const trimmedPassword = password.trim();
    const trimmedConfpass = confpass.trim();
    setConfError("");
    setPassError("");
    if (trimmedPassword.length >= 8 && trimmedPassword === trimmedConfpass) {
      await axiosApi
        .put(`/resetpassword/${userId}?code=${code}`, {
          password: trimmedPassword,
          confpass: trimmedConfpass,
        })
        .then((res) => {
          setLoading(false);
          router.push("/login");
        })
        .catch((err) => {
          setLoading(false);
          const status = err.response?.status;
          switch (status) {
            case 404:
              router.push("/");
              break;
            case 403:
            case 429:
              setPassError("try another time");
              break;
            case 400:
              setConfError("Confirm mismatch");
              break;
          }
        });
    } else {
      setLoading(false);
      if (trimmedPassword.length < 8) {
        setPassError("Password very short");
      } else if (trimmedPassword !== trimmedConfpass) {
        setConfError("Confirm mismatch");
      }
    }
  };
  return (
    <div>
      <h2>Sign in</h2>
      <div className="inbox">
        <input
          type="password"
          required
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <span>Password</span>
        <i></i>
        {passError.length > 0 && <div className="inputError">{passError}</div>}
      </div>
      <div className="inbox">
        <input
          type="password"
          required
          onChange={(e) => setConfpass(e.target.value)}
          value={confpass}
        />
        <span>Confirm Password</span>
        <i></i>
        {confError.length > 0 && <div className="inputError">{confError}</div>}
      </div>
      <button type="submit" className="btn-forget" onClick={handleConfirm}>
        Confirm
      </button>
    </div>
  );
}

export default Page;
