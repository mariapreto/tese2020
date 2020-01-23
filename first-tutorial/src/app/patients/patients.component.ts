import { Component, OnInit } from '@angular/core';

import { Patient } from '../patient';
import { PatientService } from '../patient.service';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css']
})
export class PatientsComponent implements OnInit {

  patients : Patient[];

  constructor(private patientService: PatientService) { }

  ngOnInit() {
    this.getPatients();
  }

  getPatients(): void{
    this.patientService.getPatients().subscribe(patients => this.patients = patients);
  }

  add(name: string, age: number): void {
    name = name.trim();
    if(!name || !age) { return; }
    this.patientService.addPatient({ name, age } as Patient)
      .subscribe( patient => { this.patients.push(patient) 
    });
  }

  delete(patient: Patient): void {
    this.patients = this.patients.filter(h => h !== patient);
    this.patientService.deletePatient(patient).subscribe();
  }

}
