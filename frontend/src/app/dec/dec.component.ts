import { Component, OnInit } from '@angular/core';
import { EncryptionDownloadService } from '../services/encryption-download.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-dec',
  templateUrl: './dec.component.html',
  styleUrls: ['./dec.component.scss']
})
export class DecComponent implements OnInit{
  ivKeyBase64: string = '';
  errorMessage: string | null = null;
  id:string|null = null
  customHeader: string | null = null;

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')
  }
  
  constructor(private encryptionDownloadService: EncryptionDownloadService, private route: ActivatedRoute) {}

  async onDecryptFile(): Promise<void> {
    this.errorMessage = null;
    this.customHeader = null;
    try {
      if (!this.ivKeyBase64) {
        this.errorMessage = 'Please enter the IV and key.';
        return;
      }

      const ivBase64 = this.ivKeyBase64.slice(0, 16); // Extract the first 16 bytes (IV)
      const keyBase64 = this.ivKeyBase64.slice(16); // Extract the remaining bytes (key)

      const iv = this.encryptionDownloadService.base64ToUint8Array(ivBase64);
      const key = this.encryptionDownloadService.base64ToArrayBuffer(keyBase64);

      const { encryptedData , customHeader} = await this.encryptionDownloadService.fetchEncryptedData(this.id);
      const decryptedData = await this.encryptionDownloadService.decryptData(encryptedData, iv, key);

      this.customHeader = customHeader;

      // Create a Blob from the decrypted data and download it
      const blob = new Blob([decryptedData]);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = this.customHeader;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error decrypting file:', error);
      this.errorMessage = 'Error decrypting file.';
    }
  }
}
