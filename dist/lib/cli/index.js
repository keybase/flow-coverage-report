'use strict';

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _lib = require('../../lib');

var _lib2 = _interopRequireDefault(_lib);

var _args = require('./args');

var _args2 = _interopRequireDefault(_args);

var _config = require('./config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.run = function () {
  var args = (0, _args2.default)(process.argv);

  try {
    args = (0, _config.loadConfig)(args);
    (0, _config.validateConfig)(args);
  } catch (err) {
    if (err instanceof _config.UsageError) {
      console.error('Configuration error:', err.message);
    } else {
      console.error('Unexpected exception: ' + err + ' ' + err.stack);
    }
    process.exit(255); // eslint-disable-line unicorn/no-process-exit
  }

  (0, _lib2.default)((0, _extends3.default)({}, args)).then(function (_ref) {
    var _ref2 = (0, _slicedToArray3.default)(_ref, 1),
        coverageSummaryData = _ref2[0];

    var percent = coverageSummaryData.percent,
        threshold = coverageSummaryData.threshold;

    if (percent < threshold) {
      console.error('Flow Coverage ' + percent + '% is below the required threshold ' + threshold + '%');
      process.exit(2); // eslint-disable-line unicorn/no-process-exit
    }
  }).catch(function (err) {
    console.error('Error while generating Flow Coverage Report: ' + err + ' ' + err.stack);
    process.exit(255); // eslint-disable-line unicorn/no-process-exit
  });
};
//# sourceMappingURL=index.js.map