import { Component, OnInit, Input } from '@angular/core';

import {MaterializeDirective,MaterializeAction} from "angular2-materialize";

@Component({
  selector: 'particle-tt',
  templateUrl: './particle-tooltip.component.html',
  styleUrls: ['./particle-tooltip.component.css']
})
export class ParticleTooltipComponent implements OnInit {

  particles = [
    {
      name: 'Sigma-plus',
      symbol: '&#931;<sup>+</sup>',
      humanReadableName: 'charged Sigma',
      mass: '1189.37'
    },
    {
      name: 'proton',
      symbol: 'p',
      humanReadableName: 'proton',
      mass: '938.272'
    },
    {
      name: 'neutron',
      symbol: 'n',
      humanReadableName: 'neutron (neutral)',
      mass: '939.565'
    },
    {
      name: 'D-zero',
      symbol: 'D<sup>0</sup>',
      humanReadableName: 'neutral D meson',
      mass: '1864.83'
    },
    {
      name: 'K-plus',
      symbol: 'K<sup>+</sup>',
      humanReadableName: 'charged kaon',
      mass: '493.677'
    },
    {
      name: 'K-minus',
      symbol: 'K<sup>-</sup>',
      humanReadableName: 'charged kaon',
      mass: '493.677'
    },
    {
      name: 'K-zero',
      symbol: 'K<sup>0</sup><sub>S</sub>',
      humanReadableName: 'neutral kaon ("K-short")',
      mass: '497.611'
    },
    {
      name: 'pi-plus',
      symbol: '&pi;<sup>+</sup>',
      humanReadableName: 'charged pion',
      mass: '139.571'
    },
    {
      name: 'pi-minus',
      symbol: '&pi;<sup>-</sup>',
      humanReadableName: 'charged pion',
      mass: '139.571'
    },
    {
      name: 'pi-zero',
      symbol: '&pi;<sup>0</sup>',
      humanReadableName: 'neutral pion',
      mass: '134.977'
    },
    {
      name: 'positron',
      symbol: 'e<sup>+</sup>',
      humanReadableName: 'positron',
      mass: '0.51100'
    },
    {
      name: 'electron',
      symbol: 'e<sup>-</sup>',
      humanReadableName: 'electron',
      mass: '0.51100'
    },
    {
      name: 'antimuon',
      symbol: '&mu;<sup>+</sup>',
      humanReadableName: 'antimuon',
      mass: '105.658'
    },
    {
      name: 'muon',
      symbol: '&mu;<sup>-</sup>',
      humanReadableName: 'muon',
      mass: '105.658'
    },
    {
      name: 'neutrino',
      symbol: '&nu;',
      humanReadableName: 'neutrino (neutral)',
      mass: '0'
    },
    {
      name: 'antineutrino',
      symbol: '&nu;&#773;',
      humanReadableName: 'antineutrino (neutral)',
      mass: '0'
    },
    {
      name: 'photon',
      symbol: '&#947;',
      humanReadableName: 'photon',
      mass: '0'
    },


  ];

  @Input() particleName: string = 'K-plus';

  name: string = '';
  symbol: string = '';
  humanReadableName: string = '';
  mass: string = '';

  constructor() { }

  ngOnInit() {
    //console.log('particle: ',this.particleName);
  }


  toolTip() {
    for (let particle of this.particles) {
      if (particle.name === this.particleName) {
        this.name = particle.name;
        this.symbol = particle.symbol;
        this.humanReadableName = particle.humanReadableName;
        this.mass = particle.mass;
      }
    }
    return "<div>"+this.symbol+": "+this.humanReadableName+"</div><div>mass: "+this.mass+" MeV/c<sup>2</sup></div>"
  }

}
