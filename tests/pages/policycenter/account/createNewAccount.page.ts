import { createComponent } from 'playwright/helpers';
import { v10 } from 'playwright/templates';

export default class CreateNewAccountPage {
  firstNameField = createComponent(v10.input('First name'), { alias: 'First name' });
  lastNameField = createComponent(v10.input('First name'), { alias: 'First name' });
  homePhoneField = createComponent(v10.input('First name'), { alias: 'First name' });
  workPhoneField = createComponent(v10.input('First name'), { alias: 'First name' });
  mobilePhoneField = createComponent(v10.input('First name'), { alias: 'First name' });
  constructor() {}
}
