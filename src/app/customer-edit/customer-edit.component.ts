import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';



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
  title = null;
  desc = '';
  isLoadingResults = false;
  matcher = null;

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
      title : [null, Validators.required],
      desc : [null, Validators.required],
      id: [null, Validators.required]
    });
  }

  getProduct(id: any) {
    this.api.getCustomer(id).subscribe((data: any) => {
      this.id = data.id;
      debugger
      this.editForm.setValue({
        title: data.title,
        desc: data.desc,
        id: data.id
      });
    });
  }

  onFormSubmit() {
    this.isLoadingResults = true;
    this.api.updateProduct(this.id, this.editForm.value)
      .subscribe((res: any) => {
          const id = res._id;
          this.isLoadingResults = false;
          this.router.navigate(['/customer-details', id]);
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
