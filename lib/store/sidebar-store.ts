import { create } from "zustand";
import { SidebarItem } from "../types";

type State = {
  mode: SidebarItem["label"];
};

type Action = {
  setMode: (mode: State["mode"]) => void;
};

export const useSidebarStore = create<State & Action>()((set) => ({
  mode: "Splice AI",
  setMode: (mode) =>
    set((state) => {
      if (state.mode === mode) return state;
      return { mode };
    }),
}));
