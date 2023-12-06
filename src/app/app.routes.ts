import { Routes } from '@angular/router';
import { HomePageComponent } from './core/home-page/home-page.component';
import { ThemesComponent } from './core/themes/themes.component';
import { MatematicaComponent } from './matematica/matematica.component';

export const routes: Routes = [
  {path: '',component: HomePageComponent},
  {path: 'matematica/:operacao', component: MatematicaComponent},
  {path: 'theme', component: ThemesComponent},

];
