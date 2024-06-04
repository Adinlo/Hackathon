import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './core/guards/auth.guard';
import { Error404Component } from './core/components/error404/error404.component';

const routes: Routes = [
    { 
        path: 'home',  
        loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule)
    },
    { 
        path: 'auth',  
        loadChildren: () => import('./modules/connection/connection.module').then(m => m.ConnectionModule)
    },
    { 
        path: 'account',  
        loadChildren: () => import('./modules/account/account.module').then(m => m.AccountModule),
        canActivate:[AuthGuard]
    },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: '**', component: Error404Component },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash : true } )],
    exports: [RouterModule]
})
export class AppRoutingModule {}
