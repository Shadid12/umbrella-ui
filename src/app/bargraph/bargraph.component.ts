import { Component, OnInit } from '@angular/core';
import { Customer } from '../models/customer';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-bargraph',
  templateUrl: './bargraph.component.html',
  styleUrls: ['./bargraph.component.sass']
})
export class BargraphComponent implements OnInit {

  data: Array<any> = [];
  isLoadingResults = true;


  constructor(private api: ApiService) { }

  ngOnInit() {
    this.api.getTopCustomers()
      .subscribe((res: Array<Customer>) => {
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
