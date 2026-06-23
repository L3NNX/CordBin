// // pages/OAuthSuccess.jsx
// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// export default function OAuthSuccess() {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const hash = window.location.hash;

//     if (!hash.includes("accessToken=")) {
//       navigate("/");
//       return;
//     }

//     const token = hash.split("accessToken=")[1];

//     // store token
//     localStorage.setItem("accessToken", token);

//     // clean URL (remove token from address bar)
//     window.history.replaceState({}, document.title, "/");

//     // go to dashboard
//     navigate("/dashboard");
//   }, []);

//   return null;
// }


import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function OAuthSuccess() {
  const navigate = useNavigate();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const searchParams = new URLSearchParams(window.location.search);

    const token =
      hashParams.get("accessToken") ||
      hashParams.get("access_token") ||
      searchParams.get("accessToken") ||
      searchParams.get("access_token");

    if (!token) {
      navigate("/", { replace: true });
      return;
    }

    localStorage.setItem("accessToken", token);

    // clean URL (remove hash/query)
    window.history.replaceState({}, document.title, window.location.pathname);

    navigate("/dashboard", { replace: true });
  }, [navigate]);

  return null;
}