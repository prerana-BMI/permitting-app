import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MENU_ITEMS } from './pages-menu';
import { AuthService } from '../services/auth.service';
import { Constants } from '../Models/Constants';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  templateUrl: 'pages.component.html',
})
export class PagesComponent {
  menu = MENU_ITEMS;
  breadcrumbItems: any[] = [];
  user : any = {};
  RoleList :  Array<{"Role"  : string , "Value" : Array<string>}> = Constants.RoleAssignment;
  MenuList : Array<string>  = [];

  constructor(private router: Router , private Auth : AuthService) {}

ngOnInit(): void {
    this.Auth.getAccessToken().subscribe({
    next: (token: string) => {
      console.log("Access Token in ngOnInit:", token);
      this.user = this.Auth.GetLoggedInUser();
      this.MenuList = this.RoleList.find(a => a.Role == this.user.Role)?.Value ?? [];
      this.updateBreadcrumb(this.router.url);
      this.menu = this.menu.filter(a => this.MenuList.includes(a.title));
       this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.updateBreadcrumb(event.urlAfterRedirects);
      });
    },
    error: (err) => {
      console.error("Failed to acquire token in ngOnInit", err);
    }
  });
}

    
   

  updateBreadcrumb(url: string) {
    let str = url.split("/")[2] ?? ''; 
    this.breadcrumbItems = this.splitPascalCasePath(str);
  }

  splitPascalCasePath(path: string) {
    path = path.replace(/^\/+/, '');
    let segments = path.split('/');
    let lastSegment = segments.pop() ?? "";
    let splitLastSegment = lastSegment.split(/(?=[A-Z])/);
    return [...segments, ...splitLastSegment];
  }
}
