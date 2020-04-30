import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerNewComponent } from './customer-new/customer-new.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerListComponent,
  },
  {
    path: 'new',
    component: CustomerNewComponent,
  },
  {
    path: 'edit/:customerId',
    component: CustomerNewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerRoutingModule {}
