import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Patient } from './patient';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const patients = [
      { id: 1, name: 'Maria', age: 45 },
      { id: 2, name: 'Soraia', age: 55 },
      { id: 3, name: 'Prof Manuel', age: 65 },
      { id: 4, name: 'Mónica', age: 75 },
      { id: 5, name: 'José', age: 78 },
      { id: 6, name: 'Amélia', age: 47 },
      { id: 7, name: 'Beatriz', age: 49 },
      { id: 8, name: 'Fátima', age: 60 }
    ];
    return {patients};
  }

  // Overrides the genId method to ensure that a hero always has an id.
  // If the patients array is empty,
  // the method below returns the initial number (11).
  // if the patients array is not empty, the method below returns the highest
  // hero id + 1.
  genId(patients: Patient[]): number {
    return patients.length > 0 ? Math.max(...patients.map(patient => patient.id)) + 1 : 11;
  }
}