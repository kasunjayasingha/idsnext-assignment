import {
  AngularFireDatabase,
  AngularFireList,
  AngularFireObject,
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

  // create(employee: any) {
  //   return this.db.list('/employees').push(employee);
  // }
  create(employee: any): Promise<string | null> {
    return new Promise<string | null>((resolve, reject) => {
      this.employeesRef.push(employee).then((ref) => {
        const key = ref.key; // Get the Firebase-generated key
        if (key) {
          this.employeesRef.update(key, { key: key }).then(() => {
            resolve(key);
          });
        } else {
          reject(new Error('Failed to get key for the employee'));
        }
      });
    });
  }

  getAll(): AngularFireList<any> {
    return this.employeesRef;
  }

  getEmployeeByKey(key: string): AngularFireObject<any> {
    return this.db.object(`/employees/${key}`);
  }
}
