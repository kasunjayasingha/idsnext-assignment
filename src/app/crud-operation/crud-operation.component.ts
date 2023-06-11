import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
      const newEmployee: any = {
        // Update the type to 'string | null'
        name: employee.name,
        designation: selectedDesignation,
        salary: employee.salary,
        key: null, // Initialize key property to null
      };
      this.employeeService
        .create(newEmployee)
        .then((key: string | null) => {
          newEmployee.key = key; // Assign the key returned by the create method
          console.log('New employee key:', key);
          // Rest of your code
        })
        .catch((error) => {
          console.error('Error creating employee:', error);
        });
    });
  }

  @ViewChild('name') name: ElementRef | undefined;
  @ViewChild('designation') designation: ElementRef | undefined;
  @ViewChild('salary') salary: ElementRef | undefined;

  onEditEmployee(id: any) {
    console.log('Edit employee:', id);
    this.employeeService
      .getEmployeeByKey(id)
      .valueChanges()
      .subscribe((employee) => {
        this.employee = {
          name: employee.name,
          designation: employee.designation,
          salary: employee.salary,
        };
        console.log('Employee:', this.employee);
        if (this.name && this.name.nativeElement) {
          this.name.nativeElement.value = this.employee.name;
        }
        if (this.designation && this.designation.nativeElement) {
          this.designation.nativeElement.value = this.employee.designation;
        }
        if (this.salary && this.salary.nativeElement) {
          this.salary.nativeElement.value = this.employee.salary;
        }
      });
  }
  // console.log('Edit employee:', id);
  // console.log('Edit employee:', this.employee[id]);
  // console.log(this.employeeService.getEmployeeByKey(id));

  // this.router.navigate(['/crud-operation', employee.$key]);

  ngOnInit(): void {}
}
