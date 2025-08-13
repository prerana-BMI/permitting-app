import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MENU_ITEMS } from './pages-menu';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  templateUrl: 'pages.component.html',
})
export class PagesComponent {
  menu = MENU_ITEMS;
  breadcrumbItems: any[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    // Initial breadcrumb load
    this.updateBreadcrumb(this.router.url);

    // Update breadcrumb when route changes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.updateBreadcrumb(event.urlAfterRedirects);
      });
  }

  updateBreadcrumb(url: string) {
    let str = url.split("/")[2] ?? ''; // Adjust if 'pages' is always at index 1
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
