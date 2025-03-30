import {
  followsLogo,
  followsLogoOutline,
  homeLogo,
  homeLogoOutline,
  profileLogo,
  profileLogoOutline,
  searchLogo,
  searchLogoOutline,
} from '@/assets/icons';

export interface NavLinkMenu {
  label: string;
  path: string;
  logo: {
    fill: string;
    outline: string;
  };
}

export const NAV_LINK_MENU: NavLinkMenu[] = [
  {
    label: 'Home',
    logo: {
      fill: homeLogo,
      outline: homeLogoOutline,
    },
    path: '/',
  },
  {
    label: 'Search',
    logo: {
      fill: searchLogo,
      outline: searchLogoOutline,
    },
    path: '/search',
  },
  {
    label: 'Follows',
    logo: {
      fill: followsLogo,
      outline: followsLogoOutline,
    },
    path: `/follows`,
  },
  {
    label: 'Profile',
    logo: {
      fill: profileLogo,
      outline: profileLogoOutline,
    },
    path: '/profile',
  },
];
