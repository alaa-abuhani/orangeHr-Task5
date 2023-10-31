import login from "../../support/PageObject/login";
import employee from "../../support/API/addEmpAPI/addEmpAPI";
import Time from "../../support/API/addTimeUser";
import timePage from "../../support/PageObject/timePage";
const timePageObj: timePage = new timePage();
const loginObj: login = new login();
const empObj: employee = new employee();
let empNumber: number;

describe("time functionality ", () => {
  beforeEach(() => {
    cy.intercept("/web/index.php/dashboard/index").as("loginpage");
    cy.visit("/");
    cy.fixture("login.json").as("logininfo");
    cy.fixture("employeeInfo.json").as("EmpInfo");
    cy.get("@logininfo").then((logininfo: any) => {
      loginObj.loginValid(logininfo[0].Username, logininfo[0].Password);
    });
    // add employee account
    cy.get("@EmpInfo").then((EmpInfo: any) => {
      empObj
        .addEmloyeeViaAPI(
          EmpInfo.user.firstName,
          EmpInfo.user.middleName,
          EmpInfo.user.lastName,
          EmpInfo.user.empPicture,
          EmpInfo.user.userId,
          EmpInfo.user.password
        )
        .then((response) => {
          empNumber = response.body.data.employee.empNumber;
        });
      cy.logout();
      cy.visit("/");
    });
  });
  afterEach(() => {
    // delete the created employee
    empObj.deleteEmployee(empNumber);
  });

  it("TC00x: user add time sheet ", () => {
    cy.get("@EmpInfo").then((EmpInfo: any) => {
      //user login
      loginObj.loginValid(EmpInfo.user.firstName, EmpInfo.user.password);
      timePageObj.timeTab();
      //user add timesheet
      Time.AddTimeSheet();
    });
    //admin login
    cy.get("@logininfo").then((logininfo: any) => {
      loginObj.loginValid(logininfo[0].Username, logininfo[0].Password);
      timePageObj.timeView();
    });
    // assertion the data exist in the table
    cy.get("@EmpInfo").then((EmpInfo: any) => {
      timePageObj.timeAssertion(`${EmpInfo.user.firstName}`);
    });
  });
});
