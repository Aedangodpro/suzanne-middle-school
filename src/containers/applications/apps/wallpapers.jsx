import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToolBar } from "../../../utils/general";

const wallpaperName = (src) => {
  if (src.includes("http")) return "Murder Drones";

  const [theme, file] = src.split("/");
  const index = file.match(/\d+/);
  const name =
    theme == "default"
      ? "Windows"
      : theme == "dark"
        ? "Windows Dark"
        : theme.replace("Theme", "Theme ");

  return index ? `${name} ${Number(index[0]) + 1}` : name;
};

export const Wallpapers = () => {
  const wnapp = useSelector((state) => state.apps.wallpapers);
  const wall = useSelector((state) => state.wallpaper);
  const dispatch = useDispatch();

  const setWallpaper = (src) => {
    dispatch({
      type: "WALLSET",
      payload: src,
    });
  };

  return (
    <div
      className="wallpapersApp floatTab dpShad"
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
        name="Wallpapers"
      />
      <div className="windowScreen flex flex-col" data-dock="true">
        <div className="restWindow flex-grow flex flex-col">
          <div className="wallpapersHeader">
            <h1>Wallpapers</h1>
            <p>Choose a background for your desktop.</p>
          </div>
          <div className="wallpaperGrid win11Scroll">
            {wall.walls.map((src, i) => {
              const selected = wall.src == src;
              const preview = src.includes("http")
                ? src
                : `img/wallpaper/${src}`;

              return (
                <button
                  key={i}
                  type="button"
                  className="wallpaperTile"
                  data-selected={selected}
                  onClick={() => setWallpaper(src)}
                >
                  <img src={preview} alt={wallpaperName(src)} />
                  <span>{wallpaperName(src)}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
