import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';

@NgModule({
  imports: [
    AppModule,      // Your main application module
    ServerModule,   // Server-specific services
  ],
  bootstrap: [AppComponent]  // Bootstrapped component
})
export class AppServerModule {}