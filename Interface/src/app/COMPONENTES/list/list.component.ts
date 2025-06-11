import { Component, OnInit } from '@angular/core';
import {TacheService, Tache} from '../../SERVICES/tache.service';
import { Router} from '@angular/router';
import{ AuthService } from '../../SERVICES/auth.service'; // Assurez-vous que AuthService est importé correctement
 // Assurez-vous que cette fonction est correctement importée
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  ListarTache: Tache[];
  role: string | null = null;

 

 constructor(
  private TacheService: TacheService,
  private router: Router,
  private authService: AuthService
) {}


  ngOnInit(): void {
    this.role = this.authService.getUserRole();
    this.listarTache();
    
  }


  listarTache()
  {
    this.TacheService.getTaches().subscribe(
      res=>{
        this.ListarTache=<any>res;
      },
      err => console.log(err)
    );
  }


  delete(id:string)
  {
    this.TacheService.deleteTache(id).subscribe(
      res=>{
        this.listarTache();
      },
      err=> console.log(err)
      );
  }

  update(id:string){
    this.router.navigate(['/edit/'+id]);
  }



}
