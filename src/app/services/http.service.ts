import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/assets/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private baseUrl = environment.BaseUrl;

  constructor(private http: HttpClient) { }
  httpGetCall<T>(method: string, data: any = {}, autoLoader: boolean = true): Observable<T> {
    let headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Loader', autoLoader.toString());

    // Convert plain object to HttpParams
    let params = new HttpParams();
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        params = params.set(key, data[key]);
      }
    });
    return this.http.get<T>(this.baseUrl + method, { headers: headers, params: data });
  }

  httpPostCall<T>(method: string, data: any, autoLoader: boolean = true): Observable<T[]> {
    const config = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Loader', autoLoader.toString())
    };
    //.set('Loader', autoLoader.toString()) 

    return this.http.post<T[]>(this.baseUrl + method, data, config);
  }
}
