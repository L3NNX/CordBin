// pages/OAuthSuccess.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OAuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;

    if (!hash.includes("accessToken=")) {
      navigate("/");
      return;
    }

    const token = hash.split("accessToken=")[1];

    // store token
    localStorage.setItem("accessToken", token);

    // clean URL (remove token from address bar)
    window.history.replaceState({}, document.title, "/");

    // go to dashboard
    navigate("/dashboard");
  }, []);

  return null;
}
