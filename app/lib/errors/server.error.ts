const postfix = " 문제가 지속적으로 발생한다면 피드백을 전송해주세요.";

export class CustomErrMsg {
  static NicknameNotUnique = "이미 존재하는 닉네임입니다.";
}

export class CustomError extends Error {
  constructor(msg: string) {
    super(msg);
  }

  static Forbidden = new CustomError("권한이 없습니다.");
  static UnExpected = new CustomError(
    "예기치 못한 문제가 발생했습니다." + postfix
  );
  static SignUp = new CustomError(
    "회원가입에 실패했습니다. 새로고침후 다시 진행해주세요. 계속 실패한다면 처음부터 다시 진행해주세요."
  );
  static InvalidUserSession = new CustomError(
    "회원정보를 불러오는 데에 실패했습니다." + postfix
  );
  static GetJamFeed = new CustomError(
    "잼세션 목록을 불러오는 데에 실패했습니다." + postfix
  );
  static InvalidJam = new CustomError("유효하지 않은 잼세션입니다.");
  static InvalidUser = new CustomError("일치하는 유저를 찾을 수 없습니다.");
  // SignIn: {
  //   code: 1,
  //   msg: "로그인 도중 에러가 발생했습니다. 잠시 후 다시 시도해주세요.",
  // },
}
