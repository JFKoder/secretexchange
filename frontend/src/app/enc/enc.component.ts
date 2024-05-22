import { Component, OnInit } from '@angular/core';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FileUploadService } from 'src/app/services/file-upload.service';
import {FormBuilder, FormControl } from '@angular/forms';
import {FloatLabelType } from '@angular/material/form-field';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-enc',
  templateUrl: './enc.component.html',
  styleUrls: ['./enc.component.scss']
})
export class EncComponent  implements OnInit {
  hide = true;
  
  ngOnInit(): void {
  //  this.fileInfos = this.uploadService.getFiles();
  }
  
  hideRequiredControl = new FormControl(false);
  floatLabelControl = new FormControl('auto' as FloatLabelType);

  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';

  getFloatLabelValue(): FloatLabelType {
    return this.floatLabelControl.value || 'auto';
  }

  fileInfos?: Observable<any>;

  constructor(private uploadService: FileUploadService, private _formBuilder: FormBuilder,private encryptionUploadService: FileUploadService) { }
  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }

  async upload(): Promise<void> {
    let iv = window.crypto.getRandomValues(new Uint8Array(16));
    let key = window.crypto.getRandomValues(new Uint8Array(16));
  
    // crypto functions are wrapped in promises so we have to use await and make sure the function that
    // contains this code is an async function
    // encrypt function wants a cryptokey object
    const key_encoded =  await window.crypto.subtle.importKey(
      "raw",
      key.buffer,
      "AES-CTR",
      false,
      ["encrypt", "decrypt"]
    );


    this.progress = 0;

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        this.currentFile = file;
        let data = new Uint8Array(12345);
        const encrypted_content =  window.crypto.subtle.encrypt(
          {
            name: "AES-CTR",
            counter: iv,
            length: 128,
          },
          key_encoded,
          data,
        );
        this.uploadService.upload(this.currentFile).subscribe({
          next: (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round(100 * event.loaded / event.total);
            } else if (event instanceof HttpResponse) {
              this.message = event.body.message;
              this.fileInfos = this.uploadService.getFiles();
            }
          },
          error: (err: any) => {
            console.log(err);
            this.progress = 0;

            if (err.error && err.error.message) {
              this.message = err.error.message;
            } else {
              this.message = 'Could not upload the file!';
            }

            this.currentFile = undefined;
          }
        });
      }

      this.selectedFiles = undefined;
    }
  }  




  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      alert('Please select a file');
      return;
    }

    const file = input.files[0];
    try {
      const response = await this.encryptionUploadService.encryptAndUploadFile(file);
      console.log('Upload successful:', response);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }

}
