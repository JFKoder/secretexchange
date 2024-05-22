import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { EncComponent } from './enc/enc.component';
import { DecComponent } from './dec/dec.component';

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'encrypt', component: EncComponent },
  { path: 'decrypt', component: DecComponent },
  { path: 'decrypt:guid', component: DecComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
