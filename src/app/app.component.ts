import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  pageSelect;
  currentPage = 5000;
  totalPages = 1000000;
  
  constructor() { }

  ngOnInit() {}

  onListenPagination(event: number) {
    this.pageSelect = event;
  }
  
}
