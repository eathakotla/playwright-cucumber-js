Feature: logging into policy center
    As a user, I'm able to login into the policy center when I use valid credentials

  Scenario: user able to login into the application
    Given user opens policycenter
    When user enters credentials
      | username | su   |
      | password | **** |
    And user enters credentials
      | username | password | status  |
      | user1    | password | valid   |
      | user2    | password | invalid |
    Then user able to login into the application
