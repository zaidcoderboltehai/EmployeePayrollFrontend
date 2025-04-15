import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Employee {
  id: number;
  name: string;
  gender: string;
  department: string;
  salary: number;
  startDate: string;
  imagePath: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'https://localhost:44327/api/Employee';

  constructor(private http: HttpClient) { }

  // GET All Employees
  getAllEmployees(): Observable<ApiResponse<Employee[]>> {
    return this.http.get<ApiResponse<Employee[]>>(this.apiUrl);
  }

  // GET Single Employee
  getEmployee(id: number): Observable<ApiResponse<Employee>> {
    return this.http.get<ApiResponse<Employee>>(`${this.apiUrl}/${id}`);
  }

  // POST New Employee
  addEmployee(employee: Omit<Employee, 'id'>): Observable<ApiResponse<Employee>> {
    const payload = {
      ...employee,
      salary: Number(employee.salary)
    };
    return this.http.post<ApiResponse<Employee>>(this.apiUrl, payload);
  }

  // PUT Update Employee
  updateEmployee(id: number, employee: Omit<Employee, 'id'>): Observable<ApiResponse<Employee>> {
    const payload = {
      ...employee,
      salary: Number(employee.salary)
    };
    return this.http.put<ApiResponse<Employee>>(`${this.apiUrl}/${id}`, payload);
  }

  // DELETE Employee
  deleteEmployee(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}