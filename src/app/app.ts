import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { UserListComponent } from './components/user-list/user-list';
import { User } from './models/user.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, UserListComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('Angular Unit Testing Demo');
  selectedUser: User | null = null;

  onUserSelected(user: User): void {
    this.selectedUser = user;
    console.log('User selected:', user);
  }

  onUserDeleted(userId: number): void {
    console.log('User deleted:', userId);
    this.selectedUser = null;
  }
}
