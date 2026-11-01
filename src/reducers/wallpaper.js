const walls = [
  "https://i.postimg.cc/hvkcZznQ/murder-drones-n.jpg",
  "default/img0.jpg",
  "dark/img0.jpg",
  "ThemeA/img0.jpg",
  "ThemeA/img1.jpg",
  "ThemeA/img2.jpg",
  "ThemeA/img3.jpg",
  "ThemeB/img0.jpg",
  "ThemeB/img1.jpg",
  "ThemeB/img2.jpg",
  "ThemeB/img3.jpg",
  "ThemeC/img0.jpg",
  "ThemeC/img1.jpg",
  "ThemeC/img2.jpg",
  "ThemeC/img3.jpg",
  "ThemeD/img0.jpg",
  "ThemeD/img1.jpg",
  "ThemeD/img2.jpg",
  "ThemeD/img3.jpg",
];

const themes = ["default", "dark", "ThemeA", "ThemeB", "ThemeD", "ThemeC"];

var storedWps = parseInt(localStorage.getItem("wps"), 10);
var wps = Number.isNaN(storedWps) || !walls[storedWps] ? 0 : storedWps;

const defState = {
  themes: themes,
  walls: walls,
  wps: wps,
  src: walls[wps],
  locked: true,
  booted: false,
  repair: false,
  act: "",
  dir: 0,
};

const wallReducer = (state = defState, action) => {
  switch (action.type) {
    case "WALLUNLOCK":
      return {
        ...state,
        locked: false,
        dir: 0,
      };
    case "WALLNEXT":
      var twps = ((Number(state.wps) || 0) + 1) % walls.length;
      localStorage.setItem("wps", twps);
      return {
        ...state,
        wps: twps,
        src: walls[twps],
      };
    case "WALLALOCK":
      return {
        ...state,
        locked: true,
        dir: -1,
      };
    case "WALLREPAIR":
      return {
        ...state,
        repair: true,
      };
    case "REPAIRCLOSE":
      return {
        ...state,
        repair: false,
      };
    case "WALLBOOTED":
      return {
        ...state,
        booted: true,
        dir: 0,
        act: "",
      };
    case "WALLRESTART":
      return {
        ...state,
        booted: false,
        dir: -1,
        locked: true,
        repair: false,
        act: "restart",
      };
    case "WALLSHUTDN":
      return {
        ...state,
        booted: false,
        dir: -1,
        locked: true,
        repair: false,
        act: "shutdn",
      };
    case "WALLSET":
      var isIndex = !Number.isNaN(parseInt(action.payload)),
        wps = 0,
        src = "";

      if (isIndex) {
        var current = parseInt(localStorage.getItem("wps"), 10);
        wps = Number.isNaN(current) || !walls[current] ? 0 : current;
        src = walls[wps];
      } else {
        const idx = walls.findIndex((item) => item === action.payload);

        if (idx != -1) {
          localStorage.setItem("wps", idx);
          wps = idx;
          src = action.payload;
        } else {
          src = action.payload;
        }
      }

      return {
        ...state,
        wps: wps,
        src: src,
      };
    default:
      return state;
  }
};

export default wallReducer;
