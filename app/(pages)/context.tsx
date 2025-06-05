import { createContext } from "react";
import { GlobalContext } from "../lib/interfaces/global.interface";
import _ from "lodash";

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
};

export const globalContext = createContext<GlobalContext>(
  _.cloneDeep(initialContext)
);
