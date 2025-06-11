import { Component, OnInit } from '@angular/core';
import {EquipoService, Article} from '../../SERVICES/equipo.service';
import { Router} from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  //varibale
  ListarEquipo: Article[];

  constructor(private EquipoService:EquipoService, private router:Router) { }

  ngOnInit(): void {
    this.listarEquipo();
  }


  listarEquipo()
  {
    this.EquipoService.getEquipos().subscribe(
      res=>{
        console.log(res);
        this.ListarEquipo=<any>res;
      },
      err => console.log(err)
    );
  }


  delete(id:string)
  {
    this.EquipoService.deleteEquipo(id).subscribe(
      res=>{
        console.log('equipo eliminado');
        this.listarEquipo();
      },
      err=> console.log(err)
      );
  }

  update(id:string){
    this.router.navigate(['/edit/'+id]);
  }



}
