import { spawn } from 'child_process';
import { Router } from 'express';
import os from 'os';

const OS = os.platform();
let cwd = __dirname; //preset cwd

const router = Router();

function run(cmd, cb, callback) {
  var bin = cmd[0],
    args = cmd.splice(1),
    stdout = '',
    stderr = '';

  try {
    var child = spawn(bin, args, { cwd: cwd });
  } catch (err) {
    console.log('spawn failed : ' + err.message);
  }

  var stdoutlines = 0;

  //this.debugprint(cmd,args,callback);

  child.stdout.on('data', function (data) {
    stdout += data.toString();
    stdoutlines++;
  });

  child.stderr.on('data', function (data) {
    stderr += data.toString();
  });

  child.on('error', function (error) {
    console.log('dialog-node, error = ', error);
  });

  child.on('exit', function (code) {
    cb && cb(code, stdout, stderr, callback);
  });
}

function fileselect(str, title, timeout, callback) {
  const cmd = [];
  let cb;
  let retVal;

  if (OS === 'linux') {
    str = str.replace(/[<>]/g, '');
    cmd.push('zenity');
    cmd.push('--file-selection');
    cmd.push('--directory'); // add this line to restrict selection to directories
    cmd.push('--text') && cmd.push(str);
    cmd.push('--title') && cmd.push(title);
    cmd.push('--timeout') && cmd.push(timeout);
    if (str.length > 30) cmd.push('--width') && cmd.push('300');
    cb = function (code, stdout, stderr) {
      //remove line ending
      retVal = stdout.slice(0, -1);
      if (callback) callback(code, retVal, stderr);
    };
  } else if (OS === 'darwin') {
    str = str.replace(/"/g, "'"); // double quotes to single quotes
    cmd.push('osascript') && cmd.push('-e');

    var script = 'set theFolder to choose folder';
    cmd.push(script);

    cb = function (code, stdout, stderr) {
      //parse return from appl script code
      const items = stdout.split(' ');
      retVal = items[items.length - 1]
        .replace(/:/g, '/')
        .replace(/\n/, '')
        .replace('HD', '');

      if (callback) callback(code, retVal, stderr);
    };
  } else if (OS === 'win32') {
    cmd.push('cscript');
    cmd.push('//Nologo');
    cmd.push('msgbox.vbs');
    cmd.push('directory');
    cmd.push(title);
    cmd.push(str);

    cb = function (code, stdout, stderr) {
      retVal = stdout;
      if (callback) callback(code, retVal, stderr);
    };
  }

  run(cmd, cb, callback);
}

router.get('/select-directory', (req, res) => {
  console.log('select-directory os=', OS);
  if (OS != 'linux' && OS != 'darwin' && OS != 'win32') {
    res.status(500).send('Unsupported OS');
    return;
  }

  var callback = function (code, retVal, stderr) {
    console.log('code: ' + code);
    console.log('retVal: ' + retVal);
    console.log('stderr: ' + stderr);

    if (code != 0) {
      res.status(500).send('Error: ' + stderr);
      return;
    }
    res.json({ success: true, data: retVal });
  };
  fileselect('Some text', 'Select your repository', 0, callback);
});

export default router;
