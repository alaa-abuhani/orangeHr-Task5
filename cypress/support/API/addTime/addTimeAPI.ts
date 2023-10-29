let id: number;
let time;
export default class addTime {
  static getIdSheet() {
    return cy
      .request({
        method: "GET",
        url: "/api/v2/time/timesheets/default",
      })
      .then((response) => {
        response.body.data.id;
      });
  }
  static putRequestTime(id: any) {
    return cy
      .request({
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
      })
      .then(() => {
        //response
        // response.body.data.id;
      });
  }

  static getRequestTime(id: any) {
    return cy
      .request({
        method: "GET",
        url: `/api/v2/time/timesheets/${id}/entries`,
      })
      .then((reponse) => {
        reponse.body.meta.timesheet.id;
      });
  }

  static putActionTimeRequest(time: any) {
    return cy.request({
      method: "PUT",
      url: `/api/v2/time/timesheets/${time}`,
      body: {
        action: "SUBMIT",
      },
    });
  }
  static x() {
    this.getIdSheet().then((id) =>
      this.putRequestTime(id).then(() =>
        this.getRequestTime(id).then((time) => this.putActionTimeRequest(time))
      )
    );
  }
}
