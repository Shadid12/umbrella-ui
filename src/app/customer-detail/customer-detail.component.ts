import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.sass']
})
export class CustomerDetailComponent implements OnInit {

  isLoadingResults = true;

  customer: {} = null;

  constructor(private route: ActivatedRoute,
              private api: ApiService,
              private router: Router) { }

  ngOnInit() {
    this.getProductDetails(this.route.snapshot.params.id);
  }

  getProductDetails(id: any) {
    this.api.getCustomer(id)
      .subscribe((data: any) => {
        this.customer = data;
        console.log('Customer', this.customer);
        this.isLoadingResults = false;
      });
  }

  deleteProduct(id: any) {
    this.isLoadingResults = true;
    this.api.deleteProduct(id)
      .subscribe(res => {
          this.isLoadingResults = false;
          this.router.navigate(['/customers']);
        }, (err) => {
          console.log(err);
          this.isLoadingResults = false;
        }
      );
  }

}
