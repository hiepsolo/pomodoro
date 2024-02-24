const express = require('express');
const { Client } = require('@notionhq/client');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const cors = require('cors');

const app = express();
const port = 3333;

const sendResponse = (res, statusCode, data) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.write(JSON.stringify(data));
  res.end();
};

app.use(cors());

app.use('/databases/:databaseId/query', jsonParser, async (req, res) => {
  try {
    const response = await new Client({
      auth: req.headers.authorization,
    }).databases.query({
      database_id: req.params.databaseId,
      ...req.body,
    });
    sendResponse(res, 200, response.results);
  } catch (error) {
    console.error('error', error);
    sendResponse(res, 500, { msg: 'Cannot get tasks from database' });
  }
});

app.use('/databases', jsonParser, async (req, res) => {
  try {
    const response = await new Client({
      auth: req.headers.authorization,
    }).databases.create(req.body);
    sendResponse(res, 200, response);
  } catch (error) {
    console.error('error', error);
    sendResponse(res, 500, { msg: 'Cannot create databases' });
  }
});

app.patch('/pages/:recordId', jsonParser, async (req, res) => {
  try {
    const response = await new Client({
      auth: req.headers.authorization,
    }).pages.update({
      page_id: req.params.recordId,
      ...req.body,
    });
    sendResponse(res, 200, response);
  } catch (error) {
    console.error('error', error);
    sendResponse(res, 500, { msg: 'Cannot update task into database' });
  }
});

app.delete('/pages/:recordId', jsonParser, async (req, res) => {
  try {
    const response = await new Client({
      auth: req.headers.authorization,
    }).pages.update({
      page_id: req.params.recordId,
      ...req.body,
    });
    sendResponse(res, 200, response);
  } catch (error) {
    console.error('error', error);
    sendResponse(res, 500, { msg: 'Cannot delete task into database' });
  }
});

app.use('/pages', jsonParser, async (req, res) => {
  try {
    const response = await new Client({
      auth: req.headers.authorization,
    }).pages.create(req.body);
    sendResponse(res, 200, response);
  } catch (error) {
    console.error('error', error);
    sendResponse(res, 500, { msg: 'Cannot create task into database' });
  }
});

app.listen(port, () => {
  console.log(`Proxy server is running on port ${port}`);
});
