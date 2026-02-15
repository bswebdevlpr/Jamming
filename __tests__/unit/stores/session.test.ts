import { describe, it, expect, beforeEach } from "vitest";
import { useSessionStore } from "@/app/stores/session";
import { PositionEnum } from "@/app/lib/enums/position.enum";
import { GenreEnum } from "@/app/lib/enums/genre.enum";

describe("useSessionStore", () => {
  beforeEach(() => {
    // Reset store to initial state
    useSessionStore.setState({
      userProfile: {
        isLoaded: undefined,
        id: undefined,
        accept_marketing: undefined,
        profile_image: undefined,
        nickname: undefined,
        tags: undefined,
        pos: undefined,
        genre: undefined,
        level: undefined,
        location: undefined,
        bpm: undefined,
        is_bpm_public: undefined,
        allow_noti: undefined,
        playlist: [],
      },
      signupProfileImage: null,
      signupData: null,
    });
  });

  describe("setUserProfile", () => {
    it("should update partial user profile", () => {
      useSessionStore.getState().setUserProfile({
        nickname: "테스트",
        pos: PositionEnum.Guitar,
      });
      const { userProfile } = useSessionStore.getState();
      expect(userProfile.nickname).toBe("테스트");
      expect(userProfile.pos).toBe(PositionEnum.Guitar);
      expect(userProfile.genre).toBeUndefined();
    });

    it("should merge with existing profile", () => {
      useSessionStore.getState().setUserProfile({ nickname: "첫번째" });
      useSessionStore.getState().setUserProfile({ genre: GenreEnum.Rock });
      const { userProfile } = useSessionStore.getState();
      expect(userProfile.nickname).toBe("첫번째");
      expect(userProfile.genre).toBe(GenreEnum.Rock);
    });

    it("should update isLoaded flag", () => {
      useSessionStore.getState().setUserProfile({ isLoaded: true });
      expect(useSessionStore.getState().userProfile.isLoaded).toBe(true);
    });
  });

  describe("resetUserProfile", () => {
    it("should reset all fields to initial state", () => {
      useSessionStore.getState().setUserProfile({
        nickname: "test",
        id: "abc",
        isLoaded: true,
      });
      useSessionStore.getState().resetUserProfile();
      const { userProfile } = useSessionStore.getState();
      expect(userProfile.nickname).toBeUndefined();
      expect(userProfile.id).toBeUndefined();
      expect(userProfile.isLoaded).toBeUndefined();
      expect(userProfile.playlist).toEqual([]);
    });
  });

  describe("signupData", () => {
    it("should set signup profile image", () => {
      const file = new File([""], "test.jpg", { type: "image/jpeg" });
      useSessionStore.getState().setSignupProfileImage(file);
      expect(useSessionStore.getState().signupProfileImage).toBe(file);
    });

    it("should clear signup profile image with null", () => {
      useSessionStore.getState().setSignupProfileImage(null);
      expect(useSessionStore.getState().signupProfileImage).toBeNull();
    });

    it("should set signup data", () => {
      useSessionStore.getState().setSignupData({ nickname: "새유저" });
      expect(useSessionStore.getState().signupData?.nickname).toBe("새유저");
    });

    it("should merge signup data", () => {
      useSessionStore.getState().setSignupData({ nickname: "유저" });
      useSessionStore.getState().setSignupData({
        pos: PositionEnum.Vocal,
      });
      const data = useSessionStore.getState().signupData;
      expect(data?.nickname).toBe("유저");
      expect(data?.pos).toBe(PositionEnum.Vocal);
    });

    it("should clear signup data", () => {
      useSessionStore.getState().setSignupData({ nickname: "유저" });
      useSessionStore.getState().setSignupProfileImage(
        new File([""], "test.jpg")
      );
      useSessionStore.getState().clearSignupData();
      expect(useSessionStore.getState().signupData).toBeNull();
      expect(useSessionStore.getState().signupProfileImage).toBeNull();
    });
  });
});
