import { Component, OnInit } from '@angular/core';
import {Tache, TacheService} from '../../SERVICES/tache.service';
import {Router} from '@angular/router';
@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

  tache: Tache={
    id:'',
    title: '',
    description: '',
    created_at:''
  };

  constructor(private TacheService:TacheService, private router:Router) { }

  ngOnInit(): void {
  }

add() {
  delete this.tache.id;
  this.TacheService.addTache(this.tache).subscribe(
    res => {
      console.log('Tâche ajoutée');
      this.router.navigate(['/list']); // rediriger vers la liste après ajout
    },
    err => console.error(err)
  );
}


}
