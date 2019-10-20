import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Customer } from '../models/customer';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.sass']
})
export class CustomersComponent implements OnInit {

  displayedColumns: Array<string> = ['name', 'employess', 'location', 'personOfContact', 'telephone'];
  data: Array<any> = [];
  isLoadingResults = true;


  constructor(private api: ApiService) {
  }

  ngOnInit() {
    this.api.getCustomers()
      .subscribe((res: any) => {
        this.data = res;
        console.log('data', this.data);
        this.isLoadingResults = false;
      },
      err => {
        console.log(err); // TODO: handle error
        this.isLoadingResults = false;
    });
  }

}
