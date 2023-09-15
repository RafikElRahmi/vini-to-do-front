"use client";
import LoadingModal from "@/components/Loading";
import { useLoader } from "@/contexts/loading";
import { useAuth } from "@/contexts/auth";
import axiosApi from "@/utils/api/axiosapi";
import { isEmailValid } from "@/utils/form/emailvalidation";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { tokenization } from "@/utils/auth/token";

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  //@ts-ignore
  const { isLogged } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userError, setUserError] = useState("");
  const [passError, setPassError] = useState("");
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
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();
    const trimmedEmail = email.trim();
    const isValid = isEmailValid(trimmedEmail);
    setUserError("");
    setMailError("");
    setPassError("");
    if (trimmedPassword.length >= 8 && trimmedUsername.length >= 6 && isValid) {
      await axiosApi
        .post("/register", {
          username: trimmedUsername,
          email: trimmedEmail,
          password: trimmedPassword,
        })
        .then((res) => {
          tokenization(res);
           router.push("/events");
        })
        .catch((err) => {
          setLoading(false);
          const status = err.response?.status;
          const message = err.response?.data;
          switch (status) {
            case 400:
              setUserError("username not found");
              break;
            case 409:
              if (message === "email") {
                setMailError("email already exist");
              } else if (message === "username") {
                setUserError("username already exist");
              }
              break;
            case 422:
              setMailError("email does not exist");
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
      if (!isValid) {
        setMailError("invalid email");
      }
    }
  };
  return isLoading ? null : (
    
        <div>
          <h2>Sign up now!</h2>
          <div className="inbox">
            <input
              type="text"
              required
              onChange={(e) => setUsername(e.target.value)}
              value={username}
            />
            <span>Username</span>
            <i> </i>
            {userError.length > 0 && (
              <div className="inputError">{userError}</div>
            )}
          </div>
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
          <div className="inbox">
            <input
              type="password"
              required
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <span>Password</span>
            <i></i>
            {passError.length > 0 && (
              <div className="inputError">{passError}</div>
            )}
          </div>
          <button type="submit" onClick={handleRegister}>
            Sign up
          </button>
        </div>
  );
}
