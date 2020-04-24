import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerNewComponent } from './customer-new/customer-new.component';

const routes: Routes = [
  {
    path: 'customer',
    component: CustomerListComponent,
  },
  {
    path: 'customer/new',
    component: CustomerNewComponent,
  },
  {
    path: 'customer/edit/:customerId',
    component: CustomerNewComponent,
  },
  {
    path: '**',
    component: CustomerListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerRoutingModule {}
