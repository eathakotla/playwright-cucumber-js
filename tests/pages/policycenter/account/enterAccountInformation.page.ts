import { expects } from 'playwright/expects';
import { WebComponent, createComponent, getComponents } from 'playwright/helpers';
import { v10 } from 'playwright/templates';

export default class EnterAccountInformationPage {
  companyName: WebComponent = createComponent(v10.input('Company Name'), { alias: 'Company Name' });
  companyNameCheckBox: WebComponent = createComponent(v10.checkbox('Company name is an exact match'), { alias: 'Company name is an exact match' });
  firstName: WebComponent = createComponent(v10.input('First name'), { alias: 'First name' });
  lastName: WebComponent = createComponent(v10.input('Last name'), { alias: 'Last name' });
  firstNameCheckbox: WebComponent = createComponent(v10.checkbox('First name is an exact match'), { alias: 'First name is an exact match' });
  lastNameCheckbox: WebComponent = createComponent(v10.checkbox('Last name is an exact match'), { alias: 'Last name is an exact match' });
  country: WebComponent = createComponent(v10.select('Country'), { alias: 'Country' });
  city: WebComponent = createComponent(v10.input('City'), { alias: 'City' });
  county: WebComponent = createComponent(v10.input('County'), { alias: 'County' });
  state: WebComponent = createComponent(v10.select('State'), { alias: 'State' });
  zipCode: WebComponent = createComponent(v10.input('ZIP Code'), { alias: 'ZIP Code' });
  searchButton: WebComponent = createComponent(v10.button('Search'), { alias: 'Search' });
  resetButton: WebComponent = createComponent(v10.button('Reset'), { alias: 'Reset' });
  createNewAccountButton: WebComponent = createComponent(v10.button('Create New Account'), { alias: 'Create New Account' });
  elements: Map<string, WebComponent>;
  elementCollections: Map<String, WebComponent[]> = new Map();
  enterAccountInformationForm: WebComponent[] = [
    this.companyName,
    this.companyNameCheckBox,
    this.firstName,
    this.lastName,
    this.firstNameCheckbox,
    this.lastNameCheckbox,
    this.country,
    this.city,
    this.county,
    this.state,
    this.zipCode,
    this.searchButton,
    this.resetButton,
  ];

  constructor() {
    this.elements = getComponents(this);
    this.elementCollections.set('Enter Account Information', this.enterAccountInformationForm);
  }

  async validateForm() {
    await expects(this.enterAccountInformationForm).arePresent();
  }
}
