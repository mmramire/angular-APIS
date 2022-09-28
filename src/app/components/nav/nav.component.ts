import { Component, OnInit } from '@angular/core';

import { StoreService } from '../../services/store.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  activeMenu = false;
  counter = 0;

  constructor(private storeService: StoreService) {
    console.log('constructor de NavComponent');
  }

  ngOnInit(): void {
    this.storeService.myCart$.subscribe((products) => {
      this.counter = products.length;
      console.log('ngOnInit de NavComponent');
    });
  }

  toggleMenu() {
    this.activeMenu = !this.activeMenu;
    console.log('toggleMenu de NavComponent');
  }
}
