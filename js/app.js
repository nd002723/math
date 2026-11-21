/* Let's Math — 算数练习逻辑（重写版，保留原有功能与 localStorage 键名） */
(function () {
  'use strict';

  var MODES = {
    add: { label: '加法运算', sym: '+' },
    sub: { label: '减法运算', sym: '−' },
    mul: { label: '乘法运算', sym: '×' },
    div: { label: '除法运算', sym: '÷' },
    pow: { label: '乘方运算', sym: '^' }
  };

  /* 与原版一致的本地存储键，老用户的设置继续有效 */
  var KEYS = {
    fmin: 'Firstmin', fmax: 'Firstmax',
    smin: 'Secondmin', smax: 'Secondmax',
    auto: 'autoNew', narrow: 'CardLimt', seen: 'Firstuse'
  };

  var $ = function (id) { return document.getElementById(id); };

  var cfg = {
    fmin: 5, fmax: 900,
    smin: 2, smax: 900,
    auto: true, narrow: true
  };

  var state = { mode: 'add', a: 0, b: 0, answer: null };
  var autoTimer = null;

  function readInt(v, fallback) {
    var n = parseInt(v, 10);
    return isFinite(n) ? n : fallback;
  }

  function loadConfig() {
    cfg.fmin = readInt(localStorage.getItem(KEYS.fmin), 5);
    cfg.fmax = readInt(localStorage.getItem(KEYS.fmax), 900);
    cfg.smin = readInt(localStorage.getItem(KEYS.smin), 2);
    cfg.smax = readInt(localStorage.getItem(KEYS.smax), 900);
    cfg.auto = localStorage.getItem(KEYS.auto) !== 'false';
    cfg.narrow = localStorage.getItem(KEYS.narrow) !== 'false';
    normalizeConfig();
  }

  function normalizeConfig() {
    if (cfg.fmin > cfg.fmax) { var t = cfg.fmin; cfg.fmin = cfg.fmax; cfg.fmax = t; }
    if (cfg.smin > cfg.smax) { var s = cfg.smin; cfg.smin = cfg.smax; cfg.smax = s; }
    if (cfg.fmin === cfg.fmax) cfg.fmax = cfg.fmin + 1;
    if (cfg.smin === cfg.smax) cfg.smax = cfg.smin + 1;
  }

  function saveConfig() {
    localStorage.setItem(KEYS.fmin, String(cfg.fmin));
    localStorage.setItem(KEYS.fmax, String(cfg.fmax));
    localStorage.setItem(KEYS.smin, String(cfg.smin));
    localStorage.setItem(KEYS.smax, String(cfg.smax));
    localStorage.setItem(KEYS.auto, String(cfg.auto));
    localStorage.setItem(KEYS.narrow, String(cfg.narrow));
  }

  function randInt(min, max) {
    min = Math.ceil(min); max = Math.floor(max);
    if (max < min) { var t = min; min = max; max = t; }
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /* 出题：加减乘除乘方，除法保证整除、减法保证非负、乘方限制指数避免天文数字 */
  function makeQuestion(mode) {
    var a, b;
    if (mode === 'sub') {
      a = randInt(cfg.fmin, cfg.fmax);
      b = randInt(cfg.smin, cfg.smax);
      if (a < b) { var t = a; a = b; b = t; }
    } else if (mode === 'div') {
      b = Math.max(1, randInt(cfg.smin, cfg.smax));
      var maxQ = Math.max(1, Math.floor(cfg.fmax / b));
      var minQ = Math.max(1, Math.ceil(cfg.fmin / b));
      if (minQ > maxQ) minQ = 1;
      a = b * randInt(minQ, maxQ);
    } else if (mode === 'pow') {
      a = randInt(cfg.fmin, Math.min(cfg.fmax, 30));
      b = randInt(1, Math.min(cfg.smax, 6));
    } else {
      a = randInt(cfg.fmin, cfg.fmax);
      b = randInt(cfg.smin, cfg.smax);
    }
    return { a: a, b: b };
  }

  function result(mode, a, b) {
    switch (mode) {
      case 'add': return a + b;
      case 'sub': return a - b;
      case 'mul': return a * b;
      case 'div': return b === 0 ? NaN : a / b;
      case 'pow': return Math.pow(a, b);
      default: return NaN;
    }
  }

  function fmt(n) {
    if (!isFinite(n)) return '∞';
    return Number.isInteger(n) ? String(n) : String(Math.round(n * 1000) / 1000);
  }

  function setFeedback(text, kind) {
    var box = $('feedback');
    box.textContent = text;
    box.className = 'math-feedback' + (kind ? ' is-' + kind : '');
  }

  function render() {
    $('numA').textContent = fmt(state.a);
    $('numB').textContent = fmt(state.b);
    $('opSymbol').textContent = MODES[state.mode].sym;
    $('modeLabel').textContent = MODES[state.mode].label;
    state.answer = result(state.mode, state.a, state.b);
    var tabs = document.querySelectorAll('.math-tabs button');
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].setAttribute('aria-selected', tabs[i].getAttribute('data-mode') === state.mode ? 'true' : 'false');
    }
    $('answer').value = '';
    $('answer').focus();
  }

  function nextQuestion(keepMode) {
    if (autoTimer) { clearTimeout(autoTimer); autoTimer = null; }
    var q = makeQuestion(state.mode);
    state.a = q.a;
    state.b = q.b;
    render();
    setFeedback('输入答案后回车或点「提交结果」');
  }

  function checkAnswer() {
    var raw = $('answer').value.trim();
    if (raw === '') { setFeedback('先输入一个答案吧', 'wrong'); return; }
    var val = Number(raw);
    if (!isFinite(val)) { setFeedback('只支持数字答案', 'wrong'); return; }

    if (Math.abs(val - state.answer) < 1e-9) {
      setFeedback('恭喜你，答对了！', 'right');
      if (cfg.auto) {
        autoTimer = setTimeout(function () {
          autoTimer = null;
          nextQuestion();
        }, 650);
      }
    } else {
      setFeedback('答错了，再试试？', 'wrong');
      $('answer').select();
    }
  }

  function showAnswer() {
    setFeedback('答案是：' + fmt(state.answer));
  }

  /* ---------- 设置对话框 ---------- */
  function openSettings() {
    $('Fmin').value = cfg.fmin;
    $('Fmax').value = cfg.fmax;
    $('Smin').value = cfg.smin;
    $('Smax').value = cfg.smax;
    $('autoNew').checked = cfg.auto;
    $('cardLimit').checked = cfg.narrow;
    $('settingsDialog').showModal();
  }

  function applyNarrow() {
    var shell = $('mathShell');
    shell.classList.toggle('is-narrow', !!cfg.narrow);
  }

  function saveSettings() {
    var fmin = readInt($('Fmin').value, NaN);
    var fmax = readInt($('Fmax').value, NaN);
    var smin = readInt($('Smin').value, NaN);
    var smax = readInt($('Smax').value, NaN);
    if (!isFinite(fmin) || !isFinite(fmax) || !isFinite(smin) || !isFinite(smax)) {
      alert('抱歉，信息填写不完整！');
      return;
    }
    cfg.fmin = fmin; cfg.fmax = fmax; cfg.smin = smin; cfg.smax = smax;
    cfg.auto = $('autoNew').checked;
    cfg.narrow = $('cardLimit').checked;
    normalizeConfig();
    saveConfig();
    applyNarrow();
    $('settingsDialog').close();
    nextQuestion();
  }

  /* ---------- 首次帮助 ---------- */
  function maybeShowHelp() {
    if (localStorage.getItem(KEYS.seen)) return;
    $('helpDialog').showModal();
  }

  /* ---------- 绑定 ---------- */
  function bind() {
    document.querySelectorAll('.math-tabs button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.mode = btn.getAttribute('data-mode');
        nextQuestion();
      });
    });

    $('btnNew').addEventListener('click', function () { nextQuestion(); });
    $('btnCheck').addEventListener('click', checkAnswer);
    $('btnShow').addEventListener('click', showAnswer);
    $('answer').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); checkAnswer(); }
    });

    $('btnSettings').addEventListener('click', openSettings);
    $('btnSettingsCancel').addEventListener('click', function () { $('settingsDialog').close(); });
    $('btnSettingsSave').addEventListener('click', saveSettings);
    $('btnHelpOk').addEventListener('click', function () {
      try { localStorage.setItem(KEYS.seen, '1'); } catch (e) {}
      $('helpDialog').close();
    });

    /* 点遮罩关闭对话框 */
    ['settingsDialog', 'helpDialog'].forEach(function (id) {
      var dlg = $(id);
      dlg.addEventListener('click', function (e) {
        if (e.target === dlg) dlg.close();
      });
    });
  }

  loadConfig();
  applyNarrow();
  bind();
  nextQuestion();
  maybeShowHelp();
})();
