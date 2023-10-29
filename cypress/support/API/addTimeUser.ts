let id: number;
let empNumber: any;
let time;
let firstName: any;
export default class Time {
  static AddTimeSheet() {
    cy.request({
      method: "GET",
      url: "/api/v2/time/timesheets/default",
    }).then((response) => {
      id = response.body.data.id;
      cy.request({
        method: "PUT",
        url: `/api/v2/time/timesheets/${id}/entries`,
        body: {
          entries: [
            {
              projectId: 6,
              activityId: 42,
              dates: {
                "2023-10-23": {
                  duration: "22:00",
                },
              },
            },
          ],
          deletedEntries: [],
        },
      }).then((reponse) => {
        cy.request({
          method: "GET",
          url: `/api/v2/time/timesheets/${id}/entries`,
        })
          .then((reponse) => {
            time = reponse.body.meta.timesheet.id;
            console.log(time, "time");
            cy.request({
              method: "PUT",
              url: `/api/v2/time/timesheets/${time}`,
              body: {
                action: "SUBMIT",
              },
            });
          })
          .then(() => {
            //user logout
            cy.logout();
            cy.visit("/");
          });
      });
    });
  }
}
