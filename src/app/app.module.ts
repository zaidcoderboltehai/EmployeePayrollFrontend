import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';

// Main components
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Feature components
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EmployeeRegisterComponent } from './components/employee-register/employee-register.component';

// Services
import { UserService } from './services/user.service';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    EmployeeRegisterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    MatSnackBarModule
  ],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }