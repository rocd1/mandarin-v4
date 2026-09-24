import { Component } from '@angular/core';

import {
  
  RouterOutlet,
} from '@angular/router';
import { MinimalHeader } from '../designs/public/headers/minimal/minimal-header/minimal-header';
import { SimpleFooter } from '../designs/public/footers/simple/simple-footer/simple-footer';
import { CenteredHeader } from '../designs/public/headers/centered/centered-header/centered-header';
import { HamburgerHeader } from '../designs/public/headers/hamburger/hamburger-header/hamburger-header';
import { AppBar } from '../designs/public/headers/app-bar/app-bar/app-bar';
import { PublicBottomNavigation } from '../designs/public/navigation/bottom/public-bottom-navigation/public-bottom-navigation';
import { PublicRightNavigation } from '../designs/public/navigation/right-side/public-right-navigation/public-right-navigation';
import { PublicLeftNavigation } from '../designs/public/navigation/left-side/public-left-navigation/public-left-navigation';
import { PublicLeftIconNavigation } from '../designs/public/navigation/left-side-icon/public-left-icon-navigation/public-left-icon-navigation';
import { ColumnsFooter } from '../designs/public/footers/columns/columns-footer/columns-footer';

@Component({
  selector: 'app-public-layout',
  imports: [
    MinimalHeader,
    RouterOutlet,
    ColumnsFooter,
  ],
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.css',
})
export class PublicLayout {}