'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.collectFlowCoverageForFile = exports.checkFlowStatus = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var checkFlowStatus = exports.checkFlowStatus = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(flowCommandPath, projectDir, tmpDirPath) {
    var tmpFilePath, res, statusData, unexpectedException;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            tmpFilePath = void 0;


            if (process.env.VERBOSE && process.env.VERBOSE === 'DUMP_JSON') {
              tmpFilePath = _temp2.default.path(tmpDirPath ? { suffix: '.json', dir: tmpDirPath } : { suffix: '.json' });
            }

            _context.next = 4;
            return (0, _promisified.exec)(flowCommandPath + ' status --json', { cwd: projectDir, maxBuffer: Infinity }, { dontReject: true });

          case 4:
            res = _context.sent;

            if (!(res.err && res.err.code !== 2)) {
              _context.next = 8;
              break;
            }

            if (process.env.VERBOSE) {
              console.error('Flow status error', res.err, res.stderr, res.stdout);
            }

            throw res.err;

          case 8:
            statusData = void 0;

            if (!tmpFilePath) {
              _context.next = 13;
              break;
            }

            _context.next = 12;
            return (0, _promisified.writeFile)(tmpFilePath, res.stdout || '');

          case 12:
            console.log('Flow status result saved to', tmpFilePath);

          case 13:
            _context.prev = 13;

            statusData = JSON.parse(String(res.stdout));
            _context.next = 22;
            break;

          case 17:
            _context.prev = 17;
            _context.t0 = _context['catch'](13);
            unexpectedException = _context.t0;

            // Verify the integrity of the format of the JSON status result.

            if (!unexpectedException) {
              _context.next = 22;
              break;
            }

            throw new Error('Parsing error on Flow status JSON result: ' + _context.t0);

          case 22:
            if (!(statusData && statusData.flowVersion)) {
              _context.next = 24;
              break;
            }

            return _context.abrupt('return', statusData);

          case 24:
            throw new Error('Invalid Flow status JSON format');

          case 25:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[13, 17]]);
  }));

  return function checkFlowStatus(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();

// Definitions and flow types related to collectFlowCoverageForFile.

var collectFlowCoverageForFile = exports.collectFlowCoverageForFile = function () {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(opts, filename, tmpDirPath) {
    var flowCommandPath, flowCommandTimeout, projectDir, strictCoverage, tmpFilePath, emptyCoverageData, res, parsedData, flowCoverageParsingError;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            flowCommandPath = opts.flowCommandPath, flowCommandTimeout = opts.flowCommandTimeout, projectDir = opts.projectDir, strictCoverage = opts.strictCoverage;
            tmpFilePath = void 0;


            if (process.env.VERBOSE && process.env.VERBOSE === 'DUMP_JSON') {
              tmpFilePath = _temp2.default.path(tmpDirPath ? { suffix: '.json', dir: tmpDirPath } : { suffix: '.json' });
            }

            emptyCoverageData = {
              filename: filename,
              annotation: 'no flow',
              isFlow: false,
              expressions: {
                covered_count: 0,
                uncovered_count: 0,
                uncovered_locs: []
              }
            };


            if (process.env.VERBOSE) {
              console.log('Collecting coverage data from ' + filename + ' (timeouts in ' + flowCommandTimeout + ')...');
            }

            _context2.next = 7;
            return (0, _promisified.exec)(flowCommandPath + ' coverage --json ' + escapeFileName(filename),
            // NOTE: set a default timeouts and maxButter to Infinity to prevent,
            // misconfigured projects and source files that should raises errors
            // or hangs the flow daemon to prevent the coverage reporter to complete
            // the data collection. (See https://github.com/rpl/flow-coverage-report/pull/4
            // and https://github.com/rpl/flow-coverage-report/pull/5 for rationale,
            // thanks to to @mynameiswhm and @ryan953  for their help on hunting down this issue)
            { cwd: projectDir, timeout: flowCommandTimeout, maxBuffer: Infinity }, { dontReject: true });

          case 7:
            res = _context2.sent;

            if (!res.err) {
              _context2.next = 15;
              break;
            }

            console.error('ERROR Collecting coverage data from', filename, res.err, res.stderr);

            if (!process.env.VERBOSE) {
              _context2.next = 14;
              break;
            }

            if (!tmpFilePath) {
              _context2.next = 14;
              break;
            }

            _context2.next = 14;
            return (0, _promisified.writeFile)(tmpFilePath, res.stdout || '');

          case 14:
            return _context2.abrupt('return', (0, _extends3.default)({}, emptyCoverageData, {
              percent: NaN,
              isError: true,
              flowCoverageError: undefined,
              flowCoverageException: res.err && res.err.message,
              flowCoverageStderr: res.stderr,
              flowCoverageParsingError: undefined
            }));

          case 15:
            if (!process.env.VERBOSE) {
              _context2.next = 21;
              break;
            }

            console.log('Collecting coverage data from ' + filename + ' completed.');

            if (!tmpFilePath) {
              _context2.next = 21;
              break;
            }

            _context2.next = 20;
            return (0, _promisified.writeFile)(tmpFilePath, res.stdout || '');

          case 20:
            console.log('Saved json dump of collected coverage data from ' + filename + ' to ' + tmpFilePath + '.');

          case 21:
            parsedData = void 0;
            flowCoverageParsingError = void 0;


            if (res.stdout) {
              try {
                parsedData = JSON.parse(String(res.stdout));
              } catch (err) {
                flowCoverageParsingError = err.message;
              }
            }

            if (res.stderr) {
              try {
                parsedData = JSON.parse(String(res.stderr));
                delete res.stderr;
              } catch (err) {}
            }

            if (!(parsedData && !parsedData.error)) {
              _context2.next = 33;
              break;
            }

            parsedData.filename = filename;
            _context2.next = 29;
            return (0, _flowAnnotationCheck.genCheckFlowStatus)(flowCommandPath, filename);

          case 29:
            parsedData.annotation = _context2.sent;

            parsedData.isFlow = isFlowAnnotation(parsedData.annotation, Boolean(strictCoverage));

            // In strictCoverage mode all files that are not strictly flow
            // (e.g. non annotated and flow weak files) are considered
            // as completely uncovered.
            if (strictCoverage && !parsedData.isFlow) {
              parsedData.expressions.uncovered_count += parsedData.expressions.covered_count;
              parsedData.expressions.covered_count = 0;
            }
            return _context2.abrupt('return', parsedData);

          case 33:
            return _context2.abrupt('return', (0, _extends3.default)({}, emptyCoverageData, {
              percent: NaN,
              isError: true,
              isFlow: Boolean(parsedData && parsedData.isFlow),
              flowCoverageError: parsedData && parsedData.error,
              flowCoverageException: undefined,
              flowCoverageParsingError: flowCoverageParsingError,
              flowCoverageStderr: res.stderr
            }));

          case 34:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function collectFlowCoverageForFile(_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}();

// Definition and flow types related to collectForCoverage.

exports.escapeFileName = escapeFileName;
exports.roundNumber = roundNumber;
exports.getCoveredPercent = getCoveredPercent;
exports.isFlowAnnotation = isFlowAnnotation;
exports.summarizeAnnotations = summarizeAnnotations;
exports.collectFlowCoverage = collectFlowCoverage;

var _minimatch = require('minimatch');

var _minimatch2 = _interopRequireDefault(_minimatch);

var _temp = require('temp');

var _temp2 = _interopRequireDefault(_temp);

var _flowAnnotationCheck = require('flow-annotation-check');

var _promisified = require('./promisified');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Load the Array.prototype.find polyfill if needed (e.g. nodejs 0.12).
/* istanbul ignore if  */
if (!Array.prototype.find) {
  require('array.prototype.find').shim();
}

// Escape special characters in file names.
function escapeFileName(fileName) {
  return fileName.replace(/(["\s'$`\\])/g, '\\$1');
}

function roundNumber(n) {
  var numDecimals = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  if (numDecimals > 0) {
    var fact = Math.pow(10, Math.floor(numDecimals));
    return Math.round(n * fact) / fact;
  }
  return Math.floor(n);
}

/* eslint-disable camelcase */
function getCoveredPercent(_ref) {
  var covered_count = _ref.covered_count,
      uncovered_count = _ref.uncovered_count;
  var numDecimals = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  var total = covered_count + uncovered_count;

  if (total === 0) {
    return 100;
  }

  return roundNumber(covered_count / total * 100, numDecimals);
}
/* eslint-disable-line camelcase */

function isFlowAnnotation(annotation) {
  var strict = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var validFlowAnnotation = new Set(['flow', 'flow weak', 'flow strict', 'flow strict-local']);

  if (strict) {
    validFlowAnnotation.delete('flow weak');
  }

  return validFlowAnnotation.has(annotation);
}

// Definitions and flow types related to checkFlowStatus.

function summarizeAnnotations(coverageSummaryData) {
  var flowFiles = 0;
  var flowWeakFiles = 0;
  var noFlowFiles = 0;

  var filenames = Object.keys(coverageSummaryData.files);

  filenames.forEach(function (filename) {
    var annotation = coverageSummaryData.files[filename].annotation;

    switch (annotation) {
      case 'flow weak':
        flowWeakFiles += 1;
        break;
      case 'no flow':
        noFlowFiles += 1;
        break;
      default:
        if (typeof annotation === 'string' && isFlowAnnotation(annotation, true)) {
          flowFiles += 1;
          return;
        }
        throw new Error('Unexpected missing flow annotation on ' + filename);
    }
  });

  return {
    passed: flowWeakFiles + noFlowFiles === 0,
    flowFiles: flowFiles,
    flowWeakFiles: flowWeakFiles,
    noFlowFiles: noFlowFiles,
    totalFiles: filenames.length
  };
}

function collectFlowCoverage(opts, tmpDirPath) {
  var flowCommandPath = opts.flowCommandPath,
      projectDir = opts.projectDir,
      globIncludePatterns = opts.globIncludePatterns,
      _opts$globExcludePatt = opts.globExcludePatterns,
      globExcludePatterns = _opts$globExcludePatt === undefined ? [] : _opts$globExcludePatt,
      threshold = opts.threshold,
      percentDecimals = opts.percentDecimals,
      _opts$concurrentFiles = opts.concurrentFiles,
      concurrentFiles = _opts$concurrentFiles === undefined ? 1 : _opts$concurrentFiles,
      strictCoverage = opts.strictCoverage,
      excludeNonFlow = opts.excludeNonFlow;


  return checkFlowStatus(flowCommandPath, projectDir, tmpDirPath).then(function (flowStatus) {
    var drainQueue = function () {
      var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (process.env.VERBOSE) {
                  console.log('Wait for ' + waitForCollectedDataFromFiles.length + ' queued files.');
                }
                // Wait the queued files.
                _context3.next = 3;
                return Promise.all(waitForCollectedDataFromFiles);

              case 3:
                // Empty the collected Data From files queue.
                waitForCollectedDataFromFiles = [];

              case 4:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      return function drainQueue() {
        return _ref4.apply(this, arguments);
      };
    }();

    var now = new Date();
    var coverageGeneratedAt = now.toDateString() + ' ' + now.toTimeString();

    var annotationSummary = {
      passed: false,
      flowFiles: 0,
      flowWeakFiles: 0,
      noFlowFiles: 0,
      totalFiles: 0
    };

    var coverageSummaryData = {
      threshold: threshold,
      covered_count: 0, uncovered_count: 0, // eslint-disable-line camelcase
      percent: 0,
      generatedAt: coverageGeneratedAt,
      flowStatus: flowStatus,
      flowAnnotations: annotationSummary,
      files: {},
      globIncludePatterns: globIncludePatterns,
      globExcludePatterns: globExcludePatterns,
      concurrentFiles: concurrentFiles,
      strictCoverage: Boolean(strictCoverage),
      excludeNonFlow: excludeNonFlow
    };

    // Remove the source attribute from all ucovered_locs entry.
    function cleanupUncoveredLoc(loc) {
      delete loc.start.source;
      delete loc.end.source;
      return loc;
    }

    var waitForCollectedDataFromFiles = [];

    function collectCoverageAndGenerateReportForGlob(globIncludePattern) {
      var _this = this;

      return (0, _promisified.glob)(globIncludePattern, { cwd: projectDir, root: projectDir }).then(function () {
        var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(files) {
          var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step, _ret;

          return _regenerator2.default.wrap(function _callee4$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  _iteratorNormalCompletion = true;
                  _didIteratorError = false;
                  _iteratorError = undefined;
                  _context5.prev = 3;
                  _loop = /*#__PURE__*/_regenerator2.default.mark(function _loop() {
                    var filename, _annotation;

                    return _regenerator2.default.wrap(function _loop$(_context4) {
                      while (1) {
                        switch (_context4.prev = _context4.next) {
                          case 0:
                            filename = _step.value;

                            if (!(globExcludePatterns && globExcludePatterns.find(function (pattern) {
                              return (0, _minimatch2.default)(filename, pattern);
                            }) !== undefined)) {
                              _context4.next = 4;
                              break;
                            }

                            if (process.env.VERBOSE) {
                              console.log('Skip ' + filename + ', matched excluded pattern.');
                            }
                            return _context4.abrupt('return', 'continue');

                          case 4:
                            if (!excludeNonFlow) {
                              _context4.next = 11;
                              break;
                            }

                            _context4.next = 7;
                            return (0, _flowAnnotationCheck.genCheckFlowStatus)(flowCommandPath, filename);

                          case 7:
                            _annotation = _context4.sent;

                            if (!(_annotation === 'no flow')) {
                              _context4.next = 11;
                              break;
                            }

                            if (process.env.VERBOSE) {
                              console.log('Skip ' + filename + ', matched \'no flow\' in excludeNonFlow mode.');
                            }
                            return _context4.abrupt('return', 'continue');

                          case 11:

                            if (process.env.VERBOSE) {
                              console.log('Queue ' + filename + ' flow coverage data collection');
                            }

                            waitForCollectedDataFromFiles.push(collectFlowCoverageForFile(opts, filename, tmpDirPath).then(function (data) {
                              /* eslint-disable camelcase */
                              coverageSummaryData.covered_count += data.expressions.covered_count;
                              coverageSummaryData.uncovered_count += data.expressions.uncovered_count;
                              data.percent = getCoveredPercent(data.expressions, percentDecimals);

                              if (!data.filename) {
                                throw new Error('Unxepected missing filename from collected coverage data');
                              }

                              coverageSummaryData.files[data.filename] = data;

                              data.expressions.uncovered_locs = data.expressions.uncovered_locs.map(cleanupUncoveredLoc);
                              /* eslint-enable camelcase */
                            }));

                            // If we have collected at least `concurrentFiles` number of files,
                            // wait the queue to be drained.

                            if (!(waitForCollectedDataFromFiles.length >= concurrentFiles)) {
                              _context4.next = 16;
                              break;
                            }

                            _context4.next = 16;
                            return drainQueue();

                          case 16:
                          case 'end':
                            return _context4.stop();
                        }
                      }
                    }, _loop, _this);
                  });
                  _iterator = files[Symbol.iterator]();

                case 6:
                  if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                    _context5.next = 14;
                    break;
                  }

                  return _context5.delegateYield(_loop(), 't0', 8);

                case 8:
                  _ret = _context5.t0;

                  if (!(_ret === 'continue')) {
                    _context5.next = 11;
                    break;
                  }

                  return _context5.abrupt('continue', 11);

                case 11:
                  _iteratorNormalCompletion = true;
                  _context5.next = 6;
                  break;

                case 14:
                  _context5.next = 20;
                  break;

                case 16:
                  _context5.prev = 16;
                  _context5.t1 = _context5['catch'](3);
                  _didIteratorError = true;
                  _iteratorError = _context5.t1;

                case 20:
                  _context5.prev = 20;
                  _context5.prev = 21;

                  if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                  }

                case 23:
                  _context5.prev = 23;

                  if (!_didIteratorError) {
                    _context5.next = 26;
                    break;
                  }

                  throw _iteratorError;

                case 26:
                  return _context5.finish(23);

                case 27:
                  return _context5.finish(20);

                case 28:
                  if (!(waitForCollectedDataFromFiles.length > 0)) {
                    _context5.next = 31;
                    break;
                  }

                  _context5.next = 31;
                  return drainQueue();

                case 31:
                  return _context5.abrupt('return', files);

                case 32:
                case 'end':
                  return _context5.stop();
              }
            }
          }, _callee4, _this, [[3, 16, 20, 28], [21,, 23, 27]]);
        }));

        return function (_x10) {
          return _ref5.apply(this, arguments);
        };
      }());
    }

    return Promise.all(globIncludePatterns.map(collectCoverageAndGenerateReportForGlob)).then(function () {
      coverageSummaryData.percent = getCoveredPercent(coverageSummaryData, percentDecimals);
      coverageSummaryData.flowAnnotations = summarizeAnnotations(coverageSummaryData);

      return coverageSummaryData;
    });
  });
}
//# sourceMappingURL=flow.js.map