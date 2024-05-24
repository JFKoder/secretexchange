import { Component, OnInit } from '@angular/core';
import { GetContentService } from '../services/get-content.service'
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit{

  htmlContent: string = '';
  constructor(private http: HttpClient, private cs: GetContentService){}
  
  ngOnInit(): void {
    this.http.get('/api/static/about.html', { responseType: 'text' })
      .subscribe(
        (response: string) => {
          this.htmlContent = response;
        },
        (error) => {
          console.error('Error loading HTML', error);
        }
      );
  }
}
