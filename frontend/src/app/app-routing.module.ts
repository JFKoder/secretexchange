import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { EncComponent } from './enc/enc.component';
import { DecComponent } from './dec/dec.component';
import { AboutComponent } from './about/about.component';

const routes: Routes = [
  { path: '', component: EncComponent },
  { path: 'about', component: AboutComponent },
  { path: 'encrypt', component: EncComponent },
  { path: 'decrypt', component: DecComponent },
  { path: 'decrypt/:id', component: DecComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
