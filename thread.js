var express = require('express')
var bodyParser = require('body-parser')
const spawn = require('threads').spawn

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.post('/multiply', (request, response) => {
  let data = request.body
  const thread = spawn(function (input, done) {
    done({operand: parseFloat(input.operand)})
  })

  thread
    .send({operand1: data.operand})
    .on('message', function (resp) {
      /* eslint-disable */
      var operand = data.operand
      var result = null
      var startDate = new Date ()
      if (operand===1)
      {
        result = false;
      }
      else if(operand === 2)
      {
        result = true;
      }else
      {
        for(var x = 2; x < operand; x++)
        {
          if(operand % x === 0)
          {
            result = false;
          }
        }
        result = true;
      }
      var endDate   = new Date()
      var seconds = (endDate.getTime() - startDate.getTime())/ 1000
      response.status(200).send('Result ' + result +' time ' + seconds)
      thread.kill() // ถ้าต้องการให้ process ค้างให้ปิดคำสั่งนี้ไว้ ถ้าต้องการให้ทำเสร็จแล้ว kill process ให้เปิดคำสั่งนี้
    })
    .on('error', function (error) {
      console.error('Worker errored:', error)
    })
    .on('exit', function () {
      console.log('Worker has been terminated.')
    })
})

function test_prime (operand) {
  if (operand===1)
  {
    return false;
  }
  else if(operand === 2)
  {
    return true;
  }else
  {
    for(var x = 2; x < operand; x++)
    {
      if(operand % x === 0)
      {
        return false;
      }
    }
    return true;
  }

}

app.listen(3000)
console.log('Server is running on port: 3000 ')

module.exports = app
