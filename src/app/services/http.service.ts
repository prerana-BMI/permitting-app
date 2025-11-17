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
  httpGetCallWithPromise(method: string, params: any, autoLoader: boolean): Observable<any> {
     let headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Loader', autoLoader.toString());

  return this.http.get<any>(this.baseUrl + method, { headers: headers, params: params });
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

  httpPostFile<T>(method: string, formData: FormData, autoLoader: boolean = true): Observable<T> {
    const headers = new HttpHeaders()
      .set('Loader', autoLoader.toString());
    return this.http.post<T>(this.baseUrl + method, formData, { headers });
  }

  httpGetThirdPartyCall<T>(method: string, data: string = ''): Observable<T> {
    let apiKey = 'c2163fd2f9c3c394a3becb6191c7195f';
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${data}&limit=5&appid=${apiKey}`;
    return this.http.get<T>(url);
  }
  
  httpGetBlob(baseUrl: string, headersObj: any) : Observable<Blob> {
    return this.http.get(this.baseUrl+baseUrl, {
      headers: new HttpHeaders(headersObj),
      responseType: 'blob'
    });
  }

}
