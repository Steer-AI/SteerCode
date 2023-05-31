'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.');
      while ((g && ((g = 0), op[0] && (_ = 0)), _))
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y['return']
                  : op[0]
                  ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
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
Object.defineProperty(exports, '__esModule', { value: true });
exports.applyDiff = void 0;
// import { parse } from 'diff2html'; // Update this to your actual imports
var fs_1 = require('fs');
var conflictParser_1 = require('./conflictParser.cjs');
var applyDiff = function (diff) {
  return __awaiter(void 0, void 0, void 0, function () {
    var changes, changes_1, changes_1_1, change, e_1_1;
    var e_1, _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          changes = (0, conflictParser_1.parse)(diff);
          console.log(changes);
          _b.label = 1;
        case 1:
          _b.trys.push([1, 6, 7, 8]);
          (changes_1 = __values(changes)), (changes_1_1 = changes_1.next());
          _b.label = 2;
        case 2:
          if (!!changes_1_1.done) return [3 /*break*/, 5];
          change = changes_1_1.value;
          return [4 /*yield*/, applyFileDiff(change)];
        case 3:
          _b.sent();
          _b.label = 4;
        case 4:
          changes_1_1 = changes_1.next();
          return [3 /*break*/, 2];
        case 5:
          return [3 /*break*/, 8];
        case 6:
          e_1_1 = _b.sent();
          e_1 = { error: e_1_1 };
          return [3 /*break*/, 8];
        case 7:
          try {
            if (changes_1_1 && !changes_1_1.done && (_a = changes_1.return))
              _a.call(changes_1);
          } finally {
            if (e_1) throw e_1.error;
          }
          return [7 /*endfinally*/];
        case 8:
          return [2 /*return*/];
      }
    });
  });
};
exports.applyDiff = applyDiff;
var applyFileDiff = function (diff) {
  return __awaiter(void 0, void 0, void 0, function () {
    var isNewFile, err_1;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          isNewFile = false;
          _a.label = 1;
        case 1:
          _a.trys.push([1, 3, , 4]);
          return [
            4 /*yield*/,
            fs_1.promises.access(diff.fileName, fs_1.promises.constants.F_OK)
          ];
        case 2:
          _a.sent();
          return [3 /*break*/, 4];
        case 3:
          err_1 = _a.sent();
          isNewFile = true;
          return [3 /*break*/, 4];
        case 4:
          if (!isNewFile) return [3 /*break*/, 6];
          if (diff.head)
            throw new Error(
              'There is existing content for file that is supposed to be new, LLM probably used wrong file name'
            );
          return [
            4 /*yield*/,
            fs_1.promises.writeFile(diff.fileName, diff.incoming, 'utf-8')
          ];
        case 5:
          _a.sent();
          return [3 /*break*/, 8];
        case 6:
          return [4 /*yield*/, applyMergeDiff(diff)];
        case 7:
          _a.sent();
          _a.label = 8;
        case 8:
          return [2 /*return*/];
      }
    });
  });
};
function printStringDifference(string1, string2) {
  var differences = [];
  __spreadArray(
    __spreadArray([], __read(string1), false),
    __read(string2),
    false
  ).forEach(function (char, index) {
    if (string1[index] !== string2[index]) {
      differences.push(
        'Index '
          .concat(index, ': ')
          .concat(string1[index] || '-', ' != ')
          .concat(string2[index] || '-')
      );
    }
  });
  console.log(
    differences.length === 0
      ? 'The strings are identical.'
      : 'Differences found:'
  );
  console.log(differences.join('\n'));
}
var applyMergeDiff = function (diff) {
  return __awaiter(void 0, void 0, void 0, function () {
    var content, flexibleHead, regex, firstMatch, secondMatch, newContent;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, fs_1.promises.readFile(diff.fileName, 'utf-8')];
        case 1:
          content = _a.sent();
          flexibleHead =
            '\\s*' +
            diff.head
              .trim()
              .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
              .replace(/\s+/g, '\\s+') +
            '\\s*';
          regex = new RegExp(flexibleHead, 'g');
          firstMatch = regex.exec(content);
          if (!firstMatch) {
            printStringDifference(content, diff.head);
            throw new Error(
              "The string '".concat(diff.head, "' was not found in the file.")
            );
          }
          secondMatch = regex.exec(content);
          if (secondMatch) {
            throw new Error(
              "There is more than one occurrence of the string '".concat(
                diff.head,
                "' in the file."
              )
            );
          }
          newContent =
            content.substring(0, firstMatch.index) +
            diff.toMergeFormat() +
            content.substring(firstMatch.index + diff.head.length);
          return [
            4 /*yield*/,
            fs_1.promises.writeFile(diff.fileName, newContent, 'utf-8')
          ];
        case 2:
          _a.sent();
          return [2 /*return*/];
      }
    });
  });
};
// function renameFile(oldFilePath: string, newFilePath: string) {
//   try {
//     fs.renameSync(oldFilePath, newFilePath);
//   } catch (err) {
//     console.error(
//       `Error renaming file from ${oldFilePath} to ${newFilePath}: ${err}`
//     );
//     return false;
//   }
//   return true;
// }
// function deleteFile(filePath: string) {
//   try {
//     fs.unlinkSync(filePath);
//   } catch (err) {
//     console.error(`Error deleting file ${filePath}: ${err}`);
//     return false;
//   }
//   return true;
// }
// export function applyBlockChangesToExistingFile(
//   lines: string[],
//   block: DiffBlock,
//   insertOffset: number
// ) {
//   for (const diffLine of block.lines) {
//     if (diffLine.type === LineType.CONTEXT && insertOffset === 0) {
//       const adjustedLine = block.newStartLine + insertOffset - 1;
//       if (lines[adjustedLine] !== diffLine.content.slice(1)) {
//         if (lines[adjustedLine + 1] === diffLine.content.slice(1)) {
//           block.newStartLine++;
//         } else if (
//           adjustedLine > 0 &&
//           lines[adjustedLine - 1] === diffLine.content.slice(1)
//         ) {
//           block.newStartLine--;
//         } else {
//           console.error(
//             `Error: Cannot find matching context line at ${adjustedLine} for file`
//           );
//           return { lines: lines, insertOffset: insertOffset };
//         }
//       }
//     }
//     const adjustedLine = block.newStartLine + insertOffset - 1;
//     if (diffLine.type === LineType.INSERT) {
//       lines.splice(adjustedLine, 0, diffLine.content.slice(1));
//       insertOffset++;
//     } else if (diffLine.type === LineType.DELETE) {
//       lines.splice(adjustedLine, 1);
//     } else if (diffLine.type === LineType.CONTEXT) {
//       insertOffset++;
//     }
//     // For LineType.CONTEXT, do nothing because the line is unchanged
//   }
//   return { lines: lines, insertOffset: insertOffset };
// }
// function applyBlockChangesToNewFile(block: DiffBlock) {
//   const lines: string[] = [];
//   for (const diffLine of block.lines) {
//     if (diffLine.type === LineType.INSERT) {
//       lines.push(diffLine.content.slice(1));
//     } // For LineType.DELETE and LineType.CONTEXT, do nothing because there's no content in a new file
//   }
//   return lines;
//}
