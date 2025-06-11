import { Component, OnInit } from '@angular/core';
import {TacheService, Tache} from '../../SERVICES/tache.service';
import { Router} from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  //varibale
  ListarTache: Tache[];

  constructor(private TacheService:TacheService, private router:Router) { }

  ngOnInit(): void {
    this.listarTache();
  }


  listarTache()
  {
    this.TacheService.getTaches().subscribe(
      res=>{
        console.log(res);
        this.ListarTache=<any>res;
      },
      err => console.log(err)
    );
  }


  delete(id:string)
  {
    this.TacheService.deleteTache(id).subscribe(
      res=>{
        console.log('Tache eliminado');
        this.listarTache();
      },
      err=> console.log(err)
      );
  }

  update(id:string){
    this.router.navigate(['/edit/'+id]);
  }



}
