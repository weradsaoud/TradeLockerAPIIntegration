import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { authGuard, loginGuard } from '../guards/auth.guard';

export const routes: Routes = [
  { path: '', canActivate: [loginGuard('home')], component: LoginComponent }, // Login page as default route
  { path: 'home', canMatch: [authGuard('/')], component: HomeComponent }, // Home page route
];
