import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'home-outline',
    link: '/pages/dashboard',
 
  },
  {
    title: 'Permits',
    icon: 'grid-outline',
  
    children: [
      {
        title: 'Permit List',
        link: '/permits/permitlist',
      }
    ]
  },
  
];
