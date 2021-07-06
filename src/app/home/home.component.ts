import { Component, OnInit } from '@angular/core';
import {AccountService} from "../_services/account.service";
import {User} from "../_models/user";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  registerMode:boolean =false;

  constructor() { }

  ngOnInit(): void {
  }


  registerToggle(){
    this.registerMode = !this.registerMode
  }

  cancelRegisterMode(event:boolean){
    this.registerMode=event;
  }
}
