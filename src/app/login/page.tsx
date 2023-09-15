"use client";
import axiosApi from "@/utils/api/axiosapi";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import LoadingModal from "@components/Loading";
import { stat } from "fs";
import Link from "next/link";
import { tokenization } from "@/utils/auth/token";
import { useLoader } from "@/contexts/loading";
import { useAuth } from "@/contexts/auth";

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userError, setUserError] = useState("");
  const [passError, setPassError] = useState("");
  //@ts-ignore
  const { setLoading } = useLoader();
  //@ts-ignore
  const { isLogged } = useAuth();
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
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();
    setUserError("");
    setPassError("");
    if (trimmedPassword.length >= 8 && trimmedUsername.length >= 6) {
      await axiosApi
        .post("/login", {
          username: trimmedUsername,
          password: trimmedPassword,
        })
        .then((res) => {
          tokenization(res);
          router.push("/events");
        })
        .catch((err) => {
          setLoading(false);
          const status = err.response?.status;
          switch (status) {
            case 400:
            case 404:
              setUserError("username not found");
              break;
            case 403:
              setPassError("wrong password");
              break;
          }
        });
    } else {
      setLoading(false);
      if (trimmedUsername.length < 8) {
        setUserError("invalid username");
      }
      if (trimmedPassword.length < 6) {
        setPassError("invalid password");
      }
    }
  };

  return isLoading ? null : (
    <div>
      <h2>Sign in</h2>
      <div className="inbox">
        <input
          type="text"
          required
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
        <span>Username</span>
        <i> </i>
        {userError.length > 0 && <div className="inputError">{userError}</div>}
      </div>
      <div className="inbox">
        <input
          type="password"
          required
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <span>Password</span>
        <i> </i>
        {passError.length > 0 && <div className="inputError">{passError}</div>}
      </div>
      <div className="links">
        <a
          onClick={(e) => {
            e.preventDefault();
            setLoading(true);
            router.push("/resetpassword");
          }}
        >
          Forget password
        </a>
        <a
          onClick={(e) => {
            e.preventDefault();
            setLoading(true);
            router.push("/register");
          }}
        >
          Signup
        </a>
      </div>
      <button type="submit" onClick={handleLogin}>
        login
      </button>
    </div>
  );
}
