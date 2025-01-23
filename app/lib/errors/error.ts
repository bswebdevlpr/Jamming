export interface CodeAndMsg {
  code: number;
  msg: string;
}

export class CustomError {
  static UnExpected = {
    code: 0,
    msg: "예기치 못한 문제가 발생했습니다. 문제가 지속적으로 발생한다면 피드백으로 전송 부탁드립니다.",
  };
  // SignIn: {
  //   code: 1,
  //   msg: "로그인 도중 에러가 발생했습니다. 잠시 후 다시 시도해주세요.",
  // },
  static NicknameNotUnique = {
    code: 1,
    msg: "이미 존재하는 닉네임입니다.",
  };
}
// export const CustomError: {
//   [key: string]: CodeAndMsg;
// } = {
//   UnExpected: {
//     code: 0,
//     msg: "예기치 못한 문제가 발생했습니다. 문제가 지속적으로 발생한다면 피드백으로 전송 부탁드립니다.",
//   },
//   SignIn: {
//     code: 1,
//     msg: "로그인 도중 에러가 발생했습니다. 잠시 후 다시 시도해주세요.",
//   },
//   NicknameNotUnique: {
//     code: 1,
//     msg: "이미 존재하는 닉네임입니다.",
//   },
// };
