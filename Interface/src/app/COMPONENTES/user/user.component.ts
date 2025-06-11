import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {
  isLogin = true; // pour basculer entre login et register
  user = {
    email: '',
    password: ''
  };
  registerData = {
    name: '',
    email: '',
    password: ''
  };

  constructor(private http: HttpClient, private router: Router) {}

  toggleForm() {
    this.isLogin = !this.isLogin;
  }

  login() {
    this.http.post('http://localhost:3000/auth/login', this.user).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);
        this.router.navigate(['/listall']); 
      },
      error: (err) => {
        alert('Échec de la connexion');
        console.error(err);
      }
    });
  }



register() {
  console.log('Données envoyées au backend (inscription):', this.registerData);

  this.http.post('http://localhost:3000/auth/register', this.registerData).subscribe({
    next: () => {
      alert('Inscription réussie. Vous pouvez maintenant vous connecter.');
      this.toggleForm();
    },
    error: (err) => {
      alert('Échec de l\'inscription');
      console.error(err);
    }
  });
}


}
