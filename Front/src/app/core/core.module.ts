import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { Error404Component } from './components/error404/error404.component';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HttpRequestInterceptor } from './interceptors/http-request.interceptor';
import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './services/auth.service';
import { UsersService } from './services/users.service';



@NgModule({
  declarations: [HeaderComponent, FooterComponent, Error404Component],
  exports: [HeaderComponent, FooterComponent, Error404Component],
  imports: [
    HttpClientModule,
    RouterModule,
    FormsModule,
    CommonModule
  ],
  providers: [
    [
      { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true }
    ],
    [AuthGuard],
    [AuthService],
    [UsersService]
  ],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}
