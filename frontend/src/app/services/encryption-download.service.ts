// encryption-download.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EncryptionDownloadService {
  constructor(private http: HttpClient) {}

  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }
  
  // Fetch the encrypted file, IV, and key from the server
  async fetchEncryptedData(): Promise<{ encryptedData: ArrayBuffer, iv: Uint8Array, key: ArrayBuffer }> {
    const response: any = await this.http.get('/api/fetch-encrypted-data', { responseType: 'json' }).toPromise();
    const encryptedData = new Uint8Array(response.encryptedData).buffer;
    const iv = new Uint8Array(response.iv);
    const key = new Uint8Array(response.key).buffer;
    return { encryptedData, iv, key };
  }

  // Decrypt the data
  async decryptData(encryptedData: ArrayBuffer, iv: Uint8Array, key: ArrayBuffer): Promise<ArrayBuffer> {
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      key,
      { name: 'AES-GCM' },
      true,
      ['decrypt']
    );

    const decryptedData = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      cryptoKey,
      encryptedData
    );

    return decryptedData;
  }
}
