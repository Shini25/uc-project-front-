import { Routes } from '@angular/router';
import { HomeComponent } from './accueil/home.component';

//auth 
import { PageNotFoundComponentComponent } from './page-introuvable/page-not-found-component.component';
import { AccountCreatedDialogComponent } from './create-account/account-created-dialog/account-created-dialog.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { SuccessDialogComponent } from './chef-form/success-dialog/success-dialog.component';
import { MotDuChefComponent } from './list-chef/motduchef/motduchef.component';
import { OrganigrammeDirectionComponent } from './organigramme-direction/organigramme-direction.component';
import { OrganigrammeServiceComponent } from './organigramme-service/organigramme-service.component';
import { ArchivageCourrierComponent } from './courrier/archivage-courrier/archivage-courrier.component';
import { LoginComponent } from './login/login.component';
import { ListChefComponent } from './list-chef/list-chef.component';
import { ChefFormComponent } from './chef-form/chef-form.component';
import { PlanifierReunionComponent } from './reunion/planifier-reunion/planifier-reunion.component';
import { ListeReunionComponent } from './reunion/liste-reunion/liste-reunion.component';
import { DetailsReunionComponent } from './reunion/details-reunion/details-reunion.component';
import { ListeLivretComponent } from './courrier/liste-courrier/liste-livret/liste-livret.component';

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
        path: 'chef-form',
        component: ChefFormComponent
    },
    {
        path: 'liste-chef',
        component: ListChefComponent
    },
    {
        path: 'chef-motduchef/:chefId',
        component: MotDuChefComponent
    },
    {
        path: 'organigramme-direction',
        component: OrganigrammeDirectionComponent
    },
    {
        path: 'organigramme-service',
        component: OrganigrammeServiceComponent
    },
    {
        path: 'archivage-courrier',
        component: ArchivageCourrierComponent
    },
    {
        path: 'planifier-reunion',
        component: PlanifierReunionComponent
    },
    {
        path: 'liste-reunion',
        component: ListeReunionComponent
    },
    {
        path: 'details-reunion/:id',
        component: DetailsReunionComponent
    },
    {
        path: 'liste-livret',
        component: ListeLivretComponent
    },
    {
        path: '**',
        component: PageNotFoundComponentComponent
    },
]