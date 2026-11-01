import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Icon, ToolBar } from "../../../utils/general";
import "./assets/recyclebin.scss";

const navItems = [
  { name: "Gallery", icon: "pics", folder: "%pictures%" },
  { name: "Desktop", icon: "desk", folder: "%desktop%" },
  { name: "Documents", icon: "docs", folder: "%documents%" },
  { name: "Downloads", icon: "down", folder: "%downloads%" },
  { name: "Pictures", icon: "pics", folder: "%pictures%" },
  { name: "Music", icon: "music", folder: "%music%" },
  { name: "Videos", icon: "vid", folder: "%videos%" },
];

const columns = [
  "Name",
  "Original Location",
  "Date Deleted",
  "Size",
  "Item type",
  "Date modified",
];

export const RecycleBin = () => {
  const wnapp = useSelector((state) => state.apps.bin0);
  const dispatch = useDispatch();

  const openFolder = (folder) => {
    dispatch({ type: "FILEPATH", payload: folder });
    dispatch({ type: "EXPLORER", payload: "full" });
    dispatch({ type: "RECYCLEBIN", payload: "close" });
  };

  return (
    <div
      className="recycleBin floatTab dpShad"
      data-size={wnapp.size}
      data-max={wnapp.max}
      style={{
        ...(wnapp.size == "cstm" ? wnapp.dim : null),
        zIndex: wnapp.z,
      }}
      data-hide={wnapp.hide}
      id={wnapp.icon + "App"}
    >
      <ToolBar
        app={wnapp.action}
        icon={wnapp.icon}
        size={wnapp.size}
        name="Recycle Bin"
      />
      <div className="windowScreen flex flex-col">
        <div className="rbRibbon">
          <div className="rbSec">
            <div className="rbBtn">
              <Icon src="dustbin" ui width={18} />
              <span>New</span>
            </div>
          </div>
          <div className="rbSec">
            {["cut", "copy", "paste", "rename"].map((cmd) => (
              <div className="rbBtn rbDisabled" key={cmd}>
                <Icon src={cmd} ui width={18} />
              </div>
            ))}
            <div className="rbBtn rbDisabled">
              <Icon src="dustbin" ui width={18} />
            </div>
          </div>
          <div className="rbSec">
            <div className="rbBtn">
              <Icon src="sort" ui width={16} />
              <span>Sort</span>
              <Icon fafa="faChevronDown" width={8} />
            </div>
            <div className="rbBtn">
              <Icon src="view" ui width={16} />
              <span>View</span>
              <Icon fafa="faChevronDown" width={8} />
            </div>
            <div className="rbBtn">
              <Icon fafa="faEllipsis" width={14} />
            </div>
          </div>
          <div className="rbSec rbEnd">
            <div className="rbBtn">
              <Icon src="win/viewinfo" width={16} />
              <span>Details</span>
            </div>
          </div>
        </div>
        <div className="rbBar">
          <Icon className="rbNav rbDisabled" fafa="faArrowLeft" width={14} />
          <Icon className="rbNav rbDisabled" fafa="faArrowRight" width={14} />
          <Icon className="rbNav rbDisabled" fafa="faArrowUp" width={14} />
          <Icon className="rbNav" src="refresh" ui width={14} />
          <div className="rbPath">
            <Icon src="bin0" width={16} />
            <span>Recycle Bin</span>
          </div>
          <div className="rbSearch">
            <Icon src="search" width={12} />
            <input type="text" placeholder="Search Recycle Bin" />
          </div>
        </div>
        <div className="rbBody">
          <div className="rbNavPane">
            {navItems.map((item) => (
              <div
                className="rbNavItem"
                key={item.name}
                onClick={() => openFolder(item.folder)}
              >
                <Icon src={item.icon} width={16} />
                <span>{item.name}</span>
              </div>
            ))}
            <div className="rbDivider" />
            <div className="rbNavItem" onClick={() => openFolder("%cdrive%")}>
              <Icon src="disc" width={16} />
              <span>OS (C:)</span>
            </div>
          </div>
          <div className="rbContent">
            <div className="rbCols">
              {columns.map((col) => (
                <span key={col}>{col}</span>
              ))}
            </div>
            <div className="rbEmpty">This folder is empty.</div>
          </div>
        </div>
        <div className="rbStatus">
          <span>0 items</span>
          <div className="rbViews">
            <Icon className="rbView" src="win/viewinfo" width={16} />
            <Icon className="rbView" src="win/viewlarge" width={16} />
          </div>
        </div>
      </div>
    </div>
  );
};
