import * as crypto from 'crypto';

//서비스에 맞게 암호화 모듈을 재설정해서 사용할 라이브러리
export const generateRSAKeyPair = (): {
  publicKey: string;
  privateKey: string;
} => {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
    },
  });
  return { publicKey, privateKey };
};

//rsa 암호화 함수: 공개키를 사용하여 데이터를 암호화
export const encryptRSA = (publicKey: string, data: string): string => {
  const buffer = Buffer.from(data, 'utf-8');
  const encrypted = crypto.publicEncrypt(publicKey, buffer);
  return encrypted.toString('base64');
};

//rsa 복호화 함수 : 개인키를 사용하여 암호화된 데이터를 복호화
export const decryptRSA = (
  privateKey: string,
  encryptedData: string,
): string => {
  const buffer = Buffer.from(encryptedData, 'base64');
  const decrypted = crypto.privateDecrypt(privateKey, buffer);
  return decrypted.toString('utf-8');
};

//RSA 서명 생성 함수: 개인키를 사용하여 메시지 서명
export const signRSA = (privateKey: string, data: string): string => {
  const signer = crypto.createSign('SHA256');
  signer.update(data);
  signer.end();
  const signature = signer.sign(privateKey, 'base64');
  return signature;
};

//RSA 서명 유효성 검증 함수: 공개키를 사용하여 서명이 유효한지 검증
export const verifyRSASignature = (
  publicKey: string,
  data: string,
  signature: string,
): boolean => {
  const verifier = crypto.createVerify('SHA256');
  verifier.update(data);
  verifier.end();
  return verifier.verify(publicKey, signature, 'base64');
};

/**
 * RSA 서명 문제점. (한글) 2btye * 체팅 메시지(장문) => errer : data to large
 * ㄴ RSA만 쓰면 장문의 체팅을 암호화로 보낼 수 없음.
 * ㄴ> AES를 같이 쓴다.
 *
 * 해결 방법: 커스터마이징 하이브리드 암호화 알고리즘: 알고리즘 조합.
 * #암호화 시
 * 1. 원하는 문장-> AES 암호화 -> AES 암호화 문장
 * 2. AES 암호화 문장(일종의 압축?) -> RSA 암호화 -> RSA+AES 암호화 문장
 *
 * #복호화 시
 * 1. RSA+ AES 암호화 문장  -> RSA 복호화 -> AES 암호화 문장
 * 2. AES 함호화 문장 -> AES 복호화 -> 원하는 문장
 * */

//aes 암호화 password 방식: 대칭키
export const encryptAES = (password: string, data: string): string => {
  const key = crypto.createHash('sha256').update(password).digest();

  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv('aes-256=cbc', key, iv);

  let encrypted = cipher.update(data, 'utf8', 'base64');
  encrypted += cipher.final('base64');

  return `${iv.toString('base64')}: ${encrypted}`;
};

//aes 복호화
export const decryptAES = (password: string, encryptedData: string): string => {
  const key = crypto.createHash('sha256').update(password).digest();

  const [ivBase64, encryptedBase64] = encryptedData.split(':');

  const iv = Buffer.from(ivBase64, 'base64');
  const encrypted = Buffer.from(encryptedBase64, 'base64');

  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

  const decrypted = decipher.update(encrypted);
  return Buffer.concat([decrypted, decipher.final()]).toString('utf8');
};

//RSA + AES 하이브리드 암호화
export const hybridEncrypt = (
  rsaPublicKey: string,
  planintext: string,
): string => {
  const aesKey = crypto.randomBytes(32); //AES 256-bit key
  const iv = crypto.randomBytes(16); //128-bit IV
  const algorithm = 'aes-256-cbc';

  const cipher = crypto.createCipheriv(algorithm, aesKey, iv);
  let encrypted = cipher.update(planintext, 'utf8', 'base64');
  encrypted += cipher.final('base64');

  const encryptedKey = crypto.publicEncrypt(
    {
      key: rsaPublicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256',
    },
    aesKey,
  );

  const payload = {
    iv: iv.toString('base64'),
    ciphertext: encrypted,
    encryptedKey: encryptedKey.toString('base64'),
  };

  return Buffer.from(JSON.stringify(payload), 'utf8').toString('base64');
};

export const hybridDencrypt = (
  rsaPrivateKey: string,
  encryptedPayload: string,
): string => {
  const algorithm = 'aes-256-cbc';

  const decoded = Buffer.from(encryptedPayload, 'base64').toString('utf8');
  const { iv, ciphertext, encryptedKey } = JSON.parse(decoded);

  const aesKey = crypto.privateDecrypt(
    {
      key: rsaPrivateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256',
    },
    Buffer.from(encryptedKey, 'base64'),
  );

  const decipher = crypto.createDecipheriv(
    algorithm,
    aesKey,
    Buffer.from(iv, 'base64'),
  );

  const decrypted =
    decipher.update(ciphertext, 'base64', 'utf8') + decipher.final('utf8');
  return decrypted;
};
