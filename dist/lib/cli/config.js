'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultConfig = exports.DEFAULT_FLOW_TIMEOUT = exports.UsageError = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

exports.loadConfig = loadConfig;
exports.validateConfig = validateConfig;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _parseJson = require('parse-json');

var _parseJson2 = _interopRequireDefault(_parseJson);

var _stripJsonComments = require('strip-json-comments');

var _stripJsonComments2 = _interopRequireDefault(_stripJsonComments);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var UsageError = exports.UsageError = function (_Error) {
  (0, _inherits3.default)(UsageError, _Error);

  function UsageError(message) {
    (0, _classCallCheck3.default)(this, UsageError);

    var _this = (0, _possibleConstructorReturn3.default)(this, (UsageError.__proto__ || Object.getPrototypeOf(UsageError)).call(this, message));

    _this.name = 'UsageError';
    return _this;
  }

  return UsageError;
}(Error);

var toArray = function toArray(value) {
  return Array.isArray(value) ? value : [value];
};

// Default timeout for flow coverage commands.
var DEFAULT_FLOW_TIMEOUT = exports.DEFAULT_FLOW_TIMEOUT = 15 * 1000;

var defaultConfig = exports.defaultConfig = {
  reportTypes: ['text'],
  flowCommandPath: 'flow',
  flowCommandTimeout: DEFAULT_FLOW_TIMEOUT,
  projectDir: _path2.default.resolve(process.cwd()),
  globExcludePatterns: ['node_modules/**'],
  globIncludePatterns: [],
  threshold: 80,
  percentDecimals: 0,
  outputDir: './flow-coverage',
  concurrentFiles: 1,
  strictCoverage: false,
  excludeNonFlow: false,
  noConfig: false,
  htmlTemplateOptions: {
    autoHeightSource: true,
    showMeterBar: false
  }
};

var getProjectDir = function getProjectDir(config) {
  var _defaultConfig$config = (0, _extends3.default)({}, defaultConfig, config),
      projectDir = _defaultConfig$config.projectDir;

  if (!projectDir) {
    throw new UsageError('projectDir option is mandatory');
  }

  if (typeof projectDir !== 'string') {
    throw new UsageError('Unexpected non-string projectDir option');
  }

  return projectDir;
};

/**
 * Normalize config properties to match the property name used internally
 * when it has multiple aliases.
 *
 * @param {object} config
 */
function normalizedConfig(config) {
  if (typeof config.includeGlob !== 'undefined') {
    console.warn('WARN: "includeGlob" config file property has been renamed to "globIncludePatterns"');
    config.globIncludePatterns = toArray(config.includeGlob);
  }

  if (typeof config.excludeGlob !== 'undefined') {
    console.warn('WARN: "excludeGlob" config file property has been renamed to "globExcludePatterns"');
    config.globExcludePatterns = toArray(config.excludeGlob);
  }

  if (typeof config.type !== 'undefined') {
    console.warn('WARN: "type" config file property has been renamed to "reportTypes"');
    config.reportTypes = toArray(config.type);
  }

  return config;
}

/**
 * Try to load configuration parameters from the project dir if the following order:
 * - do not load any config if --no-config option is specified
 * - from the package.json "flow-coverage-report" property, if any
 * - from a .flow-coverage-report.json, if any
 * - from the --config cli parameter, if any
 */
function loadConfig(args) {
  // Remove any undefined property from the yargs object.
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = Object.keys(args)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var key = _step.value;

      if (typeof args[key] === 'undefined') {
        delete args[key];
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  if (args.noConfig) {
    return (0, _extends3.default)({}, defaultConfig, args);
  }

  if (args.includeGlob) {
    args.includeGlob = toArray(args.includeGlob);
  }

  if (args.globIncludePatterns) {
    args.globIncludePatterns = toArray(args.globIncludePatterns);
  }

  if (args.config) {
    var filePath = _path2.default.resolve(args.config);
    var fileRawData = _fs2.default.readFileSync(filePath);
    var fileConfigData = (0, _parseJson2.default)((0, _stripJsonComments2.default)(String(fileRawData)));

    if (process.env.VERBOSE) {
      console.log('Loaded config from file', filePath, fileConfigData);
    }

    return (0, _extends3.default)({}, defaultConfig, normalizedConfig(fileConfigData), args);
  }

  var packageJSONPath = void 0;

  try {
    packageJSONPath = _path2.default.resolve(_path2.default.join(getProjectDir(args), 'package.json'));
    // $FlowIgnoreMe: the following dynamic require loads only the package.json file.
    var pkg = require(packageJSONPath); // eslint-disable-line import/no-dynamic-require
    if (pkg['flow-coverage-report']) {
      if (process.env.VERBOSE) {
        console.log('Loaded config from package.json', pkg['flow-coverage-report']);
      }

      return (0, _extends3.default)({}, defaultConfig, normalizedConfig(pkg['flow-coverage-report']), args);
    }
  } catch (err) {
    if (process.env.VERBOSE) {
      console.error('Unable to load config from project package.json', packageJSONPath, err);
    }
  }

  var projectConfigPath = void 0;

  try {
    projectConfigPath = _path2.default.resolve(_path2.default.join(getProjectDir(args), '.flow-coverage-report.json'));
    var projectConfigRaw = _fs2.default.readFileSync(projectConfigPath);
    var projectConfigData = (0, _parseJson2.default)((0, _stripJsonComments2.default)(String(projectConfigRaw)));

    if (process.env.VERBOSE) {
      console.log('Loaded config from project dir', projectConfigPath, projectConfigData);
    }

    return (0, _extends3.default)({}, defaultConfig, normalizedConfig(projectConfigData), args);
  } catch (err) {
    if (process.env.VERBOSE) {
      console.error('Unable to load config from file', projectConfigPath, err);
    }
  }

  return (0, _extends3.default)({}, defaultConfig, args);
}

/**
 * Validate the arguments collected from the command line and config files and
 * ensure that it is a valid FlowCoverageReportOptions object (as described by its
 * flow type declaration in the "src/lib/index.js module")
 */

function validateConfig(args) {
  function raiseErrorIfArray(value, msg) {
    if (Array.isArray(value)) {
      throw new UsageError('ERROR: Only one ' + msg + ' can be specified.');
    }
  }

  var preventDuplicatedOptions = {
    projectDir: 'project dir',
    outputDir: 'output dir',
    threshold: 'threshold',
    flowCommandPath: 'flow command',
    concurrentFiles: '--concurrent-files option'
  };

  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = Object.keys(preventDuplicatedOptions)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var option = _step2.value;

      var msg = preventDuplicatedOptions[option];
      raiseErrorIfArray(args[option], msg);
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  var globIncludePatterns = args.globIncludePatterns;

  if (!globIncludePatterns || globIncludePatterns.length === 0 || !globIncludePatterns[0]) {
    throw new UsageError('ERROR: No glob has been specified.');
  }

  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = globIncludePatterns[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var glob = _step3.value;

      if (glob[0] === '!') {
        throw new UsageError('ERROR: Only include glob syntax are supported.');
      }
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3.return) {
        _iterator3.return();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }

  return args;
}
//# sourceMappingURL=config.js.map