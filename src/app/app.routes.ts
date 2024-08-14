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
import { CircuitDeTraitementComponent } from './Livret/circuit-de-traitement/circuit-de-traitement.component';
import { GuideComponent } from './Livret/guide/guide.component';
import { ManuelDeProcedureComponent } from './Livret/manuel-de-procedure/manuel-de-procedure.component';
import { ArchivageCourrierComponent } from './courrier/archivage-courrier/archivage-courrier.component';
import { ListeCourrierComponent } from './courrier/liste-courrier/liste-courrier.component';
import { LoginComponent } from './login/login.component';
import { ListChefComponent } from './list-chef/list-chef.component';
import { ChefFormComponent } from './chef-form/chef-form.component';

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
        path: 'list-chef',
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
        path: 'circuit-de-traitement',
        component: CircuitDeTraitementComponent
    },
    {
        path: 'guide',
        component: GuideComponent
    },
    {
        path: 'manuel-de-procedure',
        component: ManuelDeProcedureComponent
    },
    {
        path: 'archivage-courrier',
        component: ArchivageCourrierComponent
    },
    {
        path: 'liste-courrier',
        component: ListeCourrierComponent
    },
    {
        path: '**',
        component: PageNotFoundComponentComponent
    },
];