import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GetContentService {

  constructor(private http: HttpClient) { }

  async getContent(filename: string): Promise<{  content:any }> {
    try {
      const response = await this.http.get<any>(
        `/api/static/${filename}` ).toPromise();
      if (!response || !response.body) {
        throw new Error('Failed to fetch encrypted data');
      }

      return { content: response.body };
    } catch (error) {
      console.error('Error fetching encrypted data:', error);
      throw new Error('Error fetching encrypted data');
    }

  }
}
