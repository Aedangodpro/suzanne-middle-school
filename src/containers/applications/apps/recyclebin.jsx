import React, { useEffect, useState } from "react";
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

const commands = [
  { icon: "cut", label: "Cut" },
  { icon: "copy", label: "Copy" },
  { icon: "paste", label: "Paste" },
  { icon: "rename", label: "Rename" },
];

export const RecycleBin = () => {
  const wnapp = useSelector((state) => state.apps.bin0);
  const files = useSelector((state) => state.files);
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();

  const binId = files.data.special["%recyclebin%"];
  const binFolder = binId ? files.data.getId(binId) : null;
  const items = (binFolder && binFolder.data) || [];
  const visible = items.filter((item) =>
    item.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  useEffect(() => {
    if (wnapp.hide) setQuery("");
  }, [wnapp.hide]);

  const openFolder = (folder) => {
    dispatch({ type: "GOTOFOLDER", payload: folder });
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
            <div className="rbBtn" title="New">
              <Icon src="dustbin" ui width={18} />
              <span>New</span>
            </div>
          </div>
          <div className="rbSec">
            {commands.map((cmd) => (
              <div
                className="rbBtn rbDisabled"
                key={cmd.icon}
                title={cmd.label}
              >
                <Icon src={cmd.icon} ui width={18} />
              </div>
            ))}
            <div className="rbBtn rbDisabled" title="Delete">
              <Icon src="dustbin" ui width={18} />
            </div>
          </div>
          <div className="rbSec">
            <div className="rbBtn" title="Sort">
              <Icon src="sort" ui width={16} />
              <span>Sort</span>
              <Icon fafa="faChevronDown" width={8} />
            </div>
            <div className="rbBtn" title="View">
              <Icon src="view" ui width={16} />
              <span>View</span>
              <Icon fafa="faChevronDown" width={8} />
            </div>
            <div className="rbBtn" title="More options">
              <Icon fafa="faEllipsis" width={14} />
            </div>
          </div>
          <div className="rbSec rbEnd">
            <div className="rbBtn" title="Details view">
              <Icon src="win/viewinfo" width={16} />
              <span>Details</span>
            </div>
          </div>
        </div>
        <div className="rbBar">
          <Icon
            className="rbNav rbDisabled"
            fafa="faArrowLeft"
            width={14}
            title="Back"
          />
          <Icon
            className="rbNav rbDisabled"
            fafa="faArrowRight"
            width={14}
            title="Forward"
          />
          <Icon
            className="rbNav rbDisabled"
            fafa="faArrowUp"
            width={14}
            title="Up"
          />
          <Icon className="rbNav" src="refresh" ui width={14} title="Refresh" />
          <div className="rbPath">
            <Icon src="bin0" width={16} />
            <span>Recycle Bin</span>
          </div>
          <div className="rbSearch">
            <Icon src="search" width={12} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Recycle Bin"
              aria-label="Search Recycle Bin"
            />
          </div>
        </div>
        <div className="rbBody">
          <div className="rbNavPane">
            {navItems.map((item) => (
              <div
                className="rbNavItem"
                key={item.name}
                title={"Open " + item.name}
                onClick={() => openFolder(item.folder)}
              >
                <Icon src={item.icon} width={16} />
                <span>{item.name}</span>
              </div>
            ))}
            <div className="rbDivider" />
            <div
              className="rbNavItem"
              title="Open OS (C:)"
              onClick={() => openFolder("%cdrive%")}
            >
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
            <div className="rbRows win11Scroll">
              {visible.map((item) => (
                <div className="rbRow" key={item.id}>
                  <span className="rbName">
                    <Icon src={item.info.icon || "folder"} width={16} />
                    <span>{item.name}</span>
                  </span>
                  <span>—</span>
                  <span>—</span>
                  <span>—</span>
                  <span>{item.type === "folder" ? "File folder" : item.type}</span>
                  <span>—</span>
                </div>
              ))}
              {visible.length === 0 && (
                <div className="rbEmpty">
                  {items.length === 0
                    ? "This folder is empty."
                    : "No items match your search."}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="rbStatus">
          <span>
            {items.length} {items.length === 1 ? "item" : "items"}
          </span>
          <div className="rbViews">
            <Icon
              className="rbView"
              src="win/viewinfo"
              width={16}
              title="Details"
            />
            <Icon
              className="rbView"
              src="win/viewlarge"
              width={16}
              title="Large icons"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
