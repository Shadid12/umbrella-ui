import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';



/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}


@Component({
  selector: 'app-customer-add',
  templateUrl: './customer-add.component.html',
  styleUrls: ['./customer-add.component.sass']
})
export class CustomerAddComponent implements OnInit {

  cutomerForm: FormGroup;
  isLoadingResults = false;
  matcher  = null;
  employees = 0;
  location = '';
  name = '';
  personOfContact = '';
  telephone = 0;

  constructor(
    private router: Router,
    private api: ApiService,
    private formBuilder: FormBuilder
  ) {
    this.matcher = new MyErrorStateMatcher();
  }



  ngOnInit() {
    this.cutomerForm = this.formBuilder.group({
      name : [null, Validators.required],
      personOfContact : [null, Validators.required],
      employees : [0, Validators.required],
      location : [null, Validators.required],
      telephone : [0, Validators.required]
    });
  }

  onFormSubmit() {
    this.isLoadingResults = true;
    this.api.addCustomer(this.cutomerForm.value)
      .subscribe((res: any) => {
          const id = res._id;
          this.isLoadingResults = false;
          this.router.navigate(['/customers']);
        }, (err: any) => {
          console.log(err);
          this.isLoadingResults = false;
        });
  }

}
