import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

@Component({
  selector: 'app-register',
  templateUrl: './employee-register.component.html',
  styleUrls: ['./employee-register.component.scss'],
  standalone: false
})
export class EmployeeRegisterComponent implements OnInit {
  logoPath = "https://cdn-icons-png.flaticon.com/512/4205/4205906.png";
  
  salaryOptions: number[] = [];
  days: number[] = [];
  months: string[] = [];
  years: number[] = [];
  profileImages: string[] = [
    'https://randomuser.me/api/portraits/women/44.jpg',
    'https://randomuser.me/api/portraits/men/46.jpg',
    'https://randomuser.me/api/portraits/women/65.jpg',
    'https://randomuser.me/api/portraits/men/52.jpg'
  ];

  employeeId?: number;
  isFormSubmitted = false;
  employeeData: any = {
    name: '',
    gender: '',
    department: '',
    salary: null,
    startDate: null,
    imagePath: '',
    day: null,
    month: null,
    year: null
  };

  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initializeFormData();
    this.checkEditMode();
  }

  private initializeFormData(): void {
    this.salaryOptions = Array.from({length: 30}, (_, i) => (i + 1) * 5000);
    this.days = Array.from({length: 31}, (_, i) => i + 1);
    this.months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const currentYear = new Date().getFullYear();
    this.years = Array.from({length: 51}, (_, i) => currentYear - i);
  }

  private checkEditMode(): void {
    this.employeeId = this.route.snapshot.params['id'];
    if (this.employeeId) {
      this.employeeService.getEmployee(this.employeeId).subscribe({
        next: (response: ApiResponse<any>) => {
          if (response.success) {
            this.employeeData = response.data;
            this.parseExistingDate(response.data.startDate);
          } else {
            this.showSnackbar(response.message || 'Failed to load employee data', true);
          }
        },
        error: (err: unknown) => {
          console.error('Employee load error:', err);
          this.showSnackbar(`Error loading employee data: ${this.getErrorMessage(err)}`, true);
        }
      });
    }
  }

  private parseExistingDate(dateString: string): void {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date string');
      }
      
      this.employeeData.day = date.getUTCDate();
      this.employeeData.month = this.months[date.getUTCMonth()];
      this.employeeData.year = date.getUTCFullYear();
    } catch (error) {
      console.error('Date parsing error:', error);
      this.showSnackbar('Invalid date format in employee data', true);
    }
  }

  onDateSelect(): void {
    if (!this.employeeData.year || !this.employeeData.month || !this.employeeData.day) {
      this.showSnackbar('Please select complete Start Date', true);
      return;
    }

    const monthIndex = this.months.indexOf(this.employeeData.month);
    if (monthIndex === -1) {
      this.showSnackbar('Invalid month selection', true);
      return;
    }

    try {
      // Corrected line with proper parentheses
      const date = new Date(Date.UTC(
        Number(this.employeeData.year),
        monthIndex,
        Number(this.employeeData.day)
      )); // Fixed missing parenthesis

      if (
        date.getUTCFullYear() !== Number(this.employeeData.year) ||
        date.getUTCMonth() !== monthIndex ||
        date.getUTCDate() !== Number(this.employeeData.day)
      ) {
        throw new Error('Invalid date combination (e.g., February 30)');
      }

      this.employeeData.startDate = date.toISOString();
    } catch (error) {
      console.error('Date creation error:', error);
      this.employeeData.startDate = null;
      this.showSnackbar(error instanceof Error ? error.message : 'Invalid date combination', true);
    }
  }

  updateDepartments(dept: string, isChecked: boolean): void {
    const departments = this.employeeData.department 
      ? this.employeeData.department.split(', ') 
      : [];
    
    if (isChecked) {
      if (!departments.includes(dept)) departments.push(dept);
    } else {
      const index = departments.indexOf(dept);
      if (index > -1) departments.splice(index, 1);
    }
    
    this.employeeData.department = departments.join(', ');
  }

  onSubmit(): void {
    this.isFormSubmitted = true;
    if (!this.validateForm()) return;
    
    this.onDateSelect();
    if (!this.employeeData.startDate) {
      this.showSnackbar('Invalid date selection', true);
      return;
    }

    const payload = {
      name: this.employeeData.name.trim(),
      gender: this.employeeData.gender,
      department: this.employeeData.department,
      salary: Number(this.employeeData.salary),
      startDate: this.employeeData.startDate,
      imagePath: this.employeeData.imagePath
    };

    if (this.employeeId) {
      this.updateEmployee(payload);
    } else {
      this.createEmployee(payload);
    }
  }

  private validateForm(): boolean {
    const errors = [];
    
    if (!this.employeeData.name?.trim()) {
      errors.push('Employee name is required');
    } else if (this.employeeData.name.trim().length < 3) {
      errors.push('Name must be at least 3 characters');
    }

    if (!this.employeeData.gender) {
      errors.push('Gender selection is required');
    }

    if (!this.employeeData.department) {
      errors.push('At least one department must be selected');
    }

    if (!this.employeeData.salary) {
      errors.push('Salary selection is required');
    }

    if (!this.employeeData.day || !this.employeeData.month || !this.employeeData.year) {
      errors.push('Complete start date is required');
    }

    if (errors.length > 0) {
      this.showSnackbar(errors.join(', '), true);
      return false;
    }
    return true;
  }

  private createEmployee(payload: any): void {
    this.employeeService.addEmployee(payload).subscribe({
      next: (response: ApiResponse<any>) => {
        if (response.success) {
          this.showSnackbar('Employee added successfully!');
          this.router.navigate(['/dashboard']);
        } else {
          this.showSnackbar(response.message || 'Failed to add employee', true);
        }
      },
      error: (err: unknown) => {
        console.error('Add employee error:', err);
        this.showSnackbar(`Error adding employee: ${this.getErrorMessage(err)}`, true);
      }
    });
  }

  private updateEmployee(payload: any): void {
    this.employeeService.updateEmployee(this.employeeId!, payload).subscribe({
      next: (response: ApiResponse<any>) => {
        if (response.success) {
          this.showSnackbar('Employee updated successfully!');
          this.router.navigate(['/dashboard']);
        } else {
          this.showSnackbar(response.message || 'Failed to update employee', true);
        }
      },
      error: (err: unknown) => {
        console.error('Update employee error:', err);
        this.showSnackbar(`Error updating employee: ${this.getErrorMessage(err)}`, true);
      }
    });
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      return error.error.message || error.message;
    }
    if (error instanceof Error) {
      return error.message;
    }
    return 'Unknown error occurred';
  }

  navigateToHome(): void {
    this.router.navigate(['/dashboard']);
  }

  private showSnackbar(message: string, isError: boolean = false): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: isError ? 'error-snackbar' : 'success-snackbar'
    });
  }
}