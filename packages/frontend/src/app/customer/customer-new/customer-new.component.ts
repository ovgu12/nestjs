import { Inject, Component, OnInit, Optional } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors, FormGroupDirective, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {ErrorStateMatcher} from '@angular/material/core';

import { CustomerService } from '../customer.service';
import { Customer } from '../models/customer';
import { Observable } from 'rxjs';
import { debounceTime, map, distinctUntilChanged, switchMap, first } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';


/** Error when invalid control is dirty, touched, or submitted. */
export class CustomerErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-customer-new',
  templateUrl: './customer-new.component.html',
  styleUrls: ['./customer-new.component.scss']
})
export class CustomerNewComponent implements OnInit {

  customerForm: FormGroup;

  customer: Customer;
  customerId: string;

  loading = true;
  sending = false;

  errorMatcher = new CustomerErrorStateMatcher();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public customerService: CustomerService,
    private snackBar: MatSnackBar,
    @Optional() public dialogRef: MatDialogRef<any>,
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogData: any) { }

  ngOnInit(): void {
    this.customerId = this.route.snapshot.paramMap.get('customerId');
    this.customerForm = new FormGroup(
      {
        firstName: new FormControl('', [Validators.required, Validators.maxLength(100)]),
        lastName: new FormControl('', [Validators.required, Validators.maxLength(100)]),
        email: new FormControl(
          '',
          [Validators.required, Validators.email],
          this.validateEmail.bind(this)
        ),
      }
    );

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
      this.sending = true;
      const customer: Customer = {
        firstName: this.customerForm.get('firstName').value,
        lastName: this.customerForm.get('lastName').value,
        email: this.customerForm.get('email').value,
      };

      if (!this.customerId) {
        this.addCustomer(customer);
      } else {
        this.updateCustomer(this.customerId, customer);
      }
    }
  }

  getCustomer(customerId: string) {
    this.customerService.get(customerId).subscribe(res => {
      this.customerForm.patchValue({
        _id: res._id,
        firstName: res.firstName,
        lastName: res.lastName,
        email: res.email
      });
      this.loading = false;
    }, err => {
      this.openSnackBar('Error while loading customer data', 'x');
      this.router.navigate(['customers']);
    });
  }

  addCustomer(cus: Customer) {
    this.customerService.add(cus).subscribe(res => {
      this.sending = false;
      this.closeDialog(res);
      this.openSnackBar('Customer is succesfully added', 'x');
    });
  }

  updateCustomer(customerId: string, customer: Customer) {
    this.customerService.update(customerId, customer).subscribe(res => {
      this.sending = false;
      this.closeDialog(res);
      this.openSnackBar('Customer is succesfully updated', 'x');
    });
  }

  validateEmail(ctl: AbstractControl): Observable <ValidationErrors | null> {
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
