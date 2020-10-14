import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WebsocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-grafica',
  templateUrl: './grafica.component.html',
  styleUrls: ['./grafica.component.css']
})
export class GraficaComponent implements OnInit {

  public lineChartData: Array<any> = [
    { data: [ 0, 0, 0, 0 ], label: 'Ventas'}
  ];

  public lineChartLabels: Array<any> = ['Enero', 'Febrero', 'Marzo', 'Abril' ];


  constructor(
    private http: HttpClient,
    public wsService: WebsocketService
  ) { }

  ngOnInit() {

    this.getData();
    this.escucharSocket();

  }

  getData() {

    this.http.get('http://localhost:5000/grafica')
      .subscribe( (data: any) => this.lineChartData = data );
  }

  escucharSocket() {

    this.wsService.listen('cambio-grafica')
      .subscribe( (data: any) => {

        console.log('socket', data);
        this.lineChartData = data;
      });

  }

}
