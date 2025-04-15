import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { MatSnackBar } from '@angular/material/snack-bar';

interface Employee {
  id: number;
  name: string;
  gender: string;
  department: string;
  salary: number;
  startDate: string;
  imagePath: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: false
})
export class DashboardComponent implements OnInit {
  // Updated logo path with Flaticon URL
  logoPath = "https://cdn-icons-png.flaticon.com/512/4205/4205906.png";
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  searchQuery = "";
  isSearchExpanded = false;

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeeService.getAllEmployees().subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.employees = response.data;
          this.filteredEmployees = [...this.employees];
        } else {
          this.showSnackbar('No employees found or invalid response format', true);
        }
      },
      error: (error) => {
        console.error('Error fetching employees:', error);
        this.showSnackbar('Failed to load employee data. Please try again.', true);
      }
    });
  }

  toggleSearch(): void {
    this.isSearchExpanded = !this.isSearchExpanded;
    if (!this.isSearchExpanded) {
      this.searchQuery = "";
      this.filteredEmployees = [...this.employees];
    }
  }

  searchEmployees(event: Event): void {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    this.searchQuery = query;
    
    this.filteredEmployees = this.employees.filter(emp =>
      emp.name.toLowerCase().includes(query) ||
      emp.gender.toLowerCase().includes(query) ||
      emp.department.toLowerCase().includes(query)
    );
  }

  addEmployee(): void {
    this.router.navigate(['/register']);
  }

  editEmployee(id: number): void {
    this.router.navigate(['/edit', id]);
  }

  navigateToDelete(id: number): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.deleteEmployee(id);
    }
  }

  private deleteEmployee(id: number): void {
    this.employeeService.deleteEmployee(id).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.employees = this.employees.filter(emp => emp.id !== id);
          this.filteredEmployees = this.filteredEmployees.filter(emp => emp.id !== id);
          this.showSnackbar('Employee deleted successfully!');
        } else {
          this.showSnackbar(response.message || 'Failed to delete employee', true);
        }
      },
      error: (error) => {
        console.error('Delete error:', error);
        this.showSnackbar('Delete failed. Please try again.', true);
      }
    });
  }

  private showSnackbar(message: string, isError: boolean = false): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: isError ? 'error-snackbar' : 'success-snackbar'
    });
  }
}