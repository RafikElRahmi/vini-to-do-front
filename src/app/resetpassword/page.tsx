"use client";
import axiosApi from "@/utils/api/axiosapi";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth";
import { useState, useEffect } from "react";
import LoadingModal from "@components/Loading";
import { isEmailValid } from "@/utils/form/emailvalidation";
import { useLoader } from "@/contexts/loading";

export default function Reset() {
  const router = useRouter();
  const [email, setEmail] = useState("");const { isLogged } = useAuth();
  const [mailError, setMailError] = useState("");
  //@ts-ignore
  const { setLoading } = useLoader();
  const [isLoading, setIsLoading] = useState(true);
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
  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMailError("");
    const trimmedEmail = email.trim();
    const isValid = isEmailValid(trimmedEmail);
    if (isValid) {
      await axiosApi
        .post("/resetpassword", { email: trimmedEmail })
        .then((res) => {
          setLoading(false);
          console.log(res.data);
        })
        .catch((err) => {
          setLoading(false);
          const status = err.response?.status;
          switch (status) {
            case 404:
              setMailError("invalid email");
              break;
            case 422:
              setMailError("email doesnt exist");
              break;
            case 429:
              setMailError("try another time");
              break;
            case 504:
            case 500:
            case 503:
              router.push("/");
              break;
          }
        });
    } else {
      setLoading(false);
      setMailError("invalid email");
    }
  };
  return isLoading ? null : (
        <div >
          <h2>Sign in</h2>
          <div className="inbox">
            <input
              type="text"
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <span>Email</span>
            <i></i>
            {mailError.length > 0 && (
              <div className="inputError">{mailError}</div>
            )}
          </div>
          <button type="submit" className="btn-forget" onClick={handleReset}>
            login
          </button>
        </div>
  );
}
