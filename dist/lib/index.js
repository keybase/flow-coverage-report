'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _config = require('./cli/config');

var _flow = require('./flow');

var _promisified = require('./promisified');

var _reportHtml = require('./report-html');

var _reportHtml2 = _interopRequireDefault(_reportHtml);

var _reportBadge = require('./report-badge');

var _reportBadge2 = _interopRequireDefault(_reportBadge);

var _reportJson = require('./report-json');

var _reportJson2 = _interopRequireDefault(_reportJson);

var _reportText = require('./report-text');

var _reportText2 = _interopRequireDefault(_reportText);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// User Scenarios
// 1. generate text report from a project dir
// 2. generate text report from a project dir and save json to file
// 3. generate text report from a project dir and html report
// 4. generate text/html report from a saved json file
// 5. set a custom threshold
// 6. set a custom output dir
// 7. usa a saved json file to compute coverage trend (and fail on negative trends)

// eslint-disable-next-line no-duplicate-imports

// eslint-disable-next-line no-duplicate-imports
exports.default = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(opts) {
    var projectDir, tmpDirPath, coverageData, reportResults, reportTypes;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // Apply defaults to options.
            projectDir = opts.projectDir;
            tmpDirPath = void 0;

            if (!(process.env.VERBOSE && process.env.VERBOSE === 'DUMP_JSON')) {
              _context.next = 7;
              break;
            }

            _context.next = 5;
            return (0, _promisified.withTmpDir)('flow-coverage-report');

          case 5:
            tmpDirPath = _context.sent;

            console.log('Verbose DUMP_JSON mode enabled (' + tmpDirPath + ')');

          case 7:

            opts.flowCommandPath = opts.flowCommandPath || 'flow';
            opts.flowCommandTimeout = opts.flowCommandTimeout || _config.DEFAULT_FLOW_TIMEOUT; // Defaults to 15s
            opts.outputDir = opts.outputDir || './flow-coverage';
            opts.outputDir = _path2.default.isAbsolute(opts.outputDir) ? opts.outputDir : _path2.default.resolve(_path2.default.join(projectDir, opts.outputDir));
            opts.globIncludePatterns = opts.globIncludePatterns || [];
            opts.globExcludePatterns = opts.globExcludePatterns || [];
            opts.concurrentFiles = opts.concurrentFiles || 1;

            if (!Array.isArray(opts.globExcludePatterns)) {
              opts.globExcludePatterns = [opts.globExcludePatterns];
            }

            // Apply validation checks.

            if (projectDir) {
              _context.next = 17;
              break;
            }

            return _context.abrupt('return', Promise.reject(new TypeError('projectDir option is mandatory')));

          case 17:
            if (!(opts.globIncludePatterns.length === 0)) {
              _context.next = 19;
              break;
            }

            return _context.abrupt('return', Promise.reject(new TypeError('empty globIncludePatterns option')));

          case 19:
            if (opts.threshold) {
              _context.next = 21;
              break;
            }

            return _context.abrupt('return', Promise.reject(new TypeError('threshold option is mandatory')));

          case 21:
            _context.next = 23;
            return (0, _flow.collectFlowCoverage)(opts, tmpDirPath);

          case 23:
            coverageData = _context.sent;
            reportResults = [];
            reportTypes = opts.reportTypes || ['text'];


            if (reportTypes.indexOf('json') >= 0) {
              reportResults.push(_reportJson2.default.generate(coverageData, opts));
            }

            if (reportTypes.indexOf('text') >= 0) {
              reportResults.push(_reportText2.default.generate(coverageData, opts));
            }

            // Run the badge reporter implicitly if the html report has been included.
            if (reportTypes.indexOf('badge') >= 0 || reportTypes.indexOf('html') >= 0) {
              reportResults.push(_reportBadge2.default.generate(coverageData, opts));
            }

            if (reportTypes.indexOf('html') >= 0) {
              reportResults.push(_reportHtml2.default.generate(coverageData, opts).then(function () {
                console.log('View generated HTML Report at file://' + opts.outputDir + '/index.html');
              }));
            }

            return _context.abrupt('return', Promise.all(reportResults).then(function () {
              return [coverageData, opts];
            }));

          case 31:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  function generateFlowCoverageReport(_x) {
    return _ref.apply(this, arguments);
  }

  return generateFlowCoverageReport;
}();
//# sourceMappingURL=index.js.map