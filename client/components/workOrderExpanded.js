angular.module('work-orders')

.controller('ExpandedOrderCtrl', function($http, dataHandler, loginService) {
  //this.orderInformation brings in all of the data from the dataHandler service in services.js. After a user clicks on entry in the feed it populates the service with the individual work order data which is then accessed in a multitude of places across the application

  this.orderInformation = dataHandler.orderData;
  this.orderNumber = dataHandler.index;
  this.newNote;
  this.info;
  this.workername = this.orderInformation.workername;
  this.orderID = this.orderInformation.id;
  this.username = loginService.getCurrentUser().username;
  this.workerPhone = loginService.getCurrentUser().phone;
  this.is_done = this.orderInformation.is_done;

  //this.status string simply translates a 0 to In Progress and a 1 to Complete. 0 and 1 are booleans that come straigt from the database which signifies whether or not the work order is done

  this.statusString = this.orderInformation.is_done ? "Complete" : "In Progress";

  //After the status is changed using the 'change status' button this logic will add or change a class that matches the proper heading style for done or in progress

  if (this.orderInformation.is_done) {
    $('.expanded-panel').removeClass('panel-warning');
    $('.expanded-panel').addClass('panel-success');
  } else {
    $('.expanded-panel').removeClass('panel-success');
    $('.expanded-panel').addClass('panel-warning');
  }



  var workOrderExpanded = this;
  this.noteList = this.orderInformation.notes;

  //updateWorkOrder is used to update the work order database for both adding notes and changing the status of the work order

  this.updateWorkOrder = function (data, cb) {
    $http.put('/update-order', data).
    then(function(res) {
      cb();
      return res;
    }).
    then(function(res) {
      console.log('in second then for updateWorkOrder');
      console.log('res.data', res.data);
      $http.post('/sms', res.data)

    });
  };

  //changeStatus simply changes the status between 0 for false and 1 for true in the database. The 0 and 1 are then translated into english in this.statusString

  this.changeStatus = function() {
    // our new Complete button (function is called when a user accepts
    // a job)

    this.orderInformation.is_done = !this.orderInformation.is_done;
    this.updateWorkOrder({
      id: this.orderID,
      is_done: this.orderInformation.is_done
    }, this.toggleStatus);
  }

  //toggleStatus helps translate 0 and 1 in to readable english for the user-facing application

  this.toggleStatus = function() {
    //Update string in panel heading
    this.statusString = this.orderInformation.is_done ? "Complete" : "In Progress";
    //Update bg color of panel heading
    if (this.orderInformation.is_done) {
      $('.expanded-panel').removeClass('panel-warning');
      $('.expanded-panel').addClass('panel-success');
    } else {
      $('.expanded-panel').removeClass('panel-success');
      $('.expanded-panel').addClass('panel-warning');
    }
    workOrderExpanded.appGetWorkOrders();
  }.bind(this);

  //renderMessages is used as a callback that sets this.noteList to a string of all the notes currently entered into the database. noteList is called directly in workOrderExpanded.html

  this.renderMessages = function() {
    this.noteList = this.orderInformation.notes;
  }.bind(this);

  //submitNote is used after a user hits enter after typing in a note in the expanded view

  this.submitNote = function(e){
    if(e.key === 'Enter'){
      this.orderInformation.notes = this.orderInformation.notes + '\n' + this.newNote;
      //reset the newNote model so the form empties after entering
      this.newNote = '';
      this.updateWorkOrder({
        id: this.orderID,
        notes: this.orderInformation.notes
      }, this.renderMessages)
    }
  }

  this.acceptWorkOrder = function (cb) {
    // var that = this;
    // $http.delete('/delete-order/' + this.orderID)
    // .then(function(res) {
    //   //fix refresh bug
    //   that.appGetWorkOrders();
    //   cb();
    // });
    // var curUser = loginService.getCurrentUser().username;
    // console.log('curUser', curUser);
    // var that = this;
    // $http.get('/get-user-info/' + curUser)
    //   .then(function(res) {
    //     console.log('res.data obj in acceptWorkOrder', res.data);
    //     that.first_name = res.data.first_name;
    //     that.last_name = res.data.last_name;
    //   });
    // new Accept Work Order
    // console.log(this.orderInformation);
    this.orderInformation.is_done = !this.orderInformation.is_done;
    var curUser = JSON.parse(window.sessionStorage.currentUser);
    var first_name = curUser.first_name;
    var last_name = curUser.last_name;
    this.updateWorkOrder({
      id: this.orderID,
      workername: first_name + ' ' + last_name,
      workerphone: this.workerPhone
    }, this.toggleStatus);
    // console.log(this.orderInformation);

  };

})

//includes some bindings from workOrderFeed.js which is the parent to workOrderExpanded.js
.component('workOrderExpanded', {
  bindings: {
    toggle: '<',
    getWorkOrders: '<',
    appGetWorkOrders: '<'
  },
  controller: 'ExpandedOrderCtrl',
  templateUrl: '../templates/workOrderExpanded.html'
});
