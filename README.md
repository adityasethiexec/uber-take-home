# MyPostMates API integration App 

This project is a small integration app  with postmates API
The input is received from the customers as a form, the form is validated on every feild.
If everything looks good then as user clicks on Create Delivery button quote api is called with all the 
required parameters. 
If this call is successful, using the Quote ID returned from the quoteId API call, 
create delivery API is called with quote ID as a parameter. 
If this whole process is successful a success message with delivery details is shown to the customer 
otherwise the appropriate error message is shown on the screen. 

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.4.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

To start this project please download node. 
Once node is installed please run npm install
Then run npm start. 




## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).



