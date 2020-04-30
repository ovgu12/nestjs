import { Inject, Component, OnInit, Optional } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { CustomerService } from '../customer.service';
import { Customer } from '../models/customer.interface';
import { Observable } from 'rxjs';
import {
  debounceTime,
  map,
  distinctUntilChanged,
  switchMap,
  first,
} from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppErrorStateMatcher } from '../../common/app-error-state-matcher';

@Component({
  selector: 'app-customer-new',
  templateUrl: './customer-new.component.html',
  styleUrls: ['./customer-new.component.scss'],
})
export class CustomerNewComponent implements OnInit {
  customerForm: FormGroup;
  customer: Customer;
  customerId: string;

  loading = true;
  sending = false;

  errorMatcher = new AppErrorStateMatcher();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    public customerService: CustomerService,
    @Optional() public dialogRef: MatDialogRef<any>,
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogData: any,
  ) {}

  ngOnInit(): void {
    this.customerId = this.route.snapshot.paramMap.get('customerId');
    this.customerForm = new FormGroup({
      firstName: new FormControl('', [
        Validators.required,
        Validators.maxLength(100),
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.maxLength(100),
      ]),
      email: new FormControl(
        '',
        [Validators.required, Validators.email],
        this.validateEmailIsTaken.bind(this),
      ),
    });

    // Loads customer data
    if (this.customerId) {
      this.getCustomer(this.customerId);
    } else {
      this.loading = false;
    }
  }

  isEditMode() {
    return !!this.customerId;
  }

  isDialog() {
    return !!this.dialogRef;
  }

  closeDialog(res?: any) {
    if (this.isDialog()) {
      this.dialogRef.close(res);
    }
  }

  onSubmit() {
    if (this.customerForm.valid && this.sending === false) {
      const customer: Customer = {
        firstName: this.customerForm.get('firstName').value,
        lastName: this.customerForm.get('lastName').value,
        email: this.customerForm.get('email').value,
      };

      if (this.isEditMode()) {
        this.updateCustomer(this.customerId, customer);
      } else {
        this.addCustomer(customer);
      }
    }
  }

  getCustomer(customerId: string) {
    this.customerService.get(customerId).subscribe(
      res => {
        this.customerForm.patchValue({
          _id: res._id,
          firstName: res.firstName,
          lastName: res.lastName,
          email: res.email,
        });
        this.loading = false;
      },
      err => {
        this.openSnackBar('Error while loading customer data', 'x');
        this.router.navigate(['customers']);
      },
    );
  }

  addCustomer(cus: Customer) {
    this.sending = true;
    this.customerService.add(cus).subscribe(
      res => {
        this.sending = false;
        this.closeDialog(res);
        this.openSnackBar('Customer is succesfully added', 'x');
      },
      err => {
        this.sending = false;
        this.openSnackBar('Error while adding customer', 'x');
      },
    );
  }

  updateCustomer(customerId: string, customer: Customer) {
    this.sending = true;
    this.customerService.update(customerId, customer).subscribe(
      res => {
        this.sending = false;
        this.closeDialog(res);
        this.openSnackBar('Customer is succesfully updated', 'x');
      },
      err => {
        this.sending = false;
        this.openSnackBar('Error while updating customer', 'x');
      },
    );
  }

  validateEmailIsTaken(
    ctl: AbstractControl,
  ): Observable<ValidationErrors | null> {
    return ctl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(val => this.customerService.getByEmail(val)),
      map(res => {
        // Found customer with the email
        if (res && res._id) {
          if (this.customerId !== res._id) {
            return {
              emailIsTaken: true,
            };
          }
        }
        return null;
      }),
      first(),
    );
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
