import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-event-energy-momentum',
  templateUrl: './event-energy-momentum.component.html',
  styleUrls: ['./event-energy-momentum.component.css']
})
export class EventEnergyMomentumComponent implements OnInit {

  eventData: any = null;
  studentData: any = null;
  eventDataSummary: any = null;

  constructor() { }

  ngOnInit() {
    //console.log('eventData: ', this.eventData);
    this.buildEventDataSummary();
    this.buildStudentData();
  }

  // the data coming from the server has px and py, but not |p|, which is
  // also useful in the template, so those are added here
  buildEventDataSummary() {
    this.eventDataSummary = [];
    let px = this.eventData.event.parent.energy_momentum[1];
    let py = this.eventData.event.parent.energy_momentum[2];
    let theta = (Math.atan2(py,px) + 2*Math.PI) % (2*Math.PI);
    this.eventDataSummary.push(
      {
        name: this.eventData.event.parent.particle_name,
        alias: this.eventData.event.parent.particle_alias,
        inout: 'in',
        mass: this.eventData.event.parent.mass,
        px: px,
        py: py,
        theta: theta,
        pMag: Math.sqrt(px * px + py * py),
        energy: this.eventData.event.parent.energy_momentum[0]
      });
    this.eventData.event.decay_products.forEach(particle => {
      let Ep = particle.energy_momentum;
      let pMag = Math.sqrt(Ep[1] * Ep[1] + Ep[2] * Ep[2]);
      this.eventDataSummary.push({
        name: particle.particle_name,
        alias: particle.particle_alias,
        inout: 'out',
        mass: particle.mass,
        px: Ep[1],
        py: Ep[2],
        theta: (Math.atan2(Ep[2],Ep[1]) + 2*Math.PI) % (2*Math.PI),
        pMag: pMag,
        energy: Ep[0]
      });
    });
  }
  // this method is used to determine what the students should get for the
  // various momenta, based on the radii of the circles, etc.
  buildStudentData() {
    let bMag = this.eventData.bFieldStrength;
    this.studentData = [];
    let circleNumber: number = 1;
    this.eventData.circles.forEach(circle => {
      this.studentData.push(
        {
          circleNumber: circleNumber,
          inout: circle.incoming ? 'in' : 'out',
          r: circle.r,
          pMag: circle.r*0.3*bMag,
          px: circle.r*0.3*bMag*Math.cos(circle.theta),
          py: circle.r*0.3*bMag*Math.sin(circle.theta),
          theta: circle.theta
        }
      );
      circleNumber++;
    });
  }



  /*
   circleInfo(i: number){
   console.log(this.circles[i]);
   if(this.circles[i].theta) {
   console.log('px: ' + 0.3 * 80 * this.circles[i].r * Math.cos(this.circles[i].theta));
   console.log('py: ' + 0.3 * 80 * this.circles[i].r * Math.sin(this.circles[i].theta));
   }
   console.log('parent: ' + this.event.parent.energy_momentum[0] + ' ' + this.event.parent.energy_momentum[1] + ' ' + this.event.parent.energy_momentum[2]);
   for (var j in this.event.decay_products) {
   console.log('decay product: ' + this.event.decay_products[j].energy_momentum[0] + ' ' + this.event.decay_products[j].energy_momentum[1] + ' ' + this.event.decay_products[j].energy_momentum[2]);
   }
   console.log(this.event);
   }
   */

}
