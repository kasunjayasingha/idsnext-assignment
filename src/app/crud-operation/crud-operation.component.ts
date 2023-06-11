import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { faPenSquare } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { DesignationService } from '../designation.service';
import { EmployeeService } from '../employee.service';

@Component({
  selector: 'crud-operation',
  templateUrl: './crud-operation.component.html',
  styleUrls: ['./crud-operation.component.css'],
})
export class CrudOperationComponent implements OnInit {
  designations$: Observable<any[]>;
  employees$: Observable<any[]>;
  employee: any = {};

  faTrashCan = faTrashCan;
  faPenSquare = faPenSquare;

  constructor(
    private router: Router,
    private designationService: DesignationService,
    private employeeService: EmployeeService
  ) {
    this.designations$ = designationService.getDesignation();
    this.employees$ = this.employeeService.getAll().valueChanges();
  }

  save(employee: any) {
    const selectedDesignationId = employee.designation; // Get the selected employee category
    this.designations$.subscribe((designations) => {
      const selectedDesignation = designations.find(
        (c) => c.$key === selectedDesignationId
      )?.$key;
      this.employee = {
        name: employee.name,
        designation: selectedDesignation,
        salary: employee.salary,
      };
      // console.log(this.employee);
      this.employeeService.create(this.employee);
    });
  }

  ngOnInit(): void {}
}
