import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerNewComponent } from './customer-new/customer-new.component';
import { MaterialModule } from '../material/material.module';

@NgModule({
  declarations: [CustomerListComponent, CustomerNewComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    CustomerRoutingModule,
    MaterialModule,
  ],
})
export class CustomerModule {}
