import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoaderService } from '../services/loader.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private LoaderserviceService: LoaderService ,
      private toastr: ToastrService,
      private auth : AuthService
   
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    var autoLoader = request.headers.get('Loader');
    if (autoLoader == 'true' || autoLoader == null) {
      this.LoaderserviceService.display(true);
    }
     request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${ this.auth.GetLocalStorageToken()}`
                }
            })
    return next.handle(request).pipe(tap(event => {
      
      if (event instanceof HttpResponse) {

        if (event.body.Message !== undefined && event.body.Message !== '' && event.body.Message !== null) {
          if (event.body.Success === true) {
            this.toastr.success(event.body.Message, 'Success');
   
          } else {
            this.toastr.error(event.body.Message, 'Error');
          }
        }
         if (autoLoader == 'true' || autoLoader == null) {
        this.LoaderserviceService.display(false);
      }
      }
     
      return event;
    }));
  }

}
