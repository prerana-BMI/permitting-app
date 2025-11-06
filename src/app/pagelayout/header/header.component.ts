import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  isSidebarCompacted = false;
   ProfileUrl : any;
  user: any;

  themes = [
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'dark',
      name: 'Dark',
    },
    {
      value: 'cosmic',
      name: 'Cosmic',
    },
    {
      value: 'corporate',
      name: 'Corporate',
    },
  ];


  userMenu = [ { title: 'Log out' } ];

  currentTheme = 'default';

  constructor(private sidebarService: NbSidebarService,
              private themeService: NbThemeService,
              private authServcie : AuthService ,
             private router: Router , 
            private menuService: NbMenuService) {

    // Subscribe to sidebar compact event
    this.sidebarService.onCompact()
      .pipe(
        filter((event: any) => event.tag === 'menu-sidebar'),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.isSidebarCompacted = true;
      });

    // Subscribe to sidebar expand event
    this.sidebarService.onExpand()
      .pipe(
        filter((event: any) => event.tag === 'menu-sidebar'),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.isSidebarCompacted = false;
      });
  }

  ngOnInit() {
    this.currentTheme = this.themeService.currentTheme;
    this.authServcie.GetUserProfilePhoto().subscribe(res=>{
        this.ProfileUrl = res;
      });
    this.menuService.onItemClick()
      .pipe(
        filter(({ tag }) => tag === 'my-user-menu')
      )
      .subscribe(({ item }) => {
        this.LogOut(item);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: any) {
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar(): boolean {
    // Use the explicit compact() and expand() methods
    if (this.isSidebarCompacted) {
      this.sidebarService.expand('menu-sidebar');
    } else {
      this.sidebarService.compact('menu-sidebar');
    }
    return false;
  }

  LogOut(item: any) {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('userDbDetails');
    this.router.navigate(['/account/login']);
  }

  
}
