// build/_snowpack/pkg/canvas-confetti.js
var module = {};
(function main(global, module2, isWorker, workerSize) {
  var canUseWorker = !!(global.Worker && global.Blob && global.Promise && global.OffscreenCanvas && global.OffscreenCanvasRenderingContext2D && global.HTMLCanvasElement && global.HTMLCanvasElement.prototype.transferControlToOffscreen && global.URL && global.URL.createObjectURL);
  function noop() {
  }
  function promise(func) {
    var ModulePromise = module2.exports.Promise;
    var Prom = ModulePromise !== void 0 ? ModulePromise : global.Promise;
    if (typeof Prom === "function") {
      return new Prom(func);
    }
    func(noop, noop);
    return null;
  }
  var raf = function() {
    var TIME = Math.floor(1e3 / 60);
    var frame, cancel;
    var frames = {};
    var lastFrameTime = 0;
    if (typeof requestAnimationFrame === "function" && typeof cancelAnimationFrame === "function") {
      frame = function(cb) {
        var id = Math.random();
        frames[id] = requestAnimationFrame(function onFrame(time) {
          if (lastFrameTime === time || lastFrameTime + TIME - 1 < time) {
            lastFrameTime = time;
            delete frames[id];
            cb();
          } else {
            frames[id] = requestAnimationFrame(onFrame);
          }
        });
        return id;
      };
      cancel = function(id) {
        if (frames[id]) {
          cancelAnimationFrame(frames[id]);
        }
      };
    } else {
      frame = function(cb) {
        return setTimeout(cb, TIME);
      };
      cancel = function(timer) {
        return clearTimeout(timer);
      };
    }
    return {frame, cancel};
  }();
  var getWorker = function() {
    var worker;
    var prom;
    var resolves = {};
    function decorate(worker2) {
      function execute(options, callback) {
        worker2.postMessage({options: options || {}, callback});
      }
      worker2.init = function initWorker(canvas) {
        var offscreen = canvas.transferControlToOffscreen();
        worker2.postMessage({canvas: offscreen}, [offscreen]);
      };
      worker2.fire = function fireWorker(options, size, done) {
        if (prom) {
          execute(options, null);
          return prom;
        }
        var id = Math.random().toString(36).slice(2);
        prom = promise(function(resolve) {
          function workerDone(msg) {
            if (msg.data.callback !== id) {
              return;
            }
            delete resolves[id];
            worker2.removeEventListener("message", workerDone);
            prom = null;
            done();
            resolve();
          }
          worker2.addEventListener("message", workerDone);
          execute(options, id);
          resolves[id] = workerDone.bind(null, {data: {callback: id}});
        });
        return prom;
      };
      worker2.reset = function resetWorker() {
        worker2.postMessage({reset: true});
        for (var id in resolves) {
          resolves[id]();
          delete resolves[id];
        }
      };
    }
    return function() {
      if (worker) {
        return worker;
      }
      if (!isWorker && canUseWorker) {
        var code = [
          "var CONFETTI, SIZE = {}, module = {};",
          "(" + main.toString() + ")(this, module, true, SIZE);",
          "onmessage = function(msg) {",
          "  if (msg.data.options) {",
          "    CONFETTI(msg.data.options).then(function () {",
          "      if (msg.data.callback) {",
          "        postMessage({ callback: msg.data.callback });",
          "      }",
          "    });",
          "  } else if (msg.data.reset) {",
          "    CONFETTI && CONFETTI.reset();",
          "  } else if (msg.data.resize) {",
          "    SIZE.width = msg.data.resize.width;",
          "    SIZE.height = msg.data.resize.height;",
          "  } else if (msg.data.canvas) {",
          "    SIZE.width = msg.data.canvas.width;",
          "    SIZE.height = msg.data.canvas.height;",
          "    CONFETTI = module.exports.create(msg.data.canvas);",
          "  }",
          "}"
        ].join("\n");
        try {
          worker = new Worker(URL.createObjectURL(new Blob([code])));
        } catch (e) {
          typeof console !== void 0 && typeof console.warn === "function" ? console.warn("🎊 Could not load worker", e) : null;
          return null;
        }
        decorate(worker);
      }
      return worker;
    };
  }();
  var defaults = {
    particleCount: 50,
    angle: 90,
    spread: 45,
    startVelocity: 45,
    decay: 0.9,
    gravity: 1,
    drift: 0,
    ticks: 200,
    x: 0.5,
    y: 0.5,
    shapes: ["square", "circle"],
    zIndex: 100,
    colors: [
      "#26ccff",
      "#a25afd",
      "#ff5e7e",
      "#88ff5a",
      "#fcff42",
      "#ffa62d",
      "#ff36ff"
    ],
    disableForReducedMotion: false,
    scalar: 1
  };
  function convert(val, transform) {
    return transform ? transform(val) : val;
  }
  function isOk(val) {
    return !(val === null || val === void 0);
  }
  function prop(options, name, transform) {
    return convert(options && isOk(options[name]) ? options[name] : defaults[name], transform);
  }
  function onlyPositiveInt(number) {
    return number < 0 ? 0 : Math.floor(number);
  }
  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
  function toDecimal(str) {
    return parseInt(str, 16);
  }
  function colorsToRgb(colors) {
    return colors.map(hexToRgb);
  }
  function hexToRgb(str) {
    var val = String(str).replace(/[^0-9a-f]/gi, "");
    if (val.length < 6) {
      val = val[0] + val[0] + val[1] + val[1] + val[2] + val[2];
    }
    return {
      r: toDecimal(val.substring(0, 2)),
      g: toDecimal(val.substring(2, 4)),
      b: toDecimal(val.substring(4, 6))
    };
  }
  function getOrigin(options) {
    var origin = prop(options, "origin", Object);
    origin.x = prop(origin, "x", Number);
    origin.y = prop(origin, "y", Number);
    return origin;
  }
  function setCanvasWindowSize(canvas) {
    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight;
  }
  function setCanvasRectSize(canvas) {
    var rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  }
  function getCanvas(zIndex) {
    var canvas = document.createElement("canvas");
    canvas.style.position = "fixed";
    canvas.style.top = "0px";
    canvas.style.left = "0px";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = zIndex;
    return canvas;
  }
  function ellipse(context, x, y, radiusX, radiusY, rotation, startAngle, endAngle, antiClockwise) {
    context.save();
    context.translate(x, y);
    context.rotate(rotation);
    context.scale(radiusX, radiusY);
    context.arc(0, 0, 1, startAngle, endAngle, antiClockwise);
    context.restore();
  }
  function randomPhysics(opts) {
    var radAngle = opts.angle * (Math.PI / 180);
    var radSpread = opts.spread * (Math.PI / 180);
    return {
      x: opts.x,
      y: opts.y,
      wobble: Math.random() * 10,
      wobbleSpeed: Math.min(0.11, Math.random() * 0.1 + 0.05),
      velocity: opts.startVelocity * 0.5 + Math.random() * opts.startVelocity,
      angle2D: -radAngle + (0.5 * radSpread - Math.random() * radSpread),
      tiltAngle: (Math.random() * (0.75 - 0.25) + 0.25) * Math.PI,
      color: opts.color,
      shape: opts.shape,
      tick: 0,
      totalTicks: opts.ticks,
      decay: opts.decay,
      drift: opts.drift,
      random: Math.random() + 2,
      tiltSin: 0,
      tiltCos: 0,
      wobbleX: 0,
      wobbleY: 0,
      gravity: opts.gravity * 3,
      ovalScalar: 0.6,
      scalar: opts.scalar
    };
  }
  function updateFetti(context, fetti) {
    fetti.x += Math.cos(fetti.angle2D) * fetti.velocity + fetti.drift;
    fetti.y += Math.sin(fetti.angle2D) * fetti.velocity + fetti.gravity;
    fetti.wobble += fetti.wobbleSpeed;
    fetti.velocity *= fetti.decay;
    fetti.tiltAngle += 0.1;
    fetti.tiltSin = Math.sin(fetti.tiltAngle);
    fetti.tiltCos = Math.cos(fetti.tiltAngle);
    fetti.random = Math.random() + 2;
    fetti.wobbleX = fetti.x + 10 * fetti.scalar * Math.cos(fetti.wobble);
    fetti.wobbleY = fetti.y + 10 * fetti.scalar * Math.sin(fetti.wobble);
    var progress = fetti.tick++ / fetti.totalTicks;
    var x1 = fetti.x + fetti.random * fetti.tiltCos;
    var y1 = fetti.y + fetti.random * fetti.tiltSin;
    var x2 = fetti.wobbleX + fetti.random * fetti.tiltCos;
    var y2 = fetti.wobbleY + fetti.random * fetti.tiltSin;
    context.fillStyle = "rgba(" + fetti.color.r + ", " + fetti.color.g + ", " + fetti.color.b + ", " + (1 - progress) + ")";
    context.beginPath();
    if (fetti.shape === "circle") {
      context.ellipse ? context.ellipse(fetti.x, fetti.y, Math.abs(x2 - x1) * fetti.ovalScalar, Math.abs(y2 - y1) * fetti.ovalScalar, Math.PI / 10 * fetti.wobble, 0, 2 * Math.PI) : ellipse(context, fetti.x, fetti.y, Math.abs(x2 - x1) * fetti.ovalScalar, Math.abs(y2 - y1) * fetti.ovalScalar, Math.PI / 10 * fetti.wobble, 0, 2 * Math.PI);
    } else if (fetti.shape === "star") {
      var rot = Math.PI / 2 * 3;
      var innerRadius = 4 * fetti.scalar;
      var outerRadius = 8 * fetti.scalar;
      var x = fetti.x;
      var y = fetti.y;
      var spikes = 5;
      var step = Math.PI / spikes;
      while (spikes--) {
        x = fetti.x + Math.cos(rot) * outerRadius;
        y = fetti.y + Math.sin(rot) * outerRadius;
        context.lineTo(x, y);
        rot += step;
        x = fetti.x + Math.cos(rot) * innerRadius;
        y = fetti.y + Math.sin(rot) * innerRadius;
        context.lineTo(x, y);
        rot += step;
      }
    } else {
      context.moveTo(Math.floor(fetti.x), Math.floor(fetti.y));
      context.lineTo(Math.floor(fetti.wobbleX), Math.floor(y1));
      context.lineTo(Math.floor(x2), Math.floor(y2));
      context.lineTo(Math.floor(x1), Math.floor(fetti.wobbleY));
    }
    context.closePath();
    context.fill();
    return fetti.tick < fetti.totalTicks;
  }
  function animate(canvas, fettis, resizer, size, done) {
    var animatingFettis = fettis.slice();
    var context = canvas.getContext("2d");
    var animationFrame;
    var destroy;
    var prom = promise(function(resolve) {
      function onDone() {
        animationFrame = destroy = null;
        context.clearRect(0, 0, size.width, size.height);
        done();
        resolve();
      }
      function update() {
        if (isWorker && !(size.width === workerSize.width && size.height === workerSize.height)) {
          size.width = canvas.width = workerSize.width;
          size.height = canvas.height = workerSize.height;
        }
        if (!size.width && !size.height) {
          resizer(canvas);
          size.width = canvas.width;
          size.height = canvas.height;
        }
        context.clearRect(0, 0, size.width, size.height);
        animatingFettis = animatingFettis.filter(function(fetti) {
          return updateFetti(context, fetti);
        });
        if (animatingFettis.length) {
          animationFrame = raf.frame(update);
        } else {
          onDone();
        }
      }
      animationFrame = raf.frame(update);
      destroy = onDone;
    });
    return {
      addFettis: function(fettis2) {
        animatingFettis = animatingFettis.concat(fettis2);
        return prom;
      },
      canvas,
      promise: prom,
      reset: function() {
        if (animationFrame) {
          raf.cancel(animationFrame);
        }
        if (destroy) {
          destroy();
        }
      }
    };
  }
  function confettiCannon(canvas, globalOpts) {
    var isLibCanvas = !canvas;
    var allowResize = !!prop(globalOpts || {}, "resize");
    var globalDisableForReducedMotion = prop(globalOpts, "disableForReducedMotion", Boolean);
    var shouldUseWorker = canUseWorker && !!prop(globalOpts || {}, "useWorker");
    var worker = shouldUseWorker ? getWorker() : null;
    var resizer = isLibCanvas ? setCanvasWindowSize : setCanvasRectSize;
    var initialized = canvas && worker ? !!canvas.__confetti_initialized : false;
    var preferLessMotion = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion)").matches;
    var animationObj;
    function fireLocal(options, size, done) {
      var particleCount = prop(options, "particleCount", onlyPositiveInt);
      var angle = prop(options, "angle", Number);
      var spread = prop(options, "spread", Number);
      var startVelocity = prop(options, "startVelocity", Number);
      var decay = prop(options, "decay", Number);
      var gravity = prop(options, "gravity", Number);
      var drift = prop(options, "drift", Number);
      var colors = prop(options, "colors", colorsToRgb);
      var ticks = prop(options, "ticks", Number);
      var shapes = prop(options, "shapes");
      var scalar = prop(options, "scalar");
      var origin = getOrigin(options);
      var temp = particleCount;
      var fettis = [];
      var startX = canvas.width * origin.x;
      var startY = canvas.height * origin.y;
      while (temp--) {
        fettis.push(randomPhysics({
          x: startX,
          y: startY,
          angle,
          spread,
          startVelocity,
          color: colors[temp % colors.length],
          shape: shapes[randomInt(0, shapes.length)],
          ticks,
          decay,
          gravity,
          drift,
          scalar
        }));
      }
      if (animationObj) {
        return animationObj.addFettis(fettis);
      }
      animationObj = animate(canvas, fettis, resizer, size, done);
      return animationObj.promise;
    }
    function fire(options) {
      var disableForReducedMotion = globalDisableForReducedMotion || prop(options, "disableForReducedMotion", Boolean);
      var zIndex = prop(options, "zIndex", Number);
      if (disableForReducedMotion && preferLessMotion) {
        return promise(function(resolve) {
          resolve();
        });
      }
      if (isLibCanvas && animationObj) {
        canvas = animationObj.canvas;
      } else if (isLibCanvas && !canvas) {
        canvas = getCanvas(zIndex);
        document.body.appendChild(canvas);
      }
      if (allowResize && !initialized) {
        resizer(canvas);
      }
      var size = {
        width: canvas.width,
        height: canvas.height
      };
      if (worker && !initialized) {
        worker.init(canvas);
      }
      initialized = true;
      if (worker) {
        canvas.__confetti_initialized = true;
      }
      function onResize() {
        if (worker) {
          var obj = {
            getBoundingClientRect: function() {
              if (!isLibCanvas) {
                return canvas.getBoundingClientRect();
              }
            }
          };
          resizer(obj);
          worker.postMessage({
            resize: {
              width: obj.width,
              height: obj.height
            }
          });
          return;
        }
        size.width = size.height = null;
      }
      function done() {
        animationObj = null;
        if (allowResize) {
          global.removeEventListener("resize", onResize);
        }
        if (isLibCanvas && canvas) {
          document.body.removeChild(canvas);
          canvas = null;
          initialized = false;
        }
      }
      if (allowResize) {
        global.addEventListener("resize", onResize, false);
      }
      if (worker) {
        return worker.fire(options, size, done);
      }
      return fireLocal(options, size, done);
    }
    fire.reset = function() {
      if (worker) {
        worker.reset();
      }
      if (animationObj) {
        animationObj.reset();
      }
    };
    return fire;
  }
  var defaultFire;
  function getDefaultFire() {
    if (!defaultFire) {
      defaultFire = confettiCannon(null, {useWorker: true, resize: true});
    }
    return defaultFire;
  }
  module2.exports = function() {
    return getDefaultFire().apply(this, arguments);
  };
  module2.exports.reset = function() {
    getDefaultFire().reset();
  };
  module2.exports.create = confettiCannon;
})(function() {
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof self !== "undefined") {
    return self;
  }
  return this || {};
}(), module, false);
var __pika_web_default_export_for_treeshaking__ = module.exports;
var create = module.exports.create;
var canvas_confetti_default = __pika_web_default_export_for_treeshaking__;

