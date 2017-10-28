import { Component, OnInit, Input } from '@angular/core';

import {EventAnalysisService} from '../../shared/services/event-analysis.service';
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

  @Input() eventData: any = null;

  eventActivatedDots: any = null; // an array containing sets of activated dots and other properties for each particle in the event
  studentData: any = null;
  studentNeutralData: any = null;
  studentDeltaData: any = null;
  eventDataSummary: any = null;
  errorMessages: any = [];
  studentDataIsValid: boolean = true;
  numberChargedParticles: number = 0;
  numberNeutralParticles: number = 0;
  eventNeutralData: any = null;//if there is a neutral particle, this contains its mass and name
  incomingIsCharged: boolean = true;
  neutralParticleData: any = null; // if there is a neutral particle (assumed to at most one neutral particle!), this will contain some of its data

  constructor(private eventDisplayService: EventDisplayService,
              private eventAnalysisService:EventAnalysisService) { }

  ngOnInit() {
    //console.log('eventData: ', this.eventData);
    this.buildEventDataSummary();
    this.characterizeEvent(); // determine # of charged/neutral particles, etc.
    this.determineActivatedDots();
    this.buildStudentData();
    this.checkErrors();
    this.checkEnergyMomentumConservation();
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

  characterizeEvent() {
    this.incomingIsCharged = !(this.eventData.event.parent.charge === 0);
    this.numberChargedParticles = 0;
    this.numberNeutralParticles = 0;
    if (this.incomingIsCharged) {
      this.numberChargedParticles++;
    } else {
      this.numberNeutralParticles++;
      this.eventNeutralData = {
        mass: this.eventData.event.parent.mass,
        name: this.eventData.event.parent.particle_name
      }
    }
    this.eventData.event.decay_products.forEach(particle => {
      if (particle.charge === 0) {
        this.numberNeutralParticles++;
        this.eventNeutralData = {
          mass: particle.mass,
          name: particle.particle_name
        }
      } else {
        this.numberChargedParticles++;
      }
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
          inout: circle.incoming ? 'in' : 'out',//text for template
          incoming: circle.incoming,//boolean
          CW: circle.CW,
          r: circle.r,
          pMag: pMag,
          px: pMag*Math.cos(circle.theta),
          py: pMag*Math.sin(circle.theta),
          theta: circle.theta,
          mass: bestFitMass,
          energy: energyFit,
          name: name,
          activatedDotsIndex: bestFitIndex,
          error: false
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
        name: this.eventData.event.parent.particle_name,
        incoming: true,
        CW: particleDirection === 'cw'
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

        console.log('particle direction: ', particleDirection);
        console.log('pathParams: ', pathParams);

        this.eventActivatedDots.push({
          dotIndices: pathParams.activatedDots,
          mass: particle.mass,
          index: activatedDotIndex,
          name: particle.particle_name,
          incoming: false,
          CW: particleDirection === 'cw'
        });
        activatedDotIndex++;
      }
    });

    console.log('activated dots: ', this.eventActivatedDots);

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

  /**
   * this method checks for some gross errors, such as:
   *  - the number of student-created circles is > or < than the # of charged particles
   *  - two or more student-created circles appear to correspond to the same same charged particle
   */
  checkErrors() {
    // check # of student circles and compare against event data
    if (this.eventData.circles && this.eventData.circles.length > this.numberChargedParticles) {
      this.errorMessages.push('The number of student-created circles exceeds the number of charged particles in the event.');
      this.studentDataIsValid = false;
    }
    if (this.eventData.circles && this.eventData.circles.length < this.numberChargedParticles) {
      this.errorMessages.push('The number of student-created circles is less than the number of charged particles in the event.');
      this.studentDataIsValid = false;
    }

    // check "incoming" and "outgoing" properties for students' data
    let circleNumber: number = 0;
    this.studentData.forEach(circle => {
      if (this.eventActivatedDots[circle.activatedDotsIndex].incoming !== circle.incoming) {
        this.studentDataIsValid = false;
        circle.error = true;
        this.errorMessages.push(`Circle #${circleNumber+1}: incoming/outgoing property of the circle does not match that of the particle in the event.`);
      }
      //check for a repeat
      for (var i = circleNumber+1; i < this.studentData.length; i++) {
        console.log('circleNumber: ', circleNumber, 'i: ', i);
        if (circle.activatedDotsIndex === this.studentData[i].activatedDotsIndex) {
          // two circles refer to the same set of dots generated by a charged particle....
          this.studentDataIsValid = false;
          circle.error = true;
          this.studentData[i].error = true;
          this.errorMessages.push(`Circle #${circleNumber+1} and Circle #${i+1} appear to refer to the same charged particle track.`);
        }
      }
      //check the sense of the rotation (CW or CCW) to see if the student's data matches the actual event
      if (this.eventActivatedDots[circle.activatedDotsIndex].CW !== circle.CW) {
        this.studentDataIsValid = false;
        circle.error = true;
        this.errorMessages.push(`Circle #${circleNumber+1}: the rotation (CW/CCW) property of the student-created circle does not match that of the particle in the event.`);
      }
      circleNumber++;
    });
  }

  checkEnergyMomentumConservation() {
    let inpx: number = 0;
    let outpx: number = 0;
    let inpy: number = 0;
    let outpy: number = 0;
    let inE: number = 0;
    let outE: number = 0;

    let maxPx: number = 0;
    let maxPy: number = 0;
    let maxE: number = 0;

    this.studentData.forEach(circle => {
      if (Math.abs(circle.px) > maxPx) {
        maxPx = Math.abs(circle.px);
      }
      if (Math.abs(circle.py) > maxPy) {
        maxPy = Math.abs(circle.py);
      }
      if (circle.incoming) {
        inpx += circle.px;
        inpy += circle.py;
        inE += circle.energy;
      } else {
        outpx += circle.px;
        outpy += circle.py;
        outE += circle.energy;
      }
    });

    console.log('inpx: ', inpx);
    console.log('inpy: ', inpy);
    console.log('inE: ', inE);
    console.log('outpx: ', outpx);
    console.log('outpy: ', outpy);
    console.log('outE: ', outE);

    if (this.numberNeutralParticles === 0) {
      this.studentDeltaData = {
        deltaPx: inpx - outpx,
        deltaPy: inpy - outpy,
        deltaE: inE - outE,
        deltaPxPercent: maxPx > 0 ? (inpx-outpx)*100/maxPx : '??',
        deltaPyPercent: maxPy > 0 ? (inpy-outpy)*100/maxPy : '??',
        deltaEPercent: inE > 0 ? (inE-outE)*100/inE : '??',
      }
    } else {// there is a neutral particle
      let mass = this.eventNeutralData.mass;
      let name = this.eventNeutralData.name;
      if (this.incomingIsCharged) {// one of the final state particles is neutral
        let pMag = Math.sqrt((inpx-outpx)*(inpx-outpx) + (inpy-outpy)*(inpy-outpy));
        this.studentNeutralData = {
          circleNumber: '-',
          inout: 'out',
          incoming: false,
          CW: null,
          r: '-',
          pMag: pMag,
          px: inpx-outpx,
          py: inpy-outpy,
          theta: '-',
          mass: mass,
          energy: Math.sqrt(pMag*pMag+mass*mass),
          name: name,
          activatedDotsIndex: null,
          error: false
        }
        let deltaE = inE - outE - Math.sqrt(pMag*pMag+mass*mass);
        this.studentDeltaData = {
          deltaPx: '-',
          deltaPy: '-',
          deltaE: deltaE,
          deltaPxPercent: '',
          deltaPyPercent: '',
          deltaEPercent: inE > 0 ? deltaE*100/inE : '??',
        }
      } else { // incoming particle is neutral
        let pMag = Math.sqrt(outpx*outpx + outpy*outpy);
        this.studentNeutralData = {
          circleNumber: '-',
          inout: 'in',
          incoming: true,
          CW: null,
          r: '-',
          pMag: pMag,
          px: outpx,
          py: outpy,
          theta: '-',
          mass: mass,
          energy: Math.sqrt(pMag*pMag+mass*mass),
          name: name,
          activatedDotsIndex: null,
          error: false
        }
        inE = Math.sqrt(pMag*pMag+mass*mass)
        let deltaE = inE - outE;
        this.studentDeltaData = {
          deltaPx: '-',
          deltaPy: '-',
          deltaE: deltaE,
          deltaPxPercent: '',
          deltaPyPercent: '',
          deltaEPercent: inE > 0 ? deltaE*100/inE : '??',
        }
      }
    }
  }

  closeAnalysisDisplay() {
    this.eventAnalysisService.announcedAnalysisDisplayClosed();
  }


}
