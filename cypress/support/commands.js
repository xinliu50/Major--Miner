// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';
import { attachCustomCommands } from 'cypress-firebase';
//import {fb} from "../../src/base"
const fbConfig = {
  apiKey: "AIzaSyDD9v_OHP17-bC2ZyuHVo1zsH2LkgnIAVo",
  //authDomain: "majorminer-dd13a.firebaseapp.com",
  //databaseURL: "https://majorminer-dd13a.firebaseio.com",
  //projectId: "FIREBASE_PROJECT_ID",
  //storageBucket: "",
  //messagingSenderId: "526186255270"
  ////////
};

firebase.initializeApp(fbConfig);

attachCustomCommands({ Cypress, cy, firebase })