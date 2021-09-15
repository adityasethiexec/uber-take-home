import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConstants } from './app-constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    registerForm: FormGroup;
    submitted = false;
    quotesuccess: any;
    deliverysuccess: any
    fail: any;
    fee: any; 
    deliverytime: any;
    res: Array<any>;
    loader: any
    deliveryLoader: any
    deliveryStatus: any
    deliveryFail: any
    errorMessage: any; 
    inputnumber = 0;
    duration: any;
    cartProductList = [];
    httpOptions: any; 
    constructor(private formBuilder: FormBuilder,
                private httpClient: HttpClient,
                ) { }

    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            pickup_address: ['425 Market St, San Francisco, CA 94105', Validators.required],
            pickup_name: ['Zocks SF', Validators.required],
            pickup_phone: ['4155555555', Validators.required],
            dropoff_address: ['201 3rd St, San Francisco, CA 94103', Validators.required],
            dropoff_name: ['Joe Johnson', Validators.required],
            dropoff_phone: ['4156666666', Validators.required],
            zebra_socks: ['2', Validators.nullValidator],
            Leopard_socks: ['4', Validators.nullValidator],
            acceptTerms: [false, Validators.requiredTrue]
        });
        
    }

    // convenience getter for easy access to form fields
    get f() { return this.registerForm.controls; }

    onSubmit() {
        this.submitted = true;
        
        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }
        this.getQuotes();
    }

    onReset() {
        this.submitted = false;
        this.registerForm.reset();
    }

    getQuotes() {
      this.loader = true; 
      this.deliveryLoader = false; 
      this.fail = false; 
      this.quotesuccess = false;
      this.deliverysuccess = false;
      
      this.httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic MWNhMTc4ZjAtYzU0My00OGNmLWI4OTYtZWU3NGNkODU3YWY1Og==',
        })
      };
      let body: any = new HttpParams();
      body = body.append('dropoff_address', this.registerForm.value.dropoff_address);
      body = body.append('pickup_address',this.registerForm.value.pickup_address);


      // Get a Quote first from the Quote API
      this.httpClient.post('/quote', body, this.httpOptions)
        .subscribe( 
        (res: any) => {
          this.loader = false;
          this.fail = false; 
          this.quotesuccess = true;
          this.deliveryLoader = true; 
          this.fee = res.fee;
          this.deliverytime = new Date(res.dropoff_eta).toLocaleString();

          // Added this condition as we need to ensure a 2 hour delivery
          if (res.duration > 120) {
            throw Observable.throw(res);
          }
          this.duration = res.duration;
          
          // If getting the quote was successful, we make an API call to delivery API
          this.createDelivery(res.id);
        } ,
        (error : any) => {
          this.loader = false;
          this.fail = true; 
          this.quotesuccess = false;
          this.handleErrors(error);
        });
    }


    createParamsforDelivery(quoteID): any {
      const manifest_items = [
        {
          "name": "zebra_socks",
          "quantity":this.registerForm.value.zebra_socks,
          "size": "large"
        },
        {
          "name": "Leopard_socks",
          "quantity":this.registerForm.value.Leopard_socks,
          "size": "large"
        }
      ]; 
      let deliveryBody: any = new HttpParams();
      deliveryBody = deliveryBody.append('quote_id', quoteID);
            deliveryBody = deliveryBody.append('dropoff_phone_number',this.registerForm.value.dropoff_phone);
            deliveryBody = deliveryBody.append('pickup_address',this.registerForm.value.pickup_address);
            deliveryBody = deliveryBody.append('pickup_name',this.registerForm.value.pickup_name);
            deliveryBody = deliveryBody.append('pickup_phone_number',this.registerForm.value.pickup_phone);
            deliveryBody = deliveryBody.append('dropoff_address',this.registerForm.value.dropoff_address);
            deliveryBody = deliveryBody.append('dropoff_name',this.registerForm.value.dropoff_name);
            deliveryBody = deliveryBody.append('manifest','Socks');
            deliveryBody = deliveryBody.append('manifest_items',JSON.stringify(manifest_items));
            return deliveryBody; 
    } 


    createDelivery(quoteID) {
        let deliveryBody =  this.createParamsforDelivery(quoteID);
          // Created a proxy server in proxy.conf.json to avoid the CORS error on localhost
          this.httpClient.post('/delivery', deliveryBody, this.httpOptions)
          .subscribe((res:any) => {
            this.deliveryLoader = false; 
            this.quotesuccess = false;
            this.deliverysuccess = true;
            // Status can be Pending, pickup, pickup complete, drop-off, delivered, cancelled, returned, ongoing. 
            this.deliveryStatus = res.status; 
              console.log(res);
          },
          (error : any) => {
            this.deliveryLoader = false; 
            this.fail = true; 
            this.quotesuccess = false;
            this.handleErrors(error);
          });
    }

   // We handle errors via switch statements using App Constants. 
    
    handleErrors(error) {
        let status = error.status; 

        switch (status) {
            case 429:
                this.errorMessage= AppConstants.CUSTOMER_LIMITED;
                break;
            case 402:
              this.errorMessage= AppConstants.CUSTOMER_SUSPENDED;
              break;
            case 403:
              this.errorMessage= AppConstants.CUSTOMER_BLOCKED;
              break;
            case 503:
              this.errorMessage= AppConstants.ROBO_COURIERS_BUSY;
              break;
            case 400:
              this.errorMessage= error.error.message; 
            break;
        }
    }

}
