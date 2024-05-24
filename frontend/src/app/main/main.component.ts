import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit{
  htmlContent: string = '';
  constructor(private http: HttpClient){}
  
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
}
