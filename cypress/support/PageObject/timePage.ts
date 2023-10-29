export default class timePage {
  timeTab() {
    cy.visit("/time/viewMyTimesheet");
    cy.get(".oxd-button--ghost").click();
  }
  timeView(){
    cy.visit("/time/viewEmployeeTimesheet");
  }
}
