import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  key: string;
  users:  AngularFireList<any>;
  user_observe:  Observable<any[]>;
  eachUser: Array<any> = [];
  user: Array<any> = [];

  constructor(private route: ActivatedRoute, private db: AngularFireDatabase) { }

  ngOnInit() {
    this.eachUser = [];
    this.key = this.route.snapshot.paramMap.get('key');
    this.users = this.db.list('/users/'+this.key);
    console.log("users=" + JSON.stringify(this.users));
    this.user_observe = this.db.list('/users/'+this.key).valueChanges();
    this.user_observe.subscribe(
      val =>  this.createArray(val)
    );
    
  }
  createArray(val){
      this.eachUser.push({
        firstName : val[0],
        lastName : val[1]
      }) 
    console.log(this.eachUser);
  }
  onSubmit(){
    console.log(this.eachUser);
    this.db.list('/users/').set(this.key,{
      firstName:this.eachUser[0].firstName,
      lastName:this.eachUser[0].lastName
    });
    this.eachUser = [];
  }

}
