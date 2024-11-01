import { Component, OnInit } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [],
  templateUrl: './appointment.component.html',
  styleUrl: './appointment.component.css'
})
export class AppointmentComponent {
  imageUrl: string = '../../assets/appointment/girl.png';
  textAreaRows: number = 8;
  textAreaCols: number = 31;

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit() {
    this.breakpointObserver.observe([
      '(max-width: 1440px)'
    ]).subscribe(result => {
      // console.log('Width:', window.innerWidth);
      if (result.matches) {
        this.imageUrl = '../../assets/appointment/girl_med.png';
        this.textAreaRows = 4;
      }
    });
  }
}
