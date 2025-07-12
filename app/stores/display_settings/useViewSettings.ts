import { create } from "zustand";

type Option = 'audio' | 'video' | 'screen_recording';

interface IaudioSettings {
    viewSettings: Option[];
    addView: (prop: Option) => void;
    removeView: (prop: Option) => void;
    resetView: () => void;
}

const useViewSettings = create<IaudioSettings>(() => ({
  viewSettings: JSON.parse(localStorage.getItem("swyp-stream") || "[]"),

  addView: (value) => {
    const currentTypes = getStreamType()
    if (!currentTypes.includes(value)) {
      const updated = [...currentTypes, value];
      localStorage.setItem("swyp-stream", JSON.stringify(updated));
    }
  },

  removeView: (value) => {
    const currentTypes = getStreamType()
    if (currentTypes.includes(value)) {
      const updated = currentTypes.filter(type => type !== value);
      localStorage.setItem("swyp-stream", JSON.stringify(updated));
    }
  },

  resetView: () => {
    localStorage.setItem("swyp-stream", JSON.stringify([]));
  }
}));

function getStreamType(): Option[] {
    const swyp_stream = localStorage.getItem("swyp-stream")
    if (swyp_stream === null) {
        localStorage.setItem("swyp-stream", JSON.stringify([]))
        return []
    } 
    return JSON.parse(swyp_stream)
}

export default useViewSettings;