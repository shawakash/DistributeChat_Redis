import express, { request } from "express";

const app = express()
const port = 3000

let requestNumber = 0;

app.get('/', async (_req, res) => {
  console.log(`starting request ${requestNumber}`);
  requestNumber++;
  await expensiveOperation(requestNumber);
  res.send('Hello World!')
})

async function expensiveOperation(requestNumber: number) {
  const startTime = new Date().getTime();
  await new Promise((resolve) => setTimeout(resolve, 1000));
  let ctr = 0;
  for (let i = 0; i < 1000000000; i++) {
    ctr++;
  }
  console.log(`Request ${requestNumber} Took total ${new Date().getTime() - startTime} ms`)
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
