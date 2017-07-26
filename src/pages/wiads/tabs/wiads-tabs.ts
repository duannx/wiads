import { Component } from '@angular/core';


@Component({
  templateUrl: 'wiads-tabs.html'
})
export class WiadsTabsPage {

  tab1Root = "WiadsDashboardPage";
  tab2Root = "WiadsAccesspointPage";
  tab3Root = "WiadsAdsvertisementPage";
  tab4Root = "WiadsUsersPage";
  tab5Root = "WiadsMorePage";

  constructor() {

  }
}
