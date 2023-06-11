import {
  AngularFireDatabase,
  AngularFireList,
} from '@angular/fire/compat/database';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  employeesRef: AngularFireList<any>;

  constructor(private db: AngularFireDatabase) {
    this.employeesRef = this.db.list('/employees');
  }

  create(employee: any) {
    return this.db.list('/employees').push(employee);
  }

  getAll(): AngularFireList<any> {
    return this.employeesRef;
  }
}
