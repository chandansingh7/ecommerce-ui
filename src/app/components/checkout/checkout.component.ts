import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {CurrencyPipe, NgForOf} from "@angular/common";
import {CartService} from "../../services/cart.service";
import {SampleShopFormService} from "../../services/sample-shop-form.service";
import {Country} from "../../common/country";
import {State} from "../../common/state";

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CurrencyPipe,
    NgForOf
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {
  checkoutFormGroup!: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = []
  states: State[] = []

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];


  constructor(private formBuilder: FormBuilder,
              private cartService: CartService,
              private sampleShipFormService: SampleShopFormService) {
  }

  ngOnInit(): void {
    //Form builder
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: ['']
      }),
      shippingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: [''],
      }),
      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: [''],
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expireMonth: [''],
        expireYear: [''],
      }),
    });
    //Form builder end


    //   Populate credit card years and months

    const startMonth: number = new Date().getMonth() + 1;
    console.log(startMonth);

    // get credit card months
    this.sampleShipFormService.getCreditCardMonths(startMonth).subscribe(data => {
      console.log('Credit Card Months:' + JSON.stringify(data))
      this.creditCardMonths = data;
    })

    // get credit card years
    this.sampleShipFormService.getCreditCardYear().subscribe(data => {
      console.log('Credit Card Months:' + JSON.stringify(data))
      this.creditCardYears = data;
    })

    //populate countries
    this.sampleShipFormService.getCountries().subscribe(data => {
      this.countries = data;
    })
  }

  onSubmit() {
    console.log(this.checkoutFormGroup.get('customer')?.value.email)
  }

  copyShippingAddressToBillingAddress($event: Event) {
    const checkbox = $event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.checkoutFormGroup.controls['billingAddress']?.setValue(this.checkoutFormGroup.controls['shippingAddress']?.value);

      //bug fix when country selected on shipping the state was not populating on check of shipping is equal to billing
      this.billingAddressStates = this.shippingAddressStates;

    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
      //fixed below
      this.billingAddressStates = [];
    }
  }

  handleMonthsAndYear() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup?.value.expireYear);

    let startMonth: number;

    if(currentYear === selectedYear){
      startMonth = new Date().getMonth()+1;
    } else {
      startMonth = 1;
    }

    this.sampleShipFormService.getCreditCardMonths(startMonth).subscribe(data => {
      this.creditCardMonths = data;
    })
  }


  getState(formGroupName: string){
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup?.value.country.code;

    this.sampleShipFormService.getStates(countryCode).subscribe(data => {
      if(formGroupName === 'shippingAddress'){
        this.shippingAddressStates = data
      }else {
        this.billingAddressStates = data
      }
      formGroup?.get('state')?.setValue(data[0])
    })
  }
}
