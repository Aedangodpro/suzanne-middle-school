import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./boot.scss";

const BOARD_LOGO =
  "https://i.postimg.cc/C5WctqxC/murder-drones-logo-updated-again-by-bunobunart-dgscfc4-pre.png";

const TIMING = {
  startup: { firmware: 1400, windows: 2600, welcome: 1400 },
  restart: { firmware: 1900, windows: 2900, welcome: 1600 },
  fade: 420,
  shutdown: 2400,
};

export const WindowsMark = () => (
  <div className="winMark" aria-hidden="true">
    <span></span>
    <span></span>
    <span></span>
    <span></span>
  </div>
);

export const WindowsSpinner = ({ className = "" }) => (
  <div
    className={"winDots " + className}
    role="progressbar"
    aria-label="Loading"
  >
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <i key={i} style={{ "--i": i }}></i>
    ))}
  </div>
);

export const BootSequence = () => {
  const wall = useSelector((state) => state.wallpaper);
  const dispatch = useDispatch();
  const shutdn = wall.act === "shutdn";
  const [stage, setStage] = useState(shutdn ? "shutdown" : "firmware");
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timers = [];
    setExiting(false);

    if (shutdn) {
      setStage("shutdown");
      timers.push(setTimeout(() => setStage("off"), TIMING.shutdown));
      return () => timers.forEach(clearTimeout);
    }

    const timing = wall.act === "restart" ? TIMING.restart : TIMING.startup;
    setStage("firmware");

    const winAt = timing.firmware;
    const welcomeAt = winAt + timing.windows;
    const fadeAt = welcomeAt + timing.welcome;

    timers.push(setTimeout(() => setStage("windows"), winAt));
    timers.push(setTimeout(() => setStage("welcome"), welcomeAt));
    timers.push(setTimeout(() => setExiting(true), fadeAt));
    timers.push(
      setTimeout(() => dispatch({ type: "WALLBOOTED" }), fadeAt + TIMING.fade)
    );

    return () => timers.forEach(clearTimeout);
  }, [wall.act, shutdn, dispatch]);

  useEffect(() => {
    if (stage !== "off") return;

    const wake = (event) => {
      if (
        event.type === "keydown" &&
        (event.ctrlKey || event.altKey || event.metaKey)
      ) {
        return;
      }

      dispatch({ type: "WALLRESTART" });
    };

    window.addEventListener("mousedown", wake);
    window.addEventListener("keydown", wake);

    return () => {
      window.removeEventListener("mousedown", wake);
      window.removeEventListener("keydown", wake);
    };
  }, [stage, dispatch]);

  return (
    <div className="bootSeq" data-stage={stage} data-exiting={exiting}>
      {stage === "firmware" && (
        <div className="bootStage fwStage">
          <img
            className="boardLogo"
            src={BOARD_LOGO}
            alt="N's PC"
            draggable="false"
          />
          <div className="fwBrand">N'S PC</div>
          <div className="fwHint">
            Press <kbd>DEL</kbd> to enter BIOS Setup
          </div>
        </div>
      )}

      {stage === "windows" && (
        <div className="bootStage winStage">
          <WindowsMark />
          <WindowsSpinner className="bootDots" />
        </div>
      )}

      {stage === "welcome" && (
        <div className="bootStage welcomeStage">
          <div className="welcomeGlow"></div>
          <div className="welcomeText">Welcome</div>
          <WindowsSpinner className="welcomeDots" />
        </div>
      )}

      {stage === "shutdown" && (
        <div className="bootStage shutdownStage">
          <WindowsSpinner className="shutdownDots" />
          <div className="shutdownText">Shutting down</div>
        </div>
      )}

      {stage === "off" && (
        <div className="powerHint">Press any key to power on</div>
      )}
    </div>
  );
};
