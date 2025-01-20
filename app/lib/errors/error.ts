export interface CodeAndMsg {
  code: number;
  msg: string;
}

export const CustomError: {
  [key: string]: CodeAndMsg;
} = {
  UnExpected: {
    code: 0,
    msg: "예기치 못한 문제가 발생했습니다.",
  },
  SignIn: {
    code: 1,
    msg: "로그인 도중 에러가 발생했습니다. 잠시 후 다시 시도해주세요.",
  },
};
