var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const spawn = require('threads').spawn

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())


app.post('/multiply', (request, response) => {
  let data = request.body
  const thread = spawn(function(input, done) {
    done({ operand1 : parseFloat(input.operand1), operand2 : parseFloat(input.operand2) })
  })

  thread
    .send({ operand1 : data.operand1, operand2 : data.operand2})
    .on('message', function(resp) {
      console.log('operand1 * operand2 = ', resp.operand1 * resp.operand2)
      response.status(200).send('Send Success')
      // thread.kill() ถ้าต้องการให้ process ค้างให้ปิดคำสั่งนี้ไว้ ถ้าต้องการให้ทำเสร็จแล้ว kill process ให้เปิดคำสั่งนี้
    })
    .on('error', function(error) {
      console.error('Worker errored:', error)
    })
    .on('exit', function() {
      console.log('Worker has been terminated.')
    })
})

app.listen(3000)
console.log('Server is running on port: 3000 ')

module.exports = app
