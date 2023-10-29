import login from "../../support/PageObject/login";
import vacancy from "../../support/PageObject/vacancy";
import employee from "../../support/API/addEmpAPI/addEmpAPI";
import GenericHepler from "../../support/helpers/genericFunctions";
import Time from "../../support/API/addTimeUser";
import timePage from "../../support/PageObject/timePage";
const timePageObj: timePage = new timePage();
const loginObj: login = new login();
const empObj: employee = new employee();
let empNumber: string;

describe("vacancy functionality ", () => {
  beforeEach(() => {
    cy.intercept("/web/index.php/dashboard/index").as("loginpage");
    cy.visit("/");
    cy.fixture("login.json").as("logininfo");
    cy.fixture("employeeInfo.json").as("EmpInfo");
    cy.get("@logininfo").then((logininfo: any) => {
      loginObj.loginValid(logininfo[0].Username, logininfo[0].Password);
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
  });
  afterEach(() => {});

  it("vacancy: add attachment text file", () => {
    cy.get("@EmpInfo").then((EmpInfo: any) => {
      loginObj.loginValid(EmpInfo.user.firstName, EmpInfo.user.password);
      timePageObj.timeTab();
      Time.AddTimeSheet();
    });
    // //admin login
    cy.get("@logininfo").then((logininfo: any) => {
      loginObj.loginValid(logininfo[0].Username, logininfo[0].Password);
      timePageObj.timeView();
    });
  });
});
