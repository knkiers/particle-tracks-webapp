import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {MaterializeModule} from "angular2-materialize";

import { InputWakeUpDirective } from './directives/input-wake-up.directive';
import { RoundRealPipe } from './pipes/round-real.pipe';
import { NeutralDecaysComponent } from './static-content/neutral-decays/neutral-decays.component';
import { MassesComponent } from './static-content/masses/masses.component';
import { ParticleTooltipComponent } from './static-content/particle-tooltip/particle-tooltip.component';
import { ChargedDecaysComponent } from './static-content/charged-decays/charged-decays.component';

@NgModule({
  imports: [
    CommonModule,
    MaterializeModule
  ],
  declarations: [
    InputWakeUpDirective,
    RoundRealPipe,
    NeutralDecaysComponent,
    MassesComponent,
    ParticleTooltipComponent,
    ChargedDecaysComponent
  ],
  exports: [
    InputWakeUpDirective,
    RoundRealPipe,
    NeutralDecaysComponent,
    ChargedDecaysComponent
  ]
})
export class SharedModule { }
