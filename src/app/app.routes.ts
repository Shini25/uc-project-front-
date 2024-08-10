import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

//auth 
import { PageNotFoundComponentComponent } from './page-not-found-component/page-not-found-component.component';
import { AccountCreatedDialogComponent } from './create-account/account-created-dialog/account-created-dialog.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { SuccessDialogComponent } from './uc-form/success-dialog/success-dialog.component';
import { MotDuChefComponent } from './list-uc/motduchef/motduchef.component';

import { LoginComponent } from './login/login.component';
import { ListUcComponent } from './list-uc/list-uc.component';
import { UcFormComponent } from './uc-form/uc-form.component';
export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'create-account',
        component: CreateAccountComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'compte-cree-avec-succes',
        component: AccountCreatedDialogComponent
    },
    {
        path: 'success-dialog',
        component: SuccessDialogComponent
    },
    {
        path: 'uc-form',
        component: UcFormComponent
    },
    {
        path: 'list-uc',
        component: ListUcComponent
    },
    {
        path: 'uc-motduchef/:ucId',
        component: MotDuChefComponent
    },
    {
        path: '**',
        component: PageNotFoundComponentComponent
    },
];