import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private baseUrl = '/api';

  constructor(private http: HttpClient) { }

  // Utility function to convert ArrayBuffer to base64
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  // Generate a random AES key
  private async generateKey(): Promise<CryptoKey> {
    return crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256,
      },
      true,
      ['encrypt', 'decrypt']
    );
  }

  // Encrypt the file data
  private async encryptData(key: CryptoKey, data: ArrayBuffer): Promise<{ iv: Uint8Array, encryptedData: ArrayBuffer }> {
    const iv = crypto.getRandomValues(new Uint8Array(12)); // Initialization vector
    const encryptedData = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      data
    );
    return { iv, encryptedData };
  }

  async encryptAndUploadFile(file: File): Promise<{ uploadResponse: any, ivKeyBase64: string, uuid: string }> {
    const arrayBuffer = await file.arrayBuffer();
    const key = await this.generateKey();
    const { iv, encryptedData } = await this.encryptData(key, arrayBuffer);
    const keyExported = await crypto.subtle.exportKey('raw', key);

    // Convert IV and key to base64 and concatenate
    const ivBase64 = this.arrayBufferToBase64(iv);
    const keyBase64 = this.arrayBufferToBase64(keyExported);
    const ivKeyBase64 = ivBase64 + keyBase64;

    // Create FormData and append the encrypted data
    const formData = new FormData();
    const uuid = self.crypto.randomUUID();
    
    const nn = uuid+'++'+window.btoa(file.name)
    formData.append('file', new Blob([encryptedData]), nn);
    formData.append('ttl', '5 Min');

    // Upload the FormData
    const uploadResponse = await this.http.post('/api/upload', formData).toPromise();
    return { uploadResponse, ivKeyBase64 ,uuid};
  }

  
}
