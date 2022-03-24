# react-around-api-full
"Around the U.S." is the same mini "Social network" that I have worked on web_project_4, 
<br> only this time I used react for the front-end side and built my own Rest API for user authorization and storing/manipulating the user's data.

The server side was written in Node.js (express.js) and used MongoDB as the database.
This Rest API contains middlewares, controllers. custom validators, auth via jwt token and error handlers.

The client side application was written in React and used Routes, Context for managing states, protected routes, auth via jwt token and local storage for storing this token.

In this web application the registered user can create or delete a post (a photo of a place he likes), liking other users posts, editing his own data (user  name, about section and an avatar).

This repository contains the full API of "Around the U.S." project that features user authorization and user registration and handles cards and users
* a link to repository with the complete React application which uses this API - https://github.com/iliyaa7/react-around-auth
* a link to the website that hosts the deployed project - https://www.iliyaa7.students.nomoreparties.sbs

