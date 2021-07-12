import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {getPaginatedResult, getPaginationHeaders} from "./paginationHelper";
import {Message} from "../_models/message";
import {HubConnection, HubConnectionBuilder} from "@microsoft/signalr";
import {BehaviorSubject} from "rxjs";
import {User} from "../_models/user";
import {take} from "rxjs/operators";
import {Group} from "../_models/group";

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  baseUrl = environment.apiUrl;
  hubUrl = environment.hubUrl;
  private hubConnection:HubConnection;
  private messageTreadSource = new BehaviorSubject<Message[]>([]);
  messageTread$ = this.messageTreadSource.asObservable();

  constructor(private http:HttpClient) {

  }

  createHubConnection(user:User,otherUsername:string){
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl+'message?user='+otherUsername,{
      accessTokenFactory:()=>user.token
      })
      .withAutomaticReconnect()
      .build()

    this.hubConnection.start().catch(error=>console.log(error));
    this.hubConnection.on("ReceiveMessageThread",messages=>{
      this.messageTreadSource.next(messages);
    })

    this.hubConnection.on("NewMessage",message=>{
      this.messageTread$.pipe(take(1)).subscribe(messages=>{
        this.messageTreadSource.next([...messages,message])
      })
    })

    this.hubConnection.on('UpdatedGroup',(group:Group)=>{
      if (group.connections.some(x=>x.username===otherUsername)){
        this.messageTread$.pipe(take(1)).subscribe(messages=>{
          messages.forEach(message=>{
            if (!message.dateRead){
              message.dateRead=new Date(Date.now())
            }
          })
          this.messageTreadSource.next([...messages]);
        })
      }
    })
  }

  stopHubConnection(){
    if (this.hubConnection){
      this.hubConnection.stop();
    }
  }

  getMessages(pageNumber,pageSize,container){
    let params = getPaginationHeaders(pageNumber,pageSize)
    params = params.append("Container",container);
    return getPaginatedResult<Message[]>(this.baseUrl+'messages',params,this.http)
  }

  getMessageThread(username:string){
    return this.http.get<Message[]>(this.baseUrl+'messages/thread/'+username);
  }

  sendMessage(username:string,content:string){
    return this.hubConnection.invoke('SendMessage',{recipientUsername:username,content})
      .catch(error=>console.log(error))
  }

  deleteMessage(id:number){
    return this.http.delete(this.baseUrl+'messages/'+id);
  }
}
