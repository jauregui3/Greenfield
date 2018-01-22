//Twilio Info
var accountSid = process.env.accountSid;
var authToken = process.env.authToken;
var phoneNumber = process.env.phoneNumber;

var client = require('twilio')(accountSid, authToken);
var dbHelpers = require('../utility/dbquery');

exports.sms = function(phoneData) {
  dbHelpers.getWorkOrderData({
    id: phoneData.id
  }, function(result) {
      console.log('result in sms callback', result);
      // message to job accepter
      client.messages.create({
        to: result.attributes.workerphone,
        from: phoneNumber,
        body: `-\n\nYou've accepted a job:\nClient: ${result.attributes.client}\nJob Details: ${result.attributes.job_info}\nBillable Hrs: ${result.attributes.duration}\nTO COMPLETE ORDER, REPLY WITH:\n${result.attributes.id}/<any job or work notes>`
      }, function(err, message) {
        if (err) {
          console.error(err);
        } else {
          console.log(message.sid);
        }
      });

      // message to job poster/creater
      client.messages.create({
        to: result.attributes.userphone,
        from: phoneNumber,
        body: `-\n\n${result.attributes.workername} has accepted your job, ${result.attributes.job_info} (Order#:${result.attributes.id})`
      }, function(err, message) {
        if (err) {
          console.error(err);
        } else {
          console.log(message.sid);
        }
      });
  });

}

exports.message = function(messageData, cb) {
  //split message data to get back correct work order
  var data = messageData;
  var msgDataArray = data.Body.split('/');
  dbHelpers.updateOrder({
    id: msgDataArray[0],
    notes: msgDataArray[1] + '\n',
    is_done: true
  }, function(model) {

    dbHelpers.getWorkOrderData({
      id: msgDataArray[0]
    }, function(modelData){
      sendMessage(modelData.attributes);
      cb(null, modelData.attributes);
    });
  });
};

var sendMessage = function(workOrderInfo) {
  client.messages.create({
    to: workOrderInfo.userphone,
    from: phoneNumber,
    body: `-\n\n${workOrderInfo.workername} has completed your job!\nInfo: ${workOrderInfo.job_info} (${workOrderInfo.id})\nNotes: ${workOrderInfo.notes}`
    }, function(err, message) {
      if (err) {
        console.error(err);
      } else {
        console.log(message.sid);
      }
    });
}
