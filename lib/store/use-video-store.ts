import { create } from "zustand";

type State = {
  videoUrl: string;
};

type Action = {
  setVideoUrl: (url: State["videoUrl"]) => void;
};

export const useVideoStore = create<State & Action>()((set) => ({
  videoUrl: "",
  setVideoUrl: (url) =>
    set((state) => {
      if (state.videoUrl === url) return state;
      return { videoUrl: url };
    }),
}));
