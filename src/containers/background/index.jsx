import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Battery from "../../components/shared/Battery";
import { Icon, Image } from "../../utils/general";
import { verifyPassword } from "../../utils/lock";
import "./back.scss";

export const Background = () => {
  const wall = useSelector((state) => state.wallpaper);
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

export const LockScreen = (props) => {
  const wall = useSelector((state) => state.wallpaper);
  const [lock, setLock] = useState(false);
  const [unlocked, setUnLock] = useState(false);
  const [password, setPass] = useState("");
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(false);
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

  const proceed = async () => {
    if (unlocked || checking) return;

    setChecking(true);
    const valid = await verifyPassword(password);
    setChecking(false);

    if (!valid) {
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
            disabled={checking}
          />
          <button
            type="button"
            className="signInArrow"
            aria-label="Sign in"
            aria-busy={checking}
            disabled={checking}
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

export { BootSequence } from "./boot";
export { RepairScreen } from "./repair";