// build/dist/questions.js
var logicFunctions = [logic0, logic1, logic2, logic3, logic4, logic5];
function logic0(inputs, difficulty2) {
  switch (difficulty2) {
    case 0:
      return inputs[0] || inputs[1];
    case 1:
      return inputs[0] && !inputs[1] || !inputs[0] && inputs[2];
    case 2:
      return inputs[1] && (inputs[0] || inputs[2]) || !inputs[1] && !inputs[2];
    case 3:
      return !inputs[0] && (!inputs[3] || inputs[1] && !inputs[2]) || inputs[0] && !inputs[1] && !inputs[2] && inputs[3];
  }
  return false;
}
function logic1(inputs, difficulty2) {
  switch (difficulty2) {
    case 0:
      return inputs[0] && inputs[1];
    case 1:
      return inputs[2] && (!inputs[0] || inputs[1]);
    case 2:
      return inputs[0] && (!inputs[1] || inputs[2]) || !inputs[1] && inputs[2];
    case 3:
      return inputs[3] || inputs[0] && inputs[1] && inputs[2] || !inputs[0] && !inputs[1] && !inputs[2];
  }
  return false;
}
function logic2(inputs, difficulty2) {
  switch (difficulty2) {
    case 0:
      return !(inputs[0] && inputs[1]);
    case 1:
      return inputs[0] && (!inputs[2] || !inputs[1]);
    case 2:
      return inputs[1] && (!inputs[2] || inputs[1]) || inputs[0] && !inputs[2];
    case 3:
      return inputs[2] && (!inputs[3] || !inputs[0] && inputs[1]) || inputs[0] && inputs[1] && !inputs[2];
  }
  return false;
}
function logic3(inputs, difficulty2) {
  switch (difficulty2) {
    case 0:
      return inputs[0] ^ inputs[1];
    case 1:
      return inputs[0] && !inputs[2] || !inputs[0] && inputs[2];
    case 2:
      return !inputs[2] || !inputs[0] && inputs[1] || inputs[0] && !inputs[1];
    case 3:
      return !inputs[1] && inputs[3] || inputs[1] && !inputs[3] || (inputs[0] && inputs[1] || !inputs[0] && !inputs[1]);
  }
  return false;
}
function logic4(inputs, difficulty2) {
  switch (difficulty2) {
    case 0:
      return !(inputs[0] || inputs[1]);
    case 1:
      return !inputs[2] || inputs[0] && !inputs[1];
    case 2:
      return !inputs[1] && (!inputs[0] || !inputs[2]) || inputs[0] && inputs[1] && inputs[2];
    case 3:
      return inputs[2] && (!inputs[0] || inputs[1] && inputs[3]) || inputs[0] && !inputs[2];
  }
  return false;
}
function logic5(inputs, difficulty2) {
  switch (difficulty2) {
    case 0:
      return !(inputs[0] ^ inputs[1]);
    case 1:
      return inputs[2] || !inputs[0] && inputs[1];
    case 2:
      return !inputs[1] || !inputs[0] && !inputs[2] || inputs[0] && inputs[2];
    case 3:
      return !inputs[3] || (!inputs[1] && (inputs[0] && !inputs[1]) || !inputs[0] && inputs[1]);
  }
  return false;
}

