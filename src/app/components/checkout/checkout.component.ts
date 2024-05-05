import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CurrencyPipe, NgForOf, NgIf} from "@angular/common";
import {CartService} from "../../services/cart.service";
import {SampleShopFormService} from "../../services/sample-shop-form.service";
import {Country} from "../../common/country";
import {State} from "../../common/state";
import {SampleShopValidators} from "../../validators/sample-shop-validators";

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CurrencyPipe,
    NgForOf,
    NgIf
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {
  checkoutFormGroup!: FormGroup;

  totalPrice: number = 0.00;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = []

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];


  constructor(private formBuilder: FormBuilder,
              private cartService: CartService,
              private sampleShipFormService: SampleShopFormService) {
  }

  ngOnInit(): void {
    this.reviewCartDetails();
    //Form builder
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('',
          [Validators.required,
            Validators.minLength(2),
            SampleShopValidators.notOnlyWhitespace]),

        lastName: new FormControl('',
          [Validators.required,
            Validators.minLength(2),
            SampleShopValidators.notOnlyWhitespace]),

        email: new FormControl('',
          [Validators.required,
            Validators.pattern('^[a-z0-9._$+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
            SampleShopValidators.notOnlyWhitespace]),
      }),

      shippingAddress: this.formBuilder.group({
        street: new FormControl('',
          [Validators.required,
            Validators.minLength(2),
            SampleShopValidators.notOnlyWhitespace]),

        city: new FormControl('',
          [Validators.required,
            Validators.minLength(2),
            SampleShopValidators.notOnlyWhitespace]),

        state: new FormControl('',
          [Validators.required]),

        country: new FormControl('',
          [Validators.required]),

        zipCode: new FormControl('',
          [Validators.required,
            Validators.minLength(2),
            SampleShopValidators.notOnlyWhitespace]),
      }),

      billingAddress: this.formBuilder.group({
        street: new FormControl('',
          [Validators.required,
            Validators.minLength(2),
            SampleShopValidators.notOnlyWhitespace]),

        city: new FormControl('',
          [Validators.required,
            Validators.minLength(2),
            SampleShopValidators.notOnlyWhitespace]),

        state: new FormControl('',
          [Validators.required]),

        country: new FormControl('',
          [Validators.required]),

        zipCode: new FormControl('',
          [Validators.required,
            Validators.minLength(2),
            SampleShopValidators.notOnlyWhitespace]),
      }),

      creditCard: this.formBuilder.group({
        cardType: new FormControl('',
          [Validators.required]),
        nameOnCard:new FormControl('',
          [Validators.required,
            Validators.minLength(2),
            SampleShopValidators.notOnlyWhitespace]),
        cardNumber: new FormControl('',
          [Validators.required,
            Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('',
          [Validators.required,
            Validators.pattern('[0-9]{3}')]),
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

  get firstName() {return this.checkoutFormGroup.get('customer.firstName')}
  get lastName() {return this.checkoutFormGroup.get('customer.lastName')}
  get email() {return this.checkoutFormGroup.get('customer.email')}

  get shippingAddressStreet() {return this.checkoutFormGroup.get('shippingAddress.street')}
  get shippingAddressCity() {return this.checkoutFormGroup.get('shippingAddress.city')}
  get shippingAddressState() {return this.checkoutFormGroup.get('shippingAddress.state')}
  get shippingAddressCountry() {return this.checkoutFormGroup.get('shippingAddress.country')}
  get shippingAddressZipCode() {return this.checkoutFormGroup.get('shippingAddress.zipCode')}

  get billingAddressStreet() {return this.checkoutFormGroup.get('billingAddress.street')}
  get billingAddressCity() {return this.checkoutFormGroup.get('billingAddress.city')}
  get billingAddressState() {return this.checkoutFormGroup.get('billingAddress.state')}
  get billingAddressCountry() {return this.checkoutFormGroup.get('billingAddress.country')}
  get billingAddressZipCode() {return this.checkoutFormGroup.get('billingAddress.zipCode')}

  get creditCardType() {return this.checkoutFormGroup.get('creditCard.cardType')}
  get creditCardNameOnCard() {return this.checkoutFormGroup.get('creditCard.nameOnCard')}
  get creditCardCardNumber() {return this.checkoutFormGroup.get('creditCard.cardNumber')}
  get creditCardSecurityCode() {return this.checkoutFormGroup.get('creditCard.securityCode')}

  onSubmit() {
    if (this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched();
    }
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

  reviewCartDetails(){
    this.cartService.totalQuantity.subscribe(data =>{
      this.totalQuantity = data;
    })

    this.cartService.totalPrice.subscribe(data =>{
      this.totalPrice = data;
    })
  }
}
