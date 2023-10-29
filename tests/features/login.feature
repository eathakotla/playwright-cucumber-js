Feature: logging into policy center
    As a user, I'm able to login into the policy center when I use valid credentials

  @pc-login
  Scenario: user logins into policycenter
    Given user opens policycenter
    And user logins into application as "superuser"
    And user successfully logins
    And user can access "navigation" bar in policycenter
    And user able to see following elements
      | Account tab        |
      | Account tab expand |
      | Desktop tab        |
      | Desktop tab expand |
      | Policy tab         |
      | Policy tab expand  |

  @webComponent
  Scenario: do login
    Given user opens policycenter
    And user is on "Login" page in policycenter
    And user enters "su" in "Username" field
    And user enters "Zens@r!lab" in "Password" field
    And user clicks on "Log In" button
    And user waits for 10000 milli seconds

  @locator-login
  Scenario: do login
    Given user opens policycenter
    And user enters "su" in "css=input[name='Login-LoginScreen-LoginDV-username']" field
    And user enters "Zens@r!lab" in "css=input[name='Login-LoginScreen-LoginDV-password']" field
    And user clicks on "css=#Login-LoginScreen-LoginDV-submit" button
    And user waits for 10000 milli seconds

  @pom-demo
  Scenario: pom demo
    Given user opens policycenter
    When user is on "Login" page in policycenter
    And user prints all the elements of the page

  @form-assertion
  Scenario: form assertion
    Given user opens policycenter
    And user is on "Login" page in policycenter
    When user logins into application as "superuser"
    And user successfully logins
    And user starts new Account
    And user is on "Enter Account Information" page in policycenter
    And user able to see "Enter Account Information" form elements
