"use client";

export class CustomErrMsg {
  static NicknameNotUnique = "이미 존재하는 닉네임입니다.";
}

export class CustomError {
  static UnExpected = new Error(
    "예기치 못한 문제가 발생했습니다. 문제가 지속적으로 발생한다면 피드백으로 전송 부탁드립니다."
  );
  // SignIn: {
  //   code: 1,
  //   msg: "로그인 도중 에러가 발생했습니다. 잠시 후 다시 시도해주세요.",
  // },
}
