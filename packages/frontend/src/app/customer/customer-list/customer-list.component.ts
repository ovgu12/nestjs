import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { CustomerNewComponent } from '../customer-new/customer-new.component';
import { CustomerService } from '../customer.service';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit {

  tableColumns: string[] = ['firstName', 'lastName', 'email', 'actions'];
  customers = [];

  constructor(public dialog: MatDialog, private customerService: CustomerService) { }

  ngOnInit(): void {
    this.listCustomers();
  }

  listCustomers() {
    this.customerService.list().subscribe(res => {
      this.customers = res;
    });
  }

  deleteCustomer(customerId: string) {
    this.customerService.delete(customerId).subscribe(res => {
      this.listCustomers();
    });
  }

  addCustomer() {
    const dialogRef = this.dialog.open(CustomerNewComponent, {
      width: '60%',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.listCustomers();
      }
    });
  }

}
