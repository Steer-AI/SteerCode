'use strict';
var __read =
  (this && this.__read) ||
  function (o, n) {
    var m = typeof Symbol === 'function' && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o),
      r,
      ar = [],
      e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
        ar.push(r.value);
    } catch (error) {
      e = { error: error };
    } finally {
      try {
        if (r && !r.done && (m = i['return'])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
var __values =
  (this && this.__values) ||
  function (o) {
    var s = typeof Symbol === 'function' && Symbol.iterator,
      m = s && o[s],
      i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === 'number')
      return {
        next: function () {
          if (o && i >= o.length) o = void 0;
          return { value: o && o[i++], done: !o };
        }
      };
    throw new TypeError(
      s ? 'Object is not iterable.' : 'Symbol.iterator is not defined.'
    );
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.parse = void 0;
var MergeMarkersDiff = /** @class */ (function () {
  function MergeMarkersDiff(head, incoming, fileName, branch) {
    this.head = head;
    this.incoming = incoming;
    this.fileName = fileName;
    this.branch = branch;
  }
  MergeMarkersDiff.prototype.toMergeFormat = function () {
    return (
      '\n' +
      '<<<<<<< HEAD' +
      '\n' +
      this.head +
      '\n' +
      '=======' +
      '\n' +
      this.incoming +
      '\n' +
      '>>>>>>> ' +
      this.branch
    );
  };
  return MergeMarkersDiff;
})();
var parseHead = function (diff) {
  var startMarker = /<<<<<<< HEAD:(.*)/;
  var endMarker = /=======/;
  var startMatch = diff.match(startMarker);
  var endMatch = diff.match(endMarker);
  if (startMatch && endMatch) {
    var startIndex = diff.indexOf(startMatch[0]) + startMatch[0].length;
    var endIndex = diff.indexOf(endMatch[0]);
    return diff.substring(startIndex, endIndex);
  }
  return '';
};
var parseIncoming = function (diff) {
  var startMarker = /=======/;
  var endMarker = />>>>>>> (.*)/;
  var startMatch = diff.match(startMarker);
  var endMatch = diff.match(endMarker);
  if (startMatch && endMatch) {
    var startIndex = diff.indexOf(startMatch[0]) + startMatch[0].length;
    var endIndex = diff.indexOf(endMatch[0]);
    return diff.substring(startIndex, endIndex);
  }
  return '';
};
var parseFileName = function (diff) {
  var fileNamePattern = /<<<<<<< HEAD:(.*)/;
  var fileNameMatch = diff.match(fileNamePattern);
  if (fileNameMatch) {
    return fileNameMatch[1].trim();
  }
  return '';
};
var parseBranchName = function (diff) {
  var branchPattern = />>>>>>> (.*)/;
  var branchMatch = diff.match(branchPattern);
  if (branchMatch) {
    return branchMatch[1].trim();
  }
  return '';
};
var parseChange = function (diff) {
  var head = parseHead(diff);
  var incoming = parseIncoming(diff);
  var fileName = parseFileName(diff);
  var branch = parseBranchName(diff);
  return new MergeMarkersDiff(head, incoming, fileName, branch);
};
var parse = function (diff) {
  var e_1, _a;
  var diffPattern = /<<<<<<< HEAD(.*?)?\n[\s\S]*?=======\n[\s\S]*?>>>>>>> .*?/g;
  var matches = __spreadArray([], __read(diff.matchAll(diffPattern)), false);
  var changes = [];
  try {
    for (
      var matches_1 = __values(matches), matches_1_1 = matches_1.next();
      !matches_1_1.done;
      matches_1_1 = matches_1.next()
    ) {
      var match = matches_1_1.value;
      var change = parseChange(match[0]);
      changes.push(change);
    }
  } catch (e_1_1) {
    e_1 = { error: e_1_1 };
  } finally {
    try {
      if (matches_1_1 && !matches_1_1.done && (_a = matches_1.return))
        _a.call(matches_1);
    } finally {
      if (e_1) throw e_1.error;
    }
  }
  return changes;
};
exports.parse = parse;
