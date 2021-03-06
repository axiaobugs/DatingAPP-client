import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "./_models/user";
import {AccountService} from "./_services/account.service";
import {PresenceService} from "./_services/presence.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'DatingWeb';
  users:any;

  constructor(private accountService:AccountService,private presence:PresenceService) {
  }

  ngOnInit(): void {
    this.setCurrentUser();
  }

  setCurrentUser(){
    const user:User = JSON.parse(<string>localStorage.getItem('user'));
    if (user){
      this.accountService.serCurrentUser(user);
      this.presence.createHubConnection(user);
    }

  }


}
