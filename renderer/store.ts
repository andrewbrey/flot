import create from "zustand";
import {
  prepareDailyMotionUrl,
  prepareVimeoUrl,
  prepareYoutubeUrl,
} from "./util/magic-urls";

interface FlotState {
  url: string;
  setUrl(url: string): void;
  urlLocked: boolean;
  opacity: number;
  setOpacity(opacity: number): void;
  childLoading: boolean;
  setChildLoading(loading: boolean): void;
  windowActive: boolean;
  windowHover: boolean;
  childActive: boolean;
  childHover: boolean;
}

let unlockTimeout: NodeJS.Timeout | null = null;

export const useStore = create<FlotState>((set, get) => ({
  url:
    typeof window === "undefined"
      ? ""
      : localStorage.getItem("flot-last-url") ?? "",
  setUrl: (nextUrl: string) => {
    if (get().urlLocked) {
      console.log(
        "%cSkipping attempt to set the url when it is not possible to do so",
        "color:blue;"
      );
    } else {
      let target = (nextUrl ?? "").trim();

      if (!target) {
        if (typeof window !== "undefined")
          localStorage.setItem("flot-last-url", "");
        set(() => ({ url: "" }));
      } else {
        try {
          const parsedURL = preprocessURL(target);

          if (get().url !== parsedURL.href) {
            set(() => ({ url: parsedURL.href }));
          }
        } catch {
          set(() => ({ urlLocked: false }));

          if (target)
            console.log(`%cSkipping invalid url [${target}]`, "color:red;");
        }
      }
    }
  },
  urlLocked: false,
  opacity:
    typeof window === "undefined"
      ? 1
      : Number(localStorage.getItem("flot-opacity") ?? 1),
  setOpacity: (nextOpacity: number) => {
    if (nextOpacity > 100) nextOpacity = 100;
    if (nextOpacity < 5) nextOpacity = 5;

    const roundedOpacity = Math.round(nextOpacity) / 100;

    localStorage.setItem("flot-opacity", `${roundedOpacity}`);

    set(() => ({ opacity: roundedOpacity }));
  },
  childLoading: false,
  setChildLoading: (loading: boolean) => {
    if (unlockTimeout) clearTimeout(unlockTimeout);
    if (loading)
      unlockTimeout = setTimeout(() => set(() => ({ urlLocked: false })), 3000); // One way or another, unlock the url in a few seconds

    set(() => ({ urlLocked: loading }));
    set(() => ({ childLoading: loading }));
  },
  windowActive: true,
  windowHover: false,
  childActive: false,
  childHover: false,
}));

function preprocessURL(target: string) {
  target = target.startsWith("http") ? target : `https://${target}`;

  target = prepareYoutubeUrl(target);
  target = prepareVimeoUrl(target);
  target = prepareDailyMotionUrl(target);

  return new URL(target);
}
