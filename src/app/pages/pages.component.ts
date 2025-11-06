import { Component, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { MENU_ITEMS } from './pages-menu';
import { NbMenuItem, NbSidebarService } from '@nebular/theme';
import { AuthService } from '../services/auth.service';
import { Constants } from '../Models/Constants';
import {  Location } from '@angular/common';
import { Subject } from 'rxjs';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  templateUrl: './pages.component.html',
})
export class PagesComponent implements OnDestroy {

  private destroy$ = new Subject<void>();

  menu: NbMenuItem[] = MENU_ITEMS;
  breadcrumbItems: any[] = [];
  user: any = {};
  RoleList: Array<{ Role: string, Value: Array<string> }> = Constants.RoleAssignment;
  MenuList: Array<string> = [];
  isSidebarCollapsed = false;

  constructor(
    private router: Router, 
    private Auth: AuthService, 
    private location: Location,
    private sidebarService: NbSidebarService,
    private cd: ChangeDetectorRef
  ) {
    // Listen for the explicit compact event
    this.sidebarService.onCompact()
      .pipe(
        filter(event => event.tag === 'menu-sidebar'),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.isSidebarCollapsed = true;
        this.cd.detectChanges();
      });

    // Listen for the explicit expand event
    this.sidebarService.onExpand()
      .pipe(
        filter(event => event.tag === 'menu-sidebar'),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.isSidebarCollapsed = false;
        this.cd.detectChanges();
      });

    // Get the initial state of the sidebar for the first load
    this.sidebarService.getSidebarState('menu-sidebar')
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.isSidebarCollapsed = state === 'compacted';
        this.cd.detectChanges();
      });
  }

  ngOnInit(): void {
    this.Auth.getAccessToken().subscribe({
      next: (token: string) => {
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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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

  back() {
    this.location.back();
  }
}
