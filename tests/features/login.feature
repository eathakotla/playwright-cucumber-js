Feature: logging into policy center
    As a user, I'm able to login into the policy center when I use valid credentials

  @pc-login
  Scenario: user logins into policycenter
    Given user opens policycenter
    And user logins into application as "superuser"
    And user successfully logins