// build/dist/secondPage.js
var output = document.querySelector(".inputs__output");
var inputSwitches = Array.from(document.querySelectorAll(".checkbox"));
var hintButton = document.querySelector(".hint__link");
var modal = document.querySelector(".modal-wrapper");
var modalCloseButton = document.querySelector(".modal__close");
var multipleChoiceOptions = Array.from(document.querySelectorAll(".multiple-choice"));
var submitButton = document.querySelector(".submit-button");
var selectionImages = Array.from(document.querySelectorAll(".selection-images"));
var totalNumberOfQuestions = logicFunctions.length - 1;
var urlParams = new URLSearchParams(window.location.search);
var sound = new Audio("sounds/correctSoundEffect.mp3");
var difficulty = 0;
difficulty += Number(urlParams.get("difficulty")) % 4;
var numberOfInputs = 4;
var selectedChoice = null;
var answer = Math.floor(Math.random() * 4);
var randomQuestion = Math.floor(Math.random() * totalNumberOfQuestions);
var inputSwitchesValue = [0, 0, 0, 0];
window.onload = () => {
  generateImages();
  removeInputSwitches();
  for (let i = 0; i < numberOfInputs; i++) {
    changeInputSwitchValue(i);
  }
};
inputSwitches.forEach((inputSwitch) => {
  inputSwitch.addEventListener("click", () => {
    inputSwitch.value = String(Math.abs(Number(inputSwitch.value) - 1));
    changeInputSwitchValue(Number(inputSwitch.name));
  });
});
hintButton.addEventListener("click", () => {
  isModalVisible(true);
});
modalCloseButton.addEventListener("click", () => {
  isModalVisible(false);
});
multipleChoiceOptions.forEach((selection) => {
  selection.addEventListener("click", () => {
    selectedChoice = Number(selection?.value);
    submitButton.classList.remove("try-again");
  });
});
submitButton?.addEventListener("click", () => {
  if (selectedChoice == null)
    return;
  let selection = document.getElementById("option" + multipleChoiceOptions.at(selectedChoice).id);
  let quiz = document.querySelector(".form__choices");
  if (submitButton.innerText == "Next") {
    location.reload();
    submitButton.innerText = "Submit";
    return;
  } else {
    if (selectedChoice == answer) {
      sound.play();
      fireConfetti();
      submitButton.innerText = "Next";
      quiz?.classList.add("next-question");
      selection?.classList.add("right-answer");
      return;
    }
    selection?.classList.add("wrong-answer");
    submitButton.classList.add("try-again");
    submitButton.innerHTML = "Try Again";
  }
});
function fireConfetti() {
  var defaults = {
    spread: 360,
    ticks: 100,
    gravity: 0,
    decay: 0.95,
    startVelocity: 30,
    shapes: ["star"],
    colors: ["FFE400", "FFBD00", "E89400", "FFCA6C", "FDFFB8"]
  };
  function shoot() {
    canvas_confetti_default({
      ...defaults,
      particleCount: 5,
      scalar: 1.2,
      shapes: ["star"]
    });
    canvas_confetti_default({
      ...defaults,
      particleCount: 5,
      scalar: 0.9,
      shapes: ["circle"]
    });
  }
  setTimeout(shoot, 0);
  setTimeout(shoot, 50);
  setTimeout(shoot, 100);
}
function generateImages() {
  selectionImages.at(answer).src = `images/d${difficulty}q${randomQuestion}.png`;
  let rand4Digits = [0, 1, 2, 3, 4, 5].filter((val) => {
    if (val === randomQuestion)
      return false;
    return true;
  }).sort(() => 0.5 - Math.random()).slice(0, 4);
  for (let i = 0; i < 4; i++) {
    if (!selectionImages.at(i).src === true) {
      selectionImages.at(i).src = `images/d${difficulty}q${rand4Digits[i]}.png`;
    }
  }
}
function removeInputSwitches() {
  const switches = document.querySelectorAll(".switch");
  if (difficulty != 3)
    switches[3].remove();
  if (difficulty == 0)
    switches[2].remove();
}
function checkIfAnswerIsRight() {
  changeOutputValue(logicFunctions[randomQuestion](inputSwitchesValue, difficulty));
}
function changeOutputValue(inputsMatchesExpression) {
  if (inputsMatchesExpression) {
    output.classList.add("inputsMatchesExpression");
    output.innerHTML = "1";
    return;
  }
  output.classList.remove("inputsMatchesExpression");
  output.innerHTML = "0";
}
function changeInputSwitchValue(inputName) {
  inputSwitchesValue[inputName] = Number(inputSwitches.at(inputName)?.value);
  checkIfAnswerIsRight();
}
function isModalVisible(state) {
  return state ? modal.classList.remove("hidden") : modal.classList.add("hidden");
}
//# sourceMappingURL=secondPage.js.map
