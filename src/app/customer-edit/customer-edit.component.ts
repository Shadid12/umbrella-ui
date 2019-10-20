import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';
import { Customer } from '../models/customer';



export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-customer-edit',
  templateUrl: './customer-edit.component.html',
  styleUrls: ['./customer-edit.component.sass']
})
export class CustomerEditComponent implements OnInit {

  editForm: FormGroup;
  id = '';
  isLoadingResults = false;
  matcher = null;
  employees = 0;
  location = '';
  name = '';
  personOfContact = '';
  telephone = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private api: ApiService,
    private formBuilder: FormBuilder
  ) {
    this.matcher = new MyErrorStateMatcher();
   }

  ngOnInit() {
    this.getProduct(this.route.snapshot.params.id);
    this.editForm = this.formBuilder.group({
      name : [null, Validators.required],
      personOfContact : [null, Validators.required],
      employees : [0, Validators.required],
      location : [null, Validators.required],
      telephone : [0, Validators.required]
    });
  }

  getProduct(id: any) {
    this.isLoadingResults = true;
    this.api.getCustomer(id).subscribe((data: any) => {
      this.id = data._id;
      this.editForm.setValue({
        name: data.name,
        personOfContact: data.personOfContact,
        employees: data.employees,
        location: data.location,
        telephone: data.telephone
      });
      this.isLoadingResults = false;
    });
  }

  onFormSubmit() {
    this.isLoadingResults = true;
    this.api.updateProduct(this.id, this.editForm.value)
      .subscribe((customer: Customer) => {
          console.log('updated', customer)
          this.isLoadingResults = false;
          this.router.navigate(['/customer-details', this.id]);
        }, (err: any) => {
          console.log(err);
          this.isLoadingResults = false;
        }
      );
  }

  productDetails() {
    this.router.navigate(['/customer-details', this.id]);
  }

}
