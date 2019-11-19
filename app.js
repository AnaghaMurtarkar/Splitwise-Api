const express = require('express'),
  path = require('path'),
  createNamespace = require('continuation-local-storage').createNamespace,
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  helmet = require('helmet'),
  customUrlParser = require('url'),
  URL = require('url').URL;

const requestSharedNameSpace = createNamespace('SplitwiseApiNameSpace');

const rootPrefix = '.',
  apiRoutes = require(rootPrefix + '/routes/index');

const basicHelper = require(rootPrefix + '/helpers/basic'),
  coreConstants = require(rootPrefix + '/coreConstants'),
  customMiddleware = require(rootPrefix + '/helpers/customMiddleware'),
  sanitizer = require(rootPrefix + '/helpers/sanitizer');

const port = process.env.PORT || 3000;

//const splitwiseApiHostName = new URL(coreConstants.PA_DOMAIN).hostname;

morgan.token('id', function getId(req) {
  return req.id;
});

morgan.token('pid', function getId(req) {
  return process.pid;
});

morgan.token('endTime', function getendTime(req) {
  return Date.now();
});

morgan.token('endDateTime', function getEndDateTime(req) {
  return basicHelper.logDateFormat();
});

const startRequestLogLine = function(req, res, next) {
  const message = [
    "Started '",
    customUrlParser.parse(req.originalUrl).pathname,
    "'  '",
    req.method,
    "' at ",
    basicHelper.logDateFormat()
  ];

  console.log(message.join(''));

  next();
};

/**
 * Assign params
 *
 * @param req
 * @param res
 * @param next
 */
const assignParams = function(req, res, next) {
  // IMPORTANT NOTE: Don't assign parameters before sanitization
  // Also override any request params, related to signatures
  // And finally assign it to req.decodedParams
  req.decodedParams = Object.assign(getRequestParams(req), req.decodedParams);

  next();
};

/**
 * Get request params
 *
 * @param req
 * @return {*}
 */
const getRequestParams = function(req) {
  // IMPORTANT NOTE: Don't assign parameters before sanitization
  if (req.method === 'POST') {
    return req.body;
  } else if (req.method === 'GET') {
    return req.query;
  }

  return {};
};

// Set request debugging/logging details to shared namespace
const appendRequestDebugInfo = function(req, res, next) {
  requestSharedNameSpace.run(function() {
    requestSharedNameSpace.set('reqId', req.id);
    requestSharedNameSpace.set('startTime', req.startTime);
    next();
  });
};

const setResponseHeader = async function(req, res, next) {
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Cache-Control', 'no-store, no-cache, max-age=0, must-revalidate, post-check=0, pre-check=0');
  res.setHeader('Vary', '*');
  res.setHeader('Expires', '-1');
  res.setHeader('Last-Modified', new Date().toUTCString());
  next();
};

// If the process is not a master

// Set worker process title
process.title = 'Splitwise api node worker';

// Create express application instance
const app = express();

// Add id and startTime to request
app.use(customMiddleware());

// Load Morgan
app.use(
  morgan(
    '[:pid][:id][:endTime] Completed with ":status" in :response-time ms at :endDateTime -  ":res[content-length] bytes" - ":remote-addr" ":remote-user" - "HTTP/:http-version :method :url" - ":referrer" - ":user-agent"'
  )
);

// Helmet helps secure Express apps by setting various HTTP headers.
app.use(helmet());

// Node.js body parsing middleware.
app.use(bodyParser.json());

// Parsing the URL-encoded data with the qs library (extended: true)
app.use(bodyParser.urlencoded({ extended: true }));

// Static file location
app.use(express.static(path.join(__dirname, 'public')));


// Start Request logging. Placed below static and health check to reduce logs
app.use(appendRequestDebugInfo, startRequestLogLine);

// set response Headers
app.use(setResponseHeader);

/**
 * NOTE: API routes where first sanitize and then assign params
 */
app.use('/api', sanitizer.sanitizeBodyAndQuery, assignParams, apiRoutes);

// Catch 404
app.use(function(req, res, next) {
  const payload = {
    url: req.originalUrl,
    error: 'Not found'
  };
  return res.status(404).json(payload);
});

module.exports = app;
