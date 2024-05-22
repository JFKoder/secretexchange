import { Component } from '@angular/core';
import { EncryptionDownloadService } from '../services/encryption-download.service';
@Component({
  selector: 'app-dec',
  templateUrl: './dec.component.html',
  styleUrls: ['./dec.component.scss']
})
export class DecComponent {
  constructor(private encryptionDownloadService: EncryptionDownloadService) {}

  async onDecryptFile(): Promise<void> {
    try {
      const { encryptedData, iv, key } = await this.encryptionDownloadService.fetchEncryptedData();
      const decryptedData = await this.encryptionDownloadService.decryptData(encryptedData, iv, key);

      // Create a Blob from the decrypted data and download it
      const blob = new Blob([decryptedData]);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'decrypted_file';
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error decrypting file:', error);
    }
  }
}
