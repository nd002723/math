function GetRandomNum(Min, Max) {
  Max = parseInt(Max);
  Min = parseInt(Min);
  var Range = Max - Min - 1;
  var Rand = Math.random();
  return (Min + Math.round(Rand * Range));
}

function GetResult(First, Second, Operator) {
  First = parseInt(First);
  Second = parseInt(Second);
  Operator = parseInt(Operator);
  var Result;
  switch (Operator) {
    case 1:
      Result = null;
      Result = First + Second;
      break;
    case 2:
      Result = null;
      Result = First - Second;
      break;
    case 3:
      Result = null;
      Result = First * Second;
      break;
    case 4:
      Result = null;
      Result = First / Second;
      break;
    case 5:
      Result = null;
      Result = Math.pow(First, Second);
      break;
    default:
      Result = 'Error';
  }
  return Result;
}

function Operation(op) {
  switch (op) {
    case 1:
      var c = GetResult(document.getElementById('Afirst').innerHTML, document.getElementById('Asecond').innerHTML, 1);
      break;
    case 2:
      var c = GetResult(document.getElementById('Sfirst').innerHTML, document.getElementById('Ssecond').innerHTML, 2);
      break;
    case 3:
      var c = GetResult(document.getElementById('Mfirst').innerHTML, document.getElementById('Msecond').innerHTML, 3);
      break;
    case 4:
      var c = GetResult(document.getElementById('Dfirst').innerHTML, document.getElementById('Dsecond').innerHTML, 4); break;
    case 5:
      var c = GetResult(document.getElementById('Pfirst').innerHTML, document.getElementById('Psecond').innerHTML, 5); break;
    default:
      var c = 'Sorry，出现了点错误';
      break;
  }
  mdui.snackbar({
    message: '答案是：' + c
  });
}

function CheckResult(op) {
  switch (op) {
    case 1:
      var a = parseInt(document.getElementById('Ainput').value);
      var b = GetResult(document.getElementById('Afirst').innerHTML, document.getElementById('Asecond').innerHTML, 1);
      document.getElementById('Ainput').value = null;
      break;
    case 2:
      var a = parseInt(document.getElementById('Sinput').value);
      var b = GetResult(document.getElementById('Sfirst').innerHTML, document.getElementById('Ssecond').innerHTML, 2);
      document.getElementById('Sinput').value = null;
      break;
    case 3:
      var a = parseInt(document.getElementById('Minput').value);
      var b = GetResult(document.getElementById('Mfirst').innerHTML, document.getElementById('Msecond').innerHTML, 3);
      document.getElementById('Minput').value = null;
      break;
    case 4:
      var a = parseInt(document.getElementById('Dinput').value);
      var b = GetResult(document.getElementById('Dfirst').innerHTML, document.getElementById('Dsecond').innerHTML, 4);
      document.getElementById('Dinput').value = null;
      break;
    case 5:
      var a = parseInt(document.getElementById('Pinput').value);
      var b = GetResult(document.getElementById('Pfirst').innerHTML, document.getElementById('Dsecond').innerHTML, 5);
      document.getElementById('Pinput').value = null;
      break;
  }

  if (a == b) {
    var c = '恭喜你，答对了！';
    if (localStorage.autoNew == 'true') {
      GetRandom();
    }
  } else {
    var c = '答错了，再试试？';
  }
  mdui.snackbar({
    message: c,
    buttonText: '换题',
    onButtonClick: function () {
      GetRandom();
    }
  });
}

function GetRandom() {

  var Fmin = localStorage.Firstmin;
  var Fmax = localStorage.Firstmax;

  var Smin = localStorage.Secondmin;
  var Smax = localStorage.Secondmax;

  document.getElementById('Afirst').innerHTML = GetRandomNum(Fmin, Fmax);
  document.getElementById('Asecond').innerHTML = GetRandomNum(Smin, Smax);
  document.getElementById('Mfirst').innerHTML = GetRandomNum(Fmin, Fmax);
  document.getElementById('Msecond').innerHTML = GetRandomNum(Smin, Smax);
  document.getElementById('Pfirst').innerHTML = GetRandomNum(Fmin, Fmax);
  document.getElementById('Psecond').innerHTML = GetRandomNum(Smin, Smax);

  var a;
  var b;
  do {
    a = GetRandomNum(Fmin, Fmax);
    b = GetRandomNum(Smin, Smax);
  }
  while (a - b < 0);
  document.getElementById('Sfirst').innerHTML = a;
  document.getElementById('Ssecond').innerHTML = b;

  do {
    a = GetRandomNum(Fmin, Fmax);
    b = GetRandomNum(Smin, Smax);
  } while (a % b != 0 && a - b < 0);

  document.getElementById('Dfirst').innerHTML = a;
  document.getElementById('Dsecond').innerHTML = b;
}
function Ialreadyread(){
   localStorage.Firstuse = 1;
}
function Readconf() {
  var inst = new mdui.Dialog('#frist_dialog');
  var tab = new mdui.Tab('#help-tab');
  document.getElementById('help-tab').addEventListener('open.mdui.dialog', function () {
    tab.handleUpdate();
  });
  if(!localStorage.Firstuse){
    inst.open();
 
  }
  console.log('loaded', localStorage.Firstmin, localStorage.Firstmax, localStorage.Secondmin, localStorage.Secondmax);
  if (!localStorage.Firstmin) {
    localStorage.Firstmin = 5;
  } else {
    document.getElementById('Fmin').value = localStorage.Firstmin;
  }
  if (!localStorage.Firstmax) {
    localStorage.Firstmax = 900;
  } else {
    document.getElementById('Fmax').value = localStorage.Firstmax;
  }
  if (!localStorage.Secondmin) {
    localStorage.Secondmin = 2;
  } else {
    document.getElementById('Smin').value = localStorage.Secondmin;
  }
  if (!localStorage.Secondmax) {
    localStorage.Secondmax = 900;
  } else {
    document.getElementById('Smax').value = localStorage.Secondmax;
  }
  if (localStorage.autoNew == 'false') {
    document.getElementById('autoNew').checked = false;
  } else {
    document.getElementById('autoNew').checked = true;
  }
  if (localStorage.CardLimt == 'false') {
    document.getElementById('CardLimt').checked = false;
    document.getElementById('container').removeAttribute("style");
  } else {
    document.getElementById('CardLimt').checked = true;
    ///document.getElementById('container').style.cssText = 'max-width: 500px';
    document.getElementById('container').setAttribute("style", 'max-width: 500px');
  }
}


function Saveconf() {
  var Fmin = document.getElementById('Fmin').value;
  var Fmax = document.getElementById('Fmax').value;
  var Smin = document.getElementById('Smin').value;
  var Smax = document.getElementById('Smax').value;
  if (Fmin.length == 0 || Fmax.length == 0 || Smin.length == 0 || Smax.length == 0) {
    mdui.alert('抱歉，信息填写不完整！');
  } else {
    localStorage.Firstmin = Fmin;
    localStorage.Firstmax = Fmax;
    localStorage.Secondmin = Smin;
    localStorage.Secondmax = Smax;
    localStorage.autoNew = document.getElementById('autoNew').checked;
    localStorage.CardLimt = document.getElementById('CardLimt').checked;
    console.log('saved', localStorage.Firstmin, localStorage.Firstmax, localStorage.Secondmin, localStorage.Secondmax);
    Readconf();
  }
}