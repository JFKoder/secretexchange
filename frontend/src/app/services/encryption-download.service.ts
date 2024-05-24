// encryption-download.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaderResponse ,  HttpHeaders, HttpResponse} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EncryptionDownloadService {
  constructor(private http: HttpClient) {}

  // Utility function to convert base64 to ArrayBuffer
  base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  // Utility function to convert base64 to Uint8Array
  base64ToUint8Array(base64: string): Uint8Array {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  // Fetch the encrypted file from the server
  async fetchEncryptedData(id: string|null): Promise<{  encryptedData: ArrayBuffer, customHeader: string }> {
    try {
      const response = await this.http.get<ArrayBuffer>(
        `/api/decrypt/${id}`,
        { observe: 'response', responseType: 'arraybuffer' as 'json' }
      ).toPromise();

      if (!response || !response.body) {
        throw new Error('Failed to fetch encrypted data');
      }

      const customHeader = response.headers.get('filename'); // Replace 'Custom-Header' with the actual header name
      return { encryptedData: response.body, customHeader: customHeader || '' };
    } catch (error) {
      console.error('Error fetching encrypted data:', error);
      throw new Error('Error fetching encrypted data');
    }
    /*
      const encryptedData = await this.http.get('/api/decrypt/'+id, { responseType: 'arraybuffer', headers: headers }).toPromise();
      
      if (!encryptedData) {
        throw new Error('Failed to fetch encrypted data');
      }
      return { encryptedData };
    } catch (error) {
      console.error('Error fetching encrypted data:', error);
      throw new Error('Error fetching encrypted data');
    }
    */
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
