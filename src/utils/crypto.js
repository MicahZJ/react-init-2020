import CryptoJS from 'crypto-js';
class CryptoFile {
  constructor () {
    // 秘钥
    this.key = CryptoJS.enc.Utf8.parse('CRYPTOJSKEY00000'); // 16位
    this.iv = CryptoJS.enc.Utf8.parse('CRYPTOJSKEY00000');
    this.CRYPTOJSKEY = 'CRYPTOJSKEY'
  }
  // 加密
  encrypt(word) {
    let srcS = CryptoJS.enc.Utf8.parse(word);
    let encrypted = CryptoJS.AES.encrypt(srcS, this.key, { iv: this.iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    return encrypted.ciphertext.toString().toUpperCase();
  }
  
  // 解密
  decrypt(word) {
    let encryptedHexStr = CryptoJS.enc.Hex.parse(word);
    let srcS = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    let decrypt = CryptoJS.AES.decrypt(srcS, this.key, { iv: this.iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    // eslint-disable-next-line no-debugger
    // debugger
    let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
  }
  // // aes加密
  // encrypt(word) {
  //   let encrypted = '';
  //   if (typeof word == 'string') {
  //     const srcS = CryptoJS.enc.Utf8.parse(word);
  //     encrypted = CryptoJS.AES.encrypt(srcS, this.key, {
  //       iv: this.iv,
  //       mode: CryptoJS.mode.CBC,
  //       padding: CryptoJS.pad.Pkcs7
  //     });
  //   } else if (typeof word == 'object') {
  //     // 对象格式的转成json字符串
  //     const data = JSON.stringify(word);
  //     const srcS = CryptoJS.enc.Utf8.parse(data);
  //     encrypted = CryptoJS.AES.encrypt(srcS, this.key, {
  //       iv: this.iv,
  //       mode: CryptoJS.mode.CBC,
  //       padding: CryptoJS.pad.Pkcs7
  //     });
  //   }
  //   return encrypted.ciphertext.toString();
  // }
  //
  // // aes解密
  // decrypt(word) {
  //   const encryptedHexStr = CryptoJS.enc.Hex.parse(word);
  //   const srcS = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  //   const decrypt = CryptoJS.AES.decrypt(srcS, this.key, {
  //     iv: this.iv,
  //     mode: CryptoJS.mode.CBC,
  //     padding: CryptoJS.pad.Pkcs7
  //   });
  //   const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  //   return decryptedStr.toString();
  // }
}
export default new CryptoFile()
