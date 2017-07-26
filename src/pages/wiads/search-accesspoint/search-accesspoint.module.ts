import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchAccesspointPage } from './search-accesspoint';

@NgModule({
  declarations: [
    SearchAccesspointPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchAccesspointPage),
  ],
  exports: [
    SearchAccesspointPage
  ]
})
export class SearchAccesspointPageModule { }
