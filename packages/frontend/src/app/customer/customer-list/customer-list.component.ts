import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { CustomerNewComponent } from '../customer-new/customer-new.component';
import { CustomerService } from '../customer.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fromEvent } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, switchMap, filter } from 'rxjs/operators';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit, AfterViewInit {

  @ViewChild('searchInput')
  searchInput: ElementRef;

  tableColumns: string[] = ['firstName', 'lastName', 'email', 'actions'];
  customers = [];

  isLoading = true;

  constructor(
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private customerService: CustomerService
  ) { }

  ngOnInit(): void {
    this.listCustomers();
  }

  ngAfterViewInit(): void {
    this.initSearch();
  }

  initSearch() {
    fromEvent<any>(this.searchInput.nativeElement, 'keyup')
    .pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map(event => event.target.value),
      filter(query => query?.length > 1 && query?.length < 101),
      switchMap(val => {
        this.isLoading = true;
        return this.customerService.search(val);
      })
    ).subscribe(res => {
      this.customers = res;
      this.isLoading = false;
    });
  }

  listCustomers() {
    this.isLoading = true;
    this.customerService.list().subscribe(res => {
      this.customers = res;
      this.isLoading = false;
    });
  }

  deleteCustomer(customerId: string) {
    this.customerService.delete(customerId).subscribe(res => {
      this.listCustomers();
      this.openSnackBar('Customer is succesfully deleted', 'x');
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

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

}
