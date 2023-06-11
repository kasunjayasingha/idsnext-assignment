import { Injectable } from '@angular/core';

import { AngularFireDatabase, QueryFn } from '@angular/fire/compat/database';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DesignationService {
  constructor(private db: AngularFireDatabase) {}

  getDesignation() {
    return this.db
      .list('/designations')
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((action) => {
            const data = action.payload.val();
            const $key = action.key;
            return Object.assign({ $key }, data);
          });
        })
      );
  }
}
