import _ from "lodash";
import { createContext } from "react";
import { GlobalContext } from "../lib/interfaces/global.interface";

export const initialContext: GlobalContext = {
  bodyWidth: 0,
  bodyHeight: 0,

  isSmallLoadingOn: false,
  setSmallLoading: () => {},

  bottomSheet: {
    children: null,
    location: null,
    set: () => {},
    header: false,
    setHeader: null,
  },

  session: {
    userProfile: {
      isLoaded: undefined,
      accept_marketing: undefined,
      profile_image: undefined,
      nickname: undefined,
      tags: undefined,
      pos: undefined,
      genre: undefined,
      level: undefined,
      location: undefined,
    },
    setUserProfile: () => {},
  },

  resetSlideCalendarDots: true,
  setResetSlideCalendarDots: () => {},
};

export const globalContext = createContext<GlobalContext>(
  _.cloneDeep(initialContext)
);
