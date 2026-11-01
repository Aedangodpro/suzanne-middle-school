import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Icon } from "../../utils/general";
import { WindowsSpinner } from "./boot";

const troubleOptions = [
  [
    "Startup Repair",
    "Startup Repair couldn't repair your PC. Press 'Advanced options' to try other options.",
  ],
  ["Startup Settings", "Startup Settings aren't available for this PC."],
  [
    "Command Prompt",
    "Command Prompt is unavailable while Automatic Repair is running.",
  ],
  [
    "Uninstall Updates",
    "There are no recently installed updates to uninstall.",
  ],
  [
    "System Restore",
    "No restore points have been created on your PC's system drive.",
  ],
];

export const RepairScreen = () => {
  const dispatch = useDispatch();
  const [stage, setStage] = useState("preparing");
  const [page, setPage] = useState("repair");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const toDiagnosing = setTimeout(() => setStage("diagnosing"), 2600);
    const toOptions = setTimeout(() => setStage("ready"), 6200);

    return () => {
      clearTimeout(toDiagnosing);
      clearTimeout(toOptions);
    };
  }, []);

  if (stage !== "ready") {
    return (
      <div className="repairScreen" role="status" aria-live="polite">
        <div className="repairBootStage">
          <WindowsSpinner className="repairDots" />
          <div className="repairTitle">
            {stage === "preparing"
              ? "Preparing Automatic Repair"
              : "Diagnosing your PC"}
          </div>
          {stage === "diagnosing" ? (
            <div className="repairSub">Checking your PC for problems...</div>
          ) : null}
          <div className="repairProgress">
            <span></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="repairScreen">
      {page === "repair" && (
        <div className="recoveryPage">
          <h1 className="recoveryHeader">Automatic Repair</h1>
          <div className="recoveryBody">
            <p>Your PC did not start correctly.</p>
            <p>
              Press 'Restart' to restart your PC, which can sometimes fix the
              problem. You can also press 'Advanced options' to try other
              options to repair your PC.
            </p>
          </div>
          <div className="recoveryFooter">
            <button
              type="button"
              className="recoveryBtn"
              onClick={() => dispatch({ type: "WALLRESTART" })}
            >
              Restart
            </button>
            <button
              type="button"
              className="recoveryBtn primary"
              onClick={() => setPage("options")}
            >
              Advanced options
            </button>
          </div>
        </div>
      )}

      {page === "options" && (
        <div className="recoveryPage">
          <h1 className="recoveryHeader">Choose an option</h1>
          <div className="recoveryChoices">
            <button
              type="button"
              className="recoveryChoice"
              onClick={() => dispatch({ type: "REPAIRCLOSE" })}
            >
              <Icon fafa="faPlay" width={30} />
              <span>Continue</span>
            </button>
            <button
              type="button"
              className="recoveryChoice"
              onClick={() => {
                setPage("troubleshoot");
                setNotice("");
              }}
            >
              <Icon fafa="faScrewdriverWrench" width={30} />
              <span>Troubleshoot</span>
            </button>
          </div>
          <div className="recoveryFooter">
            <button
              type="button"
              className="recoveryBtn"
              onClick={() => setPage("repair")}
            >
              Back
            </button>
            <button
              type="button"
              className="recoveryBtn"
              onClick={() => dispatch({ type: "WALLSHUTDN" })}
            >
              Turn off your PC
            </button>
          </div>
        </div>
      )}

      {page === "troubleshoot" && (
        <div className="recoveryPage">
          <h1 className="recoveryHeader">Advanced options</h1>
          <div className="troubleList">
            {troubleOptions.map(([label, message]) => (
              <button
                type="button"
                className="troubleItem"
                key={label}
                onClick={() => setNotice(message)}
              >
                <span>{label}</span>
                <Icon fafa="faChevronRight" width={10} />
              </button>
            ))}
          </div>
          {notice ? <div className="recoveryNotice">{notice}</div> : null}
          <div className="recoveryFooter">
            <button
              type="button"
              className="recoveryBtn"
              onClick={() => {
                setPage("options");
                setNotice("");
              }}
            >
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
