import { Component, OnInit } from '@angular/core';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FileUploadService } from 'src/app/services/file-upload.service';
import {FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {FloatLabelType } from '@angular/material/form-field';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-enc',
  templateUrl: './enc.component.html',
  styleUrls: ['./enc.component.scss']
})
export class EncComponent  implements OnInit {
  htmlContent: string = '';
  uploadForm: FormGroup;
  ivKeyBase64: string | null = null;
  link: string | null = null;

  constructor(private encryptionUploadService: FileUploadService,private fb: FormBuilder,private http: HttpClient) {
    this.uploadForm = this.fb.group({
      file: [null, Validators.required]
    });
  }
  ngOnInit(): void {
    this.http.get('/api/static/main.html', { responseType: 'text' })
    .subscribe(
      (response: string) => {
        this.htmlContent = response;
      },
      (error) => {
        console.error('Error loading HTML', error);
      }
    );
  }


onFileSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    this.uploadForm.patchValue({ file });
  }
}

  async onUpload(): Promise<void> {
    if (this.uploadForm.invalid) {
      alert('Please select a file');
      return;
    }

    const file = this.uploadForm.get('file')?.value;
    try {
      const { uploadResponse, ivKeyBase64, uuid } = await this.encryptionUploadService.encryptAndUploadFile(file);
      this.ivKeyBase64 = ivKeyBase64;
      let port = window.location.port
      let portNo = ""
      if( port != "80" && port != "443" ){
        portNo = ":"+port
      }
      this.link = window.location.protocol+"//"+window.location.hostname +portNo+"/decrypt/"+ uuid
      console.log('Upload successful:', uploadResponse);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }


}
