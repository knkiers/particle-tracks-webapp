import { Component, OnInit } from '@angular/core';

import {EventDisplayService} from '../../shared/services/event-display.service';


/**
 * This component is instantiated from UserEventsComponent, which sets
 * the value of eventData
 */

@Component({
  selector: 'app-event-energy-momentum',
  templateUrl: './event-energy-momentum.component.html',
  styleUrls: ['./event-energy-momentum.component.css']
})
export class EventEnergyMomentumComponent implements OnInit {

  eventData: any = null;
  eventActivatedDots: any = null;
  studentData: any = null;
  eventDataSummary: any = null;

  constructor(private eventDisplayService: EventDisplayService) { }

  ngOnInit() {
    //console.log('eventData: ', this.eventData);
    this.buildEventDataSummary();
    this.determineActivatedDots();
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
      let pMag = circle.r*0.3*bMag;
      let bestFitIndex = this.bestFitIndex(circle);
      let bestFitMass: number = null;
      let energyFit: number = null;
      let name: string = null;
      if (bestFitIndex !== null) {
        bestFitMass = this.eventActivatedDots[bestFitIndex].mass;
        energyFit = Math.sqrt(pMag*pMag + bestFitMass*bestFitMass);
        name = this.eventActivatedDots[bestFitIndex].name;
      }
      this.studentData.push(
        {
          circleNumber: circleNumber,
          inout: circle.incoming ? 'in' : 'out',
          r: circle.r,
          pMag: pMag,
          px: pMag*Math.cos(circle.theta),
          py: pMag*Math.sin(circle.theta),
          theta: circle.theta,
          mass: bestFitMass,
          energy: energyFit,
          name: name,
          activatedDotsIndex: bestFitIndex
        }
      );
      circleNumber++;
    });
  }

  determineActivatedDots() {
    this.eventActivatedDots = [];
    let bMag = this.eventData.bFieldStrength;
    let bFieldDirection = this.eventData.bFieldDirection;
    let dots = this.eventData.dots;
    let boundaries = this.eventData.boundaries;
    let interactionLocation = this.eventData.interactionLocation;

    // determine the activated dots for the parent
    let charge = this.eventData.event.parent.charge;
    let px = this.eventData.event.parent.energy_momentum[1];
    let py = this.eventData.event.parent.energy_momentum[2];

    let activatedDotIndex = 0;
    if (charge != 0) {
      let particleDirection = this.eventDisplayService.inOut(bFieldDirection, charge);
      let pathParams = this.eventDisplayService.curvedPathParams(bMag, dots, boundaries, interactionLocation,
        px, py, particleDirection, 'incoming');
      this.eventActivatedDots.push({
        dotIndices: pathParams.activatedDots,
        mass: this.eventData.event.parent.mass,
        index: activatedDotIndex,
        name: this.eventData.event.parent.particle_name
      });
      activatedDotIndex++;
    }

    // determine the activated dots for the decay products
    this.eventData.event.decay_products.forEach(particle => {
      let charge = particle.charge;
      let px = particle.energy_momentum[1];
      let py = particle.energy_momentum[2];
      if (charge != 0) {
        let particleDirection = this.eventDisplayService.inOut(bFieldDirection, charge);
        let pathParams = this.eventDisplayService.curvedPathParams(bMag, dots, boundaries, interactionLocation,
          px, py, particleDirection, 'outgoing');
        this.eventActivatedDots.push({
          dotIndices: pathParams.activatedDots,
          mass: particle.mass,
          index: activatedDotIndex,
          name: particle.particle_name
        });
        activatedDotIndex++;
      }
    });
  }

  // this method determines which set of eventActivatedDots best matches
  // the dots in circle (which is a student-defined set of circle dots)
  bestFitIndex(circle) {
    let maxNumberMatches = 0;
    let bestIndex: number = null;
    this.eventActivatedDots.forEach(activatedDotsElement => {
      let numberMatches = 0;
      circle.dotIndices.forEach(circleDotIndex => {
        if (activatedDotsElement.dotIndices.includes(circleDotIndex)) {
          numberMatches++;
        }
      });
      if (numberMatches > maxNumberMatches) {
        maxNumberMatches = numberMatches;
        bestIndex = activatedDotsElement.index
      }
    });
    return bestIndex;
  }

}
