import { Component, OnInit } from '@angular/core';
import {Tache, TacheService} from '../../SERVICES/tache.service';
import {Router, ActivatedRoute} from '@angular/router'; 


@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent implements OnInit {

  tache: Tache={
    id:'',
    title: '',
    description: '',
    created_at:''
  };
  constructor(private TacheService:TacheService,
              private router:Router,
              private activeRoute:ActivatedRoute) { }

  ngOnInit(): void {
    const id_entrada = <string>this.activeRoute.snapshot.params.id;
    console.log('id de entrada: '+id_entrada);

    if(id_entrada){
      this.TacheService.getUnTache(id_entrada).subscribe(
        res=>{
          this.tache = res[0];
          console.log(res[0]);
        },
        err=>console.log(err)
      );
    }
  }

update() {
  this.TacheService.editTache(this.tache.id, this.tache).subscribe(
    res => {
      console.log('Tâche mise à jour');
      this.router.navigate(['/list']); // redirection vers la liste
    },
    err => console.log(err)
  );
}


}
