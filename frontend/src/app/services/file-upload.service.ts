import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private baseUrl = '/api';

  constructor(private http: HttpClient) { }
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

 // upload(file: File): Observable<HttpEvent<any>> {
  upload(file: any): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    const req = new HttpRequest('POST', `${this.baseUrl}/upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);
  }

  getFiles(): Observable<any> {
    return this.http.get(`${this.baseUrl}/files`);
  }
  public kpv = {}

  async encryptAndUploadFile(file: File): Promise<any> {
    const arrayBuffer = await file.arrayBuffer();
    const key = await this.generateKey();
    const { iv, encryptedData } = await this.encryptData(key, arrayBuffer);
    const keyExported = await crypto.subtle.exportKey('raw', key);

    // Create FormData and append the encrypted data and IV
    const formData = new FormData();
    formData.append('file', new Blob([encryptedData]), file.name);

    const strIV = this.arrayBufferToBase64(iv);(iv);
    const strkeyExported = this.arrayBufferToBase64(keyExported);
    this.kpv = {iv: strIV ,keyExported: strkeyExported }
    console.log(this.kpv)
    //formData.append('iv', new Blob([iv]));
    //formData.append('key', new Blob([keyExported]));

    // Upload the FormData
    return this.http.post('/api/upload', formData).toPromise();
  }

  private strToArrayBuffer(str: string): ArrayBuffer {
    const encoder = new TextEncoder();
    return encoder.encode(str).buffer;
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



  
}
