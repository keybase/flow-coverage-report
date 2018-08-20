'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var saveBadgeReport = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(coverageData, opts) {
    var percent, threshold, hasFlowErrors, generateFlowCoverageBadge, generateFlowBadge, projectDir, outputDir, flowCoverageSVG, flowSVG;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            percent = coverageData.percent;
            threshold = opts.threshold || 80;
            hasFlowErrors = !coverageData.flowStatus.passed;

            generateFlowCoverageBadge = function generateFlowCoverageBadge() {
              return new Promise(function (resolve, reject) {
                var color = void 0;

                if (percent < threshold / 2) {
                  color = 'red';
                } else if (percent < threshold * 5 / 8) {
                  color = 'orange';
                } else if (percent < threshold * 6 / 8) {
                  color = 'yellow';
                } else if (percent < threshold * 7 / 8) {
                  color = 'yellowgreen';
                } else if (percent < threshold) {
                  color = 'green';
                } else {
                  color = 'brightgreen';
                }

                (0, _badgeUp2.default)('flow-coverage', percent + '%', _badgeUp2.default.colors[color], function (err, svg) {
                  if (err) {
                    reject(err);
                  } else {
                    resolve(svg);
                  }
                });
              });
            };

            generateFlowBadge = function generateFlowBadge() {
              return new Promise(function (resolve, reject) {
                var color = hasFlowErrors ? 'red' : 'brightgreen';
                var result = hasFlowErrors ? 'failing' : 'passing';

                (0, _badgeUp2.default)('flow', result, _badgeUp2.default.colors[color], function (err, svg) {
                  if (err) {
                    reject(err);
                  } else {
                    resolve(svg);
                  }
                });
              });
            };

            projectDir = opts.projectDir;
            outputDir = opts.outputDir || _path2.default.join(projectDir, 'flow-coverage');
            _context.next = 9;
            return (0, _promisified.mkdirp)(outputDir);

          case 9:
            _context.next = 11;
            return generateFlowCoverageBadge();

          case 11:
            flowCoverageSVG = _context.sent;
            _context.next = 14;
            return (0, _promisified.writeFile)(_path2.default.join(outputDir, 'flow-coverage-badge.svg'), flowCoverageSVG);

          case 14:
            _context.next = 16;
            return generateFlowBadge();

          case 16:
            flowSVG = _context.sent;
            _context.next = 19;
            return (0, _promisified.writeFile)(_path2.default.join(outputDir, 'flow-badge.svg'), flowSVG);

          case 19:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function saveBadgeReport(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _badgeUp = require('badge-up');

var _badgeUp2 = _interopRequireDefault(_badgeUp);

var _promisified = require('./promisified');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  generate: saveBadgeReport
};
//# sourceMappingURL=report-badge.js.map