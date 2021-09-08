const translateDict: Record<string, string> = {
  UNSAFE_NOT_HANDLED:
    '안전하지 않은 메서드를 호출하였으나 모든 안전장치에서 통과하지 못했습니다. UNSAFE parameter 를 부여하지 않았는지 확인하세요.',
  PAGE_NOT_FOUND: '요청하신 페이지를 찾을 수 없습니다.',
  TOO_MANY_REQUESTS:
    '짧은 시간 내에 과도한 요청을 보냈습니다. 잠시 후에 다시 시도하세요.',
  PASSWORD_ENCRYPTION_FAIL:
    '비밀번호를 암호화하던 도중 실패했습니다. 다시 시도하시거나 서버 관리자에게 문의하세요.',
  TOKEN_INVALID: '인증 토큰이 올바르지 않습니다. 다시 로그인하여야 합니다.',
  TOKEN_EXPIRED: '인증 토큰이 만료되었습니다. 다시 로그인하여야 합니다.',
  TOKEN_RENEW_NEEDED:
    '접근 토큰이 만료되어 재발급 토큰으로 다시 접근토큰을 발급받아야 합니다.',
  LOGIN_FAIL: '로그인에 실패했습니다.',
  LACK_OF_AUTHORITY: '해당 작업을 완료하기에 권한이 부족합니다.',
  PARAMETER_NOT_PROVIDED:
    '요청을 처리하기 위한 매개변수가 전송되지 않았습니다.',
  PARAMETER_INVALID: '매개변수가 잘못되었습니다.',
  DATA_NULL: '데이터가 비어있습니다.',
  DATABASE_SAVE_FAIL: '데이터베이스에 저장하던 중 오류가 발생했습니다.',
  UNIQUE_DATA_CONFLICT: '동일한 객체가 존재합니다.',
  DATA_NOT_FOUND: '데이터를 찾을 수 없습니다.',
  PARTIAL_SUCCESS:
    '요청을 처리하던 중 일부는 성공하였지만 일부는 실패하여 모든 요청을 처리하지 못했습니다.',
  DATABASE_PROCESS_FAIL: '데이터베이스에서 작업을 처리하지 못했습니다.',
  FILE_PROCESS_FAIL: '파일 작업 도중 실패했습니다.',
};

// const _translateDict = {
//   UNSAFE_NOT_HANDLED: '',
//   PAGE_NOT_FOUND: '',
//   TOO_MANY_REQUESTS: '',
//   PASSWORD_ENCRYPTION_FAIL: '',
//   TOKEN_INVALID: '',
//   TOKEN_EXPIRED: '',
//   TOKEN_RENEW_NEEDED: '',
//   LOGIN_FAIL: '',
//   LACK_OF_AUTHORITY: '',
//   PARAMETER_NOT_PROVIDED: '',
//   PARAMETER_INVALID: '',
//   DATA_NULL: '',
//   DATABASE_SAVE_FAIL: '',
//   UNIQUE_DATA_CONFLICT: '',
//   DATA_NOT_FOUND: '',
//   PARTIAL_SUCCESS: '',
//   DATABASE_PROCESS_FAIL: '',
//   FILE_PROCESS_FAIL: '',
// };

export default (code: string): string => {
  const returnData = translateDict[code];
  if (!returnData) {
    return '알 수 없는 오류가 발생했습니다.';
  }
  return returnData;
};
