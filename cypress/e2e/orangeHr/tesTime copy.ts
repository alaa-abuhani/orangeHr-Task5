import login from "../../support/PageObject/login";
import vacancy from "../../support/PageObject/vacancy";
import employee from "../../support/API/addEmpAPI/addEmpAPI";
import GenericHepler from "../../support/helpers/genericFunctions";
import Time from "../../support/API/addTimeUser";
import timePage from "../../support/PageObject/timePage";
const timePageObj: timePage = new timePage();
const loginObj: login = new login();
const empObj: employee = new employee();
let empnumber: number;

describe("vacancy functionality ", () => {
  beforeEach(() => {
    cy.intercept("/web/index.php/dashboard/index").as("loginpage");
    cy.visit("/");
    cy.fixture("login.json").as("logininfo");
    cy.fixture("employeeInfo.json").as("EmpInfo");
    cy.get("@logininfo").then((logininfo: any) => {
      loginObj.loginValid(logininfo[0].Username, logininfo[0].Password);
      // add employee account
      // cy.get("@EmpInfo").then((EmpInfo: any) => {
      //   empObj
      //     .addEmloyeeViaAPI(
      //       EmpInfo.user.firstName,
      //       EmpInfo.user.middleName,
      //       EmpInfo.user.lastName,
      //       EmpInfo.user.empPicture,
      //       EmpInfo.user.id,
      //       EmpInfo.user.password
      //     )
      //     .then((response) => {
      //       expect(response).property("status").to.equal(200);
      //       empNumber = response.body.data.employee.empNumber;
      //     });

      // cy.logout();
      // cy.visit("/");
    });
  });
  afterEach(() => {
    cy.log(`${empnumber}`);
    cy.api({
      // delete the created employee
      method: "DELETE",
      url: "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees",
      body: {
        ids: [empnumber],
      },
    });
    // cy.visit(
    //   "https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewEmployeeList"
    // );
    // cy.get("@EmpInfo").then((EmpInfo: any) => {
    //   // empObj.deleteEmployee(empNumber);
    // });
  });

  it("vacancy: add attachment text file", () => {
    cy.get("@EmpInfo").then((EmpInfo: any) => {
      cy.request({
        method: "POST",
        url: "/api/v2/pim/employees",
        body: {
          firstName: EmpInfo.user.firstName,
          middleName: EmpInfo.user.middleName,
          lastName: EmpInfo.user.lastName,
          empPicture: EmpInfo.user.empPicture,
          employeeId: EmpInfo.user.id,
        },
      }).then((response) => {
        expect(response).property("status").to.equal(200);
        console.log(response);
        empnumber = response.body.data.empNumber;
        console.log(empnumber);
        cy.request({
          method: "POST",
          url: "/api/v2/admin/users",
          body: {
            username: EmpInfo.user.firstName,
            password: EmpInfo.user.password,
            status: true,
            userRoleId: 2,
            empNumber: empnumber,
          },
        }).then(() => {
          expect(response).property("status").to.equal(200);
          // cy.visit(
          //   "https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewEmployeeList"
          // );
        });
      });
    });
    // cy.log(`${empNumber}`);

    // cy.get("@EmpInfo").then((EmpInfo: any) => {
    //   //user login
    //   loginObj.loginValid(EmpInfo.user.firstName, EmpInfo.user.password);
    //   timePageObj.timeTab();
    //   //user add timesheet
    //   Time.AddTimeSheet();
    // });
    // //admin login
    // cy.get("@logininfo").then((logininfo: any) => {
    //   loginObj.loginValid(logininfo[0].Username, logininfo[0].Password);
    //   timePageObj.timeView();
    // });
  });
});
