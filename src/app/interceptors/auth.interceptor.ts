
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, tap, catchError, throwError, finalize, of, EmptyError, EMPTY } from 'rxjs';
import { LoaderService } from '../services/loader.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private LoaderserviceService: LoaderService,
    private toastr: ToastrService,
    private auth: AuthService,
     public router: Router,
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const autoLoader = request.headers.get('Loader');
    if (request.url.includes('https://api.openweathermap.org/')) {
      return next.handle(request);
    }

    if (autoLoader == 'true' || autoLoader == null) {
      this.LoaderserviceService.display(true);
    }

    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.auth.GetLocalStorageToken()}`
      }
    });

    return next.handle(request).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          if (event.body.Message !== undefined && event.body.Message !== '' && event.body.Message !== null) {
            if (event.body.Success === true) {
              this.toastr.success(event.body.Message, 'Success');
            } else {
              this.toastr.error(event.body.Message, 'Error');
            }
          }
        }
      }),
      catchError((error: HttpErrorResponse) => {
        this.LoaderserviceService.display(false);
        if (error.status === 401) {
          this.toastr.error('Something went wrong, please try logging in again.', 'Error');
          this.router.navigate(['/account/login']);
          return EMPTY;
        } else {
          this.toastr.error('An unexpected error occurred.', 'Error');
        }

        return throwError(() => error);
      }),
      finalize(() => {
       if (autoLoader == 'true' || autoLoader == null) {
          this.LoaderserviceService.display(false);
        }
      })
    );
  }
}
