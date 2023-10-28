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

  @pom-demo
  Scenario: pom demo
    Given user opens policycenter
    When user is on "Login" page in policycenter
    And user prints all the elements of the page
