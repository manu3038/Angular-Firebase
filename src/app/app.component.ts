import { Component, OnInit } from '@angular/core';
// import { FirebaseListObservable } from '@angular/fire/database-deprecated';
// import {AngularFireDatabase, FirebaseListObservable} from '@angular/fire/database-deprecated';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { Router, NavigationEnd } from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [AngularFireDatabase]
})
export class AppComponent implements OnInit {
  title = 'Angular Firebase Application';
  // user = {firstName,lastName};
  users: AngularFireList<any>;
  user_observe: Observable<any[]>;
  user_observe_1: Observable<any[]>;

  userList: Array<any> = []; //array to print the list 
  user: Array<any> = []; //array to store the data to push
  keys: Array<any> = [];
  names: Array<any> = [];

  detail: {};
  _router: any;

  constructor(private db: AngularFireDatabase, private router: Router) { }

  ngOnInit() {
    this.users = this.db.list('/users'); //to get the url to save the data to firebase
    console.log("users=" + JSON.stringify(this.users));

    this.user_observe = this.db.list('/users').valueChanges();// to get the values from the database

    this.user_observe.subscribe(
      val => this.createArray(val)
    );
  }

  // Creating an array of names 
  createArray(result) {
    this.names = result;
    this.user_observe_1 = this.getKeys('/users');// to get the key from the database for editting and deleting   
    this.user_observe_1.subscribe(
      val => this.createArray_1(val)
    );
  }

// creating an array of keys and pushing into to userList array to display 
  createArray_1(result) {
    console.log("names");
    console.log(this.names);
    this.keys = result;
    console.log("keys");
    console.log(this.keys);
    this.userList = []; // empty the array before printing to avoid tmp duplicate rows.
    for (let _i = 0; _i < this.keys.length; _i++) {
      this.userList.push({
        firstName: this.names[_i].firstName,
        lastName: this.names[_i].lastName,
        key: this.keys[_i].key
      });
    }
    console.log("userList");
    console.log(this.userList);
  }

  // A common function where only the name of the list can be changed.
  getKeys(listPath): Observable<any[]> {
    return this.db.list(listPath).snapshotChanges();
  }

  // execute when form is submitted
  onSubmit() {
    this.users.push(this.user);
    this.user = [];
  }

  // executed when clicked on edit. 
  onEdit(key: string) {
    console.log('editing with key: '+key);
    console.log('here in edit');
  }

  // executed when clicked on delete
  onDelete(key: string) {
    console.log("record with key: "+key+" is removed");
    this.db.list('/users/' + key).remove();
  }
}
