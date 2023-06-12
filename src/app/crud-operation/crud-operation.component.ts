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
    const selectedDesignationId = employee.designation;

    this.designations$.subscribe((designations) => {
      const selectedDesignation = designations.find(
        (c) => c.$key === selectedDesignationId
      )?.name;

      const updatedEmployee: any = {
        name: employee.name,
        designation: selectedDesignation,
        salary: employee.salary,
      };

      if (this.editMode) {
        this.employeeService
          .update(this.editIndex, updatedEmployee)
          .then(() => {
            console.log('Employee updated successfully');
            this.editMode = false;
          })
          .catch((error) => {
            console.error('Error updating employee:', error);
          });
      } else {
        this.employeeService
          .create(updatedEmployee)
          .then((key: string | null) => {
            console.log('New employee key:', key);
          })
          .catch((error) => {
            console.error('Error creating employee:', error);
          });
      }
    });
  }

  @ViewChild('name') name: ElementRef | undefined;
  @ViewChild('designation') designation: ElementRef | undefined;
  @ViewChild('salary') salary: ElementRef | undefined;

  editMode: boolean = false;
  editIndex: any;

  onEditEmployee(id: any) {
    this.editMode = true;
    this.editIndex = id;
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

  onResetClick() {
    this.editMode = false;
  }

  onDeleteEmployee(key: string) {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService
        .delete(key)
        .then(() => {
          console.log('Employee deleted successfully');
        })
        .catch((error) => {
          console.error('Error deleting employee:', error);
        });
    }
  }
  // console.log('Edit employee:', id);
  // console.log('Edit employee:', this.employee[id]);
  // console.log(this.employeeService.getEmployeeByKey(id));

  // this.router.navigate(['/crud-operation', employee.$key]);

  ngOnInit(): void {}
}
