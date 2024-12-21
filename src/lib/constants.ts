export const PASSWORD_MIN_LENGTH = 4;

export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*?[#?!@$%^&*-]).+$/;

export const PASSWORD_REGEX_ERROR = {
  message:
    '비밀번호는 반드시 소문자, 대문자, 숫자, 특수문자로 구성되어야 합니다.',
};
