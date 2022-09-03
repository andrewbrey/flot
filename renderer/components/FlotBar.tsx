import { XMarkIcon } from "@heroicons/react/24/solid";
import cn from "classnames";
import { ipcRenderer as ipc } from "electron-better-ipc";
import React from "react";
import { useStore } from "../store";

function FlotBar() {
  const url = useStore((state) => state.url);
  const windowActive = useStore((state) => state.windowActive);
  const windowHover = useStore((state) => state.windowHover);
  const childActive = useStore((state) => state.childActive);
  const childHover = useStore((state) => state.childHover);

  const quit = async () => ipc.callMain("please-quit");

  return (
    <React.Fragment>
      <nav
        className={cn(
          "h-full w-full overflow-hidden flex items-center px-2 transition-opacity hover:opacity-100 bg-teal-800/95",
          {
            "opacity-100":
              windowActive || childActive || windowHover || childHover || !url,
            "opacity-0": !(
              windowActive ||
              childActive ||
              windowHover ||
              childHover ||
              !url
            ),
          }
        )}
      >
        <div
          className={cn(
            "w-full h-full flex-grow flex items-center pointer-events-none select-none",
            {
              draggable: windowActive || childActive,
              "cursor-default": !(windowActive || childActive),
            }
          )}
        >
          <p className="text-gray-300 text-lg font-light tracking-tighter">
            Flōt
          </p>
          <p
            className="text-transparent w-full h-full grid grid-cols-4 gap-2 overflow-hidden"
            aria-hidden
          >
            <span>{windowActive ? "Window Active" : "Window Blur"}</span>
            <span>{windowHover ? "Window Hover" : "Window Leave"}</span>
            <span>{childActive ? "Child Active" : "Child Blur"}</span>
            <span>{childHover ? "Child Hover" : "Child Leave"}</span>
          </p>
        </div>
        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={quit}
            className={cn(
              "inline-flex items-center px-0.5 py-0.5 border border-transparent text-xs font-medium rounded-full transition-colors",
              "text-gray-300 hover:text-red-50 hover:bg-red-500",
              "focus:outline-none focus-visible:text-red-50 focus-visible:bg-red-500"
            )}
          >
            <XMarkIcon className="h-4 w-4 text-current inline-block" />
          </button>
        </div>
      </nav>
    </React.Fragment>
  );
}

export default FlotBar;
