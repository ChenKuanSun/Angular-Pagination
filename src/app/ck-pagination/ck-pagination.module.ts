import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';
import { CkPaginationComponent } from './ck-pagination.component';
@NgModule({
  declarations: [
    CkPaginationComponent
    ],
  imports: [
    CommonModule,
    ScrollDispatchModule
  ],
  exports: [
    CkPaginationComponent
  ]
})
export class CkPaginationModule { }
