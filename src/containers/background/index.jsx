import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Battery from "../../components/shared/Battery";
import { Icon, Image } from "../../utils/general";
import "./back.scss";

export const Background = () => {
  const wall = useSelector((state) => state.wallpaper);
  const dispatch = useDispatch();
  const src =
    wall.src && wall.src.includes("http")
      ? wall.src
      : `img/wallpaper/${wall.src}`;

  return (
    <div
      className="background"
      style={{
        backgroundImage: `url(${src})`,
      }}
    ></div>
  );
};

export const BootScreen = (props) => {
  const dispatch = useDispatch();
  const wall = useSelector((state) => state.wallpaper);
  const [blackout, setBlackOut] = useState(false);

  useEffect(() => {
    if (props.dir < 0) {
      setTimeout(() => {
        console.log("blackout");
        setBlackOut(true);
      }, 4000);
    }
  }, [props.dir]);

  useEffect(() => {
    if (props.dir < 0) {
      if (blackout) {
        if (wall.act == "restart") {
          setTimeout(() => {
            setBlackOut(false);
            setTimeout(() => {
              dispatch({ type: "WALLBOOTED" });
            }, 4000);
          }, 2000);
        }
      }
    }
  }, [blackout]);

  return (
    <div className="bootscreen">
      <div className={blackout ? "hidden" : ""}>
        <Image src="asset/bootlogo" w={180} />
        <div className="mt-48" id="loader">
          <svg
            className="progressRing"
            height={48}
            width={48}
            viewBox="0 0 16 16"
          >
            <circle cx="8px" cy="8px" r="7px"></circle>
          </svg>
        </div>
      </div>
    </div>
  );
};

export const LockScreen = (props) => {
  const wall = useSelector((state) => state.wallpaper);
  const [lock, setLock] = useState(false);
  const [unlocked, setUnLock] = useState(false);
  const [password, setPass] = useState("");
  const [error, setError] = useState(false);
  const dispatch = useDispatch();

  const userName = useSelector((state) => state.setting.person.name);

  const action = (e) => {
    var act = e.target.dataset.action;

    if (act == "splash") setLock(true);
    else if (act == "inpass") {
      setPass(e.target.value);
      setError(false);
    }
  };

  const proceed = () => {
    if (unlocked) return;

    if (password !== "0324") {
      setError(true);
      setPass("");
      return;
    }

    setUnLock(true);
    setTimeout(() => {
      dispatch({ type: "WALLUNLOCK" });
    }, 1000);
  };

  const action2 = (e) => {
    if (e.key == "Enter") proceed();
  };

  return (
    <div
      className={"lockscreen " + (props.dir == -1 ? "slowfadein" : "")}
      data-unlock={unlocked}
      style={{
        backgroundImage: `url(${`img/wallpaper/lock.jpg`})`,
      }}
      onClick={action}
      data-action="splash"
      data-blur={lock}
    >
      <div className="splashScreen mt-40" data-faded={lock}>
        <div className="text-6xl font-semibold text-gray-100">
          {new Date().toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          })}
        </div>
        <div className="text-lg font-medium text-gray-200">
          {new Date().toLocaleDateString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>
      <div className="fadeinScreen" data-faded={!lock} data-unlock={unlocked}>
        <Image
          className="rounded-full overflow-hidden"
          src="https://i.postimg.cc/L8Rnmwdt/download.jpg"
          w={200}
          ext
        />
        <div className="mt-2 text-2xl font-medium text-gray-200">
          {userName}
        </div>
        <div className="signInRow" data-error={error}>
          <input
            type="password"
            className="passInput"
            value={password}
            onChange={action}
            data-action="inpass"
            onKeyDown={action2}
            placeholder="Password"
            aria-label="Password"
            autoComplete="current-password"
          />
          <button
            type="button"
            className="signInArrow"
            aria-label="Sign in"
            onClick={proceed}
          >
            <Icon fafa="faArrowRight" width={14} color="currentColor" />
          </button>
        </div>
        <div className="signInError" data-visible={error}>
          Incorrect password. Try again.
        </div>
        <div className="text-xs text-gray-400 mt-6">Sign-in options</div>
      </div>
      <div className="bottomInfo flex">
        <Icon className="mx-2" src="wifi" ui width={16} invert />
        <Battery invert />
      </div>
    </div>
  );
};
