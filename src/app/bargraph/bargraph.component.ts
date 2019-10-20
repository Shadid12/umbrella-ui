import { Component, OnInit } from '@angular/core';
import { Customer } from '../models/customer';
import { ApiService } from '../api.service';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-bargraph',
  templateUrl: './bargraph.component.html',
  styleUrls: ['./bargraph.component.sass']
})
export class BargraphComponent implements OnInit {

  data: Array<any> = [];
  isLoadingResults = true;


  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels: Label[] = ['2006', '2007', '2008', '2009'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartDataSets[] = [
    { 
      data: [65, 59, 80, 81], 
      label: 'Customer Employees',
      backgroundColor: [
        'red',
        'green',
        'pink',
        'cyan',
      ] 
    }
  ];


  constructor(private api: ApiService) { }

  ngOnInit() {
    this.isLoadingResults = true;
    this.api.getTopCustomers()
      .pipe(
        tap(
          (customerData) => {
            console.log('first observable', customerData);
              customerData.forEach((value, index) => {
                this.getWeatherData(index, value)
              })
          },
          (erro) => console.log('something went wrong')
        )
      )
      .subscribe((res: Array<Customer>) => {
        this.data = res;
        console.log('data', this.data);
      },
      err => {
        console.log(err); // TODO: handle error
      });
      // .then((customerData: Array<Customer>) => {
      //   customerData.forEach((value, index) => {
      //     this.getWeatherData(index, value)
      //   })
      // })
      // .catch((err) => {
      //   debugger
      //   console.log(err)
      // })
  }

  getWeatherData(index: Number, data: Customer) {
    this.isLoadingResults = true;
    this.api.callOpenWeather(data.location)
      .subscribe((res: any) => {
        console.log('index', index)
        console.log('weather', res)
      },
      err => {
        console.log(err); // TODO: handle error
      });
  }

}
