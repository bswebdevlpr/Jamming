const postfix = " 문제가 지속적으로 발생한다면 피드백을 전송해주세요.";

export class CustomErrMsg {
  static NicknameNotUnique = "이미 존재하는 닉네임입니다.";
}

export class CustomError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = "CustomError";
  }

  // 공통
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

  // 서버
  static UpdatePlaylistItem = new CustomError(
    "연주목록 항목 업데이트에 실패했습니다." + postfix
  );
  static UploadImage = new CustomError(
    "이미지 업로드에 실패했습니다." + postfix
  );

  // 클라이언트
  static CreateJamSession = new CustomError(
    "잼세션을 생성하는데에 실패했습니다." + postfix
  );
  static SearchSong = new CustomError("곡 검색에 실패했습니다." + postfix);

  // 보안
  static SecurityViolation = new CustomError(
    "보안 위반이 감지되었습니다. 입력 내용을 확인해주세요."
  );
}
