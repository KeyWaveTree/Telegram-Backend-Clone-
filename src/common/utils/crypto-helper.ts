import * as crypto from 'crypto';

// RSA 공개키와 개인키 생성
export const generateRSAKeyPair = (): {
  publicKey: string;
  privateKey: string;
} => {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki', // 공개키 인코딩 형식
      format: 'pem', // PEM 형식
    },
    privateKeyEncoding: {
      type: 'pkcs8', // 개인키 인코딩 형식
      format: 'pem', // PEM 형식
    },
  });

  return { publicKey, privateKey };
};

// RSA 암호화 함수: 공개키를 사용하여 데이터를 암호화
export const encryptRSA = (publicKey: string, data: string): string => {
  const buffer = Buffer.from(data, 'utf-8');
  const encrypted = crypto.publicEncrypt(publicKey, buffer);
  return encrypted.toString('base64'); // Base64로 인코딩하여 반환
};

// RSA 복호화 함수: 개인키를 사용하여 암호화된 데이터를 복호화
export const decryptRSA = (
  privateKey: string,
  encryptedData: string,
): string => {
  const buffer = Buffer.from(encryptedData, 'base64');
  const decrypted = crypto.privateDecrypt(privateKey, buffer);
  return decrypted.toString('utf-8');
};

// RSA 서명 생성 함수: 개인키를 사용하여 메시지 서명
export const signRSA = (privateKey: string, data: string): string => {
  const signer = crypto.createSign('SHA256');
  signer.update(data);
  signer.end();
  const signature = signer.sign(privateKey, 'base64');
  return signature;
};

// RSA 서명 유효성 검증 함수: 공개키를 사용하여 서명이 유효한지 검증
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

// AES-256-CBC 대칭 암호화 (SHA-256을 통해 키 변환)
export const encryptAES = (password: string, data: string): string => {
  // 1. 비밀번호를 SHA-256 해시를 사용하여 32바이트(256비트) AES 키로 변환
  const key = crypto.createHash('sha256').update(password).digest();

  // 2. AES-256-CBC 방식에서는 16바이트(128비트) 초기화 벡터(IV)가 필요함
  const iv = crypto.randomBytes(16);

  // 3. AES-256-CBC 암호화 객체 생성 (key와 iv를 사용)
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

  // 4. 입력 데이터를 'utf8'에서 암호화하여 'base64'로 인코딩
  let encrypted = cipher.update(data, 'utf8', 'base64');
  encrypted += cipher.final('base64');

  // 5. IV(초기화 벡터)와 암호문을 ":" 구분자로 합쳐서 반환 (복호화 시 분리 가능)
  return `${iv.toString('base64')}:${encrypted}`;
};

// AES-256-CBC 대칭 복호화
export const decryptAES = (password: string, encryptedData: string): string => {
  // 1. 비밀번호를 SHA-256 해시를 사용하여 32바이트(256비트) AES 키로 변환
  const key = crypto.createHash('sha256').update(password).digest();

  // 2. 저장된 암호문에서 IV와 암호문을 분리
  const [ivBase64, encryptedBase64] = encryptedData.split(':');

  // 3. IV와 암호문을 base64에서 Buffer 형태로 변환
  const iv = Buffer.from(ivBase64, 'base64');
  const encrypted = Buffer.from(encryptedBase64, 'base64');

  // 4. AES-256-CBC 복호화 객체 생성
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

  // 5. 암호문을 base64에서 원래의 'utf8' 문자열로 복호화
  const decrypted = decipher.update(encrypted); // Buffer 사용
  return Buffer.concat([decrypted, decipher.final()]).toString('utf8');
};

// RSA + AES 하이브리드 암호화
export const hybridEncrypt = (
  rsaPublicKey: string,
  plaintext: string,
): string => {
  const aesKey = crypto.randomBytes(32); // AES 256-bit key
  const iv = crypto.randomBytes(16); // 128-bit IV
  const algorithm = 'aes-256-cbc';

  const cipher = crypto.createCipheriv(algorithm, aesKey, iv);
  let encrypted = cipher.update(plaintext, 'utf8', 'base64');
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

// RSA + AES 하이브리드 복호화
export const hybridDecrypt = (
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
