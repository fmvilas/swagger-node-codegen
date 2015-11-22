'use strict';

var _arguments = arguments;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _handlebars = require('handlebars');

var _handlebars2 = _interopRequireDefault(_handlebars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof2(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

_handlebars2.default.registerHelper('equal', function (lvalue, rvalue, options) {
  if (_arguments.length < 3) throw new Error('Handlebars Helper equal needs 2 parameters');
  if (lvalue != rvalue) {
    return options.inverse(undefined);
  }

  return options.fn(undefined);
});

_handlebars2.default.registerHelper('validMethod', function (method, options) {
  var authorized_methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'COPY', 'HEAD', 'OPTIONS', 'LINK', 'UNLIK', 'PURGE', 'LOCK', 'UNLOCK', 'PROPFIND'];

  if (_arguments.length < 3) throw new Error('Handlebars Helper validMethod needs 1 parameter');
  if (authorized_methods.indexOf(method.toUpperCase()) === -1) {
    return options.inverse(undefined);
  }

  return options.fn(undefined);
});

_handlebars2.default.registerHelper('match', function (lvalue, rvalue, options) {
  if (_arguments.length < 3) throw new Error('Handlebars Helper match needs 2 parameters');
  if (!lvalue.match(rvalue)) {
    return options.inverse(undefined);
  }

  return options.fn(undefined);
});

_handlebars2.default.registerHelper('compare', function (lvalue, rvalue, options) {
  if (_arguments.length < 3) throw new Error('Handlerbars Helper "compare" needs 2 parameters');

  var operator = options.hash.operator || '==';
  var operators = {
    '==': function _(l, r) {
      return l == r;
    },
    '===': function _(l, r) {
      return l === r;
    },
    '!=': function _(l, r) {
      return l != r;
    },
    '<': function _(l, r) {
      return l < r;
    },
    '>': function _(l, r) {
      return l > r;
    },
    '<=': function _(l, r) {
      return l <= r;
    },
    '>=': function _(l, r) {
      return l >= r;
    },
    typeof: function _typeof(l, r) {
      return (typeof l === 'undefined' ? 'undefined' : _typeof2(l)) == r;
    }
  };

  if (!operators[operator]) throw new Error('Handlerbars Helper \'compare\' doesn\'t know the operator ' + operator);

  var result = operators[operator](lvalue, rvalue);

  if (result) {
    return options.fn(undefined);
  }

  return options.inverse(undefined);
});

_handlebars2.default.registerHelper('capitalize', function (str) {
  return _lodash2.default.capitalize(str);
});