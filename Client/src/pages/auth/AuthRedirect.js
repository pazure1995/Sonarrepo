import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserToken } from "../../services/AuthServices";

const AuthRedirect = ({ children }) => {
  const [state, setstate] = useState(false);
  const navigate = useNavigate();
  const token = getUserToken();

  function onUserNavigate() {
    setTimeout(() => {
      localStorage.clear();
      if ("caches" in window) {
        caches.keys().then((names) => {
          names.forEach((name) => {
            caches.delete(name);
          });
        });
        window.location.reload(true);
      }
      navigate("/");
      navigate("/");
    }, 3600000);
  }

  useEffect(() => {
    onUserNavigate();
    if (token) {
      setstate(true);
    } else {
      navigate("/");
    }
    // eslint-disable-next-line
  }, [children]);

  return state ? children : navigate("/");
};

export default AuthRedirect;
