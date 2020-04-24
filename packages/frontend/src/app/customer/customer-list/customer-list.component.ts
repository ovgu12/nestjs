import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CustomerNewComponent } from '../customer-new/customer-new.component';
import { CustomerService } from '../customer.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  map,
} from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppErrorStateMatcher } from '../../common/app-error-state-matcher';
import { of, fromEvent } from 'rxjs';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
})
export class CustomerListComponent implements OnInit, AfterViewInit {
  search: FormGroup;
  tableColumns: string[] = ['firstName', 'lastName', 'email', 'actions'];
  customers = [];

  isLoading = true;
  errorMatcher = new AppErrorStateMatcher();

  @ViewChild('searchInput') searchInput: ElementRef;

  constructor(
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private customerService: CustomerService,
  ) {}

  ngOnInit(): void {
    this.search = new FormGroup({
      searchInput: new FormControl('', [
        Validators.minLength(2),
        Validators.maxLength(100),
      ]),
    });

    this.listCustomers();
  }

  ngAfterViewInit(): void {
    this.initSearch();
  }

  resetSearch() {
    this.search.patchValue({
      searchInput: '',
    });
    this.listCustomers();
  }

  initSearch() {
    fromEvent(this.searchInput.nativeElement, 'keyup')
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        map((e: any) => e.target.value),
        switchMap(val => {
          this.isLoading = true;
          if (this.search.valid) {
            if (val) {
              return this.customerService.search(val);
            } else {
              return this.customerService.list();
            }
          } else {
            return of(this.customers);
          }
        }),
      )
      .subscribe(res => {
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
      this.resetSearch();
      this.openSnackBar('Customer is succesfully deleted', 'x');
    });
  }

  addCustomer() {
    const dialogRef = this.dialog.open(CustomerNewComponent, {
      width: '60%',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.resetSearch();
      }
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
