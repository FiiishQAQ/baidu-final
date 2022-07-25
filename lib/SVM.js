"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SVM = void 0;

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct.bind(); } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var mustacheRegExp = /{{(.*?)}}/g;

var SVM = /*#__PURE__*/function () {
  function SVM(model) {
    _classCallCheck(this, SVM);

    _defineProperty(this, "model", {});

    _defineProperty(this, "view", void 0);

    _defineProperty(this, "channel", {});

    this.view = document.querySelector(model.el);
    var publish = this.publish.bind(this);
    this.proxyAllArraysOrObjects(model.data, this.publish.bind(this));
    this.model = new Proxy(model, {
      get: function get(target, prop, receiver) {
        if (target.data && Object.keys(target.data).includes(prop)) {
          return Reflect.get(target.data, prop, receiver.data);
        } else if (target.methods && Object.keys(target.methods).includes(prop)) {
          return Reflect.get(target.methods, prop, receiver.methods);
        } else {
          return Reflect.get(target, prop, receiver);
        }
      },
      set: function set(target, p, value, receiver) {
        // console.log(`set ${p} as ${value}`, target, receiver)
        Reflect.set(target.data, p, value);
        publish(p);
        return true;
      }
    });

    if (this.view) {
      this.initAllNodes(this.view);
    }
  }

  _createClass(SVM, [{
    key: "proxyAllArraysOrObjects",
    value: function proxyAllArraysOrObjects(target, publish) {
      var _this = this;

      var name = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var layer = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

      if (layer === 0) {
        Object.keys(target).forEach(function (key) {
          if (_typeof(target[key]) === "object") {
            target[key] = _this.proxyAllArraysOrObjects(target[key], publish, key, layer + 1);
          }
        });
      } else {
        for (var i in target) {
          if (_typeof(target[i]) === "object") {
            target[i] = this.proxyAllArraysOrObjects(target[i], publish, name, layer + 1);
          }
        }
      }

      return new Proxy(target, {
        get: function get() {
          return Reflect.get.apply(Reflect, arguments);
        },
        set: function set(t, p, value, receiver) {
          Reflect.set(t, p, value, receiver);
          publish(name);
          return true;
        }
      });
    }
  }, {
    key: "initAllNodes",
    value: function initAllNodes(node) {
      var _this2 = this;

      switch (node.nodeType) {
        case 3:
          // 普通文本Node
          if (node.nodeValue.match(mustacheRegExp)) {
            var nodeInstance = new Node(node, this.channel);
            this.initSubscription(nodeInstance, node.nodeValue);
            nodeInstance.update(this.model.data);
          }

          break;

        case 1:
          // Element
          var bindInput = function bindInput(node, attr) {
            var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'text';
            var originalVal = node.getAttribute(attr);
            node.removeAttribute(attr);
            var inputNodeInstance = inputNodeFactory(node, originalVal, type);

            _this2.initSubscription(inputNodeInstance, originalVal, false);

            inputNodeInstance.update(_this2.model.data);
          };

          var isBindingFormNode = function isBindingFormNode(node, attr) {
            return (node.type === "text" || node.tagName === "TEXTAREA") && attr === ":value" || (node.type === "radio" || node.type === "checkbox") && attr === ":checked" || node.type === "select-one" && attr === ":value" || node.type === "select-multiple" && attr === ":value";
          };

          var addDefaultMVVMEventListener = function addDefaultMVVMEventListener(node, attr) {
            var originalVal = node.getAttribute(attr);

            switch (node.type) {
              case "text":
              case "textarea":
              case "select-one":
                node.addEventListener("input", function (e) {
                  this[originalVal] = e.target.value;
                }.bind(_this2.model));
                break;

              case "radio":
                node.addEventListener("change", function (e) {
                  this[originalVal] = e.target.value;
                }.bind(_this2.model));
                break;

              case "checkbox":
                node.addEventListener("change", function (e) {
                  if (e.target.checked) {
                    this[originalVal].push(e.target.value);
                  } else {
                    var i = -1;

                    if ((i = this[originalVal].findIndex(function (item) {
                      return item === e.target.value;
                    })) !== -1) {
                      this[originalVal].splice(i, 1);
                    }
                  }
                }.bind(_this2.model));
                break;

              case "select-multiple":
                node.addEventListener("change", function (e) {
                  var _this$originalVal;

                  var origin = _toConsumableArray(this[originalVal]);

                  var _iterator = _createForOfIteratorHelper(node),
                      _step;

                  try {
                    for (_iterator.s(); !(_step = _iterator.n()).done;) {
                      var option = _step.value;

                      if (option.selected && !origin.includes(option.value)) {
                        origin.push(option.value);
                      } else if (!option.selected && origin.includes(option.value)) {
                        origin.splice(origin.indexOf(option.value), 1);
                      }
                    }
                  } catch (err) {
                    _iterator.e(err);
                  } finally {
                    _iterator.f();
                  }

                  (_this$originalVal = this[originalVal]).splice.apply(_this$originalVal, [0, this[originalVal].length].concat(_toConsumableArray(origin)));
                }.bind(_this2.model));
                break;
            }
          };

          node.getAttributeNames().forEach(function (attr) {
            // 双向绑定初始化
            if (attr === "mvvm-model") {
              addDefaultMVVMEventListener(node, attr);
              bindInput(node, attr, node.type);
            } else if (isBindingFormNode(node, attr)) {
              bindInput(node, attr, node.type);
            } else if (attr.startsWith(":")) {
              // 绑定值初始化
              var originalVal = node.getAttribute(attr);
              var attrName = attr.substring(1);
              node.removeAttribute(attr);
              node.setAttribute(attrName, originalVal);
              var attrNodeInstance = new AttrNode(node.getAttributeNode(attrName));

              _this2.initSubscription(attrNodeInstance, originalVal, false);

              attrNodeInstance.update(_this2.model.data);
            } else if (attr.startsWith("@")) {
              // 事件初始化
              var funcExp = node.getAttribute(attr);
              var eventName = attr.substring(1);
              node.removeAttribute(attr);

              if (funcExp.endsWith(")")) {
                var funcName = funcExp.substring(0, funcExp.match(/\((.*)\)/).index);
                console.log(funcName, funcExp, _this2.model[funcName]);

                var _f = new Function(funcName, '$event', funcExp);

                console.log(_f);
                node.addEventListener(eventName, function (event) {
                  return _f(_this2.model[funcName].bind(_this2.model), event);
                });
              } else {
                console.log(funcExp);
                node.addEventListener(eventName, _this2.model[funcExp].bind(_this2.model));
              }
            }
          });
          break;
      }

      if (node.childNodes.length) {
        node.childNodes.forEach(function (item) {
          return _this2.initAllNodes(item);
        });
      }
    }
  }, {
    key: "initSubscription",
    value: function initSubscription(node, value) {
      var _this3 = this;

      var mustache = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      if (mustache) {
        Array.from(value.matchAll(mustacheRegExp)).forEach(function (item) {
          Object.keys(_this3.model.data).forEach(function (v) {
            if (item[1].match(new RegExp("\\b(?<!\\.)".concat(v, "\\b")))) _this3.subscribe(v, node);
          });
        });
      } else {
        Object.keys(this.model.data).forEach(function (v) {
          if (value.match(new RegExp("\\b(?<!\\.)".concat(v, "\\b")))) _this3.subscribe(v, node);
        });
      }
    }
  }, {
    key: "subscribe",
    value: function subscribe(key, node) {
      var thisChannel = this.channel[key] || (this.channel[key] = []);
      if (!thisChannel.includes(node)) thisChannel.push(node);
    }
  }, {
    key: "publish",
    value: function publish(key) {
      var _this$channel$key,
          _this4 = this;

      (_this$channel$key = this.channel[key]) === null || _this$channel$key === void 0 ? void 0 : _this$channel$key.forEach(function (item) {
        item.update(_this4.model.data);
      });
    }
  }]);

  return SVM;
}();

exports.SVM = SVM;

var Node = /*#__PURE__*/function () {
  function Node(node) {
    _classCallCheck(this, Node);

    _defineProperty(this, "node", null);

    _defineProperty(this, "originalVal", null);

    this.node = node;
    this.originalVal = node.nodeValue;
  }

  _createClass(Node, [{
    key: "update",
    value: function update(data) {
      this.node.nodeValue = this.originalVal.replace(mustacheRegExp, function (match, p1) {
        var _f = _construct(Function, _toConsumableArray(Object.keys(data)).concat(["return ".concat(p1)]));

        return _f.apply(void 0, _toConsumableArray(Object.values(data)));
      });
    }
  }]);

  return Node;
}();

var AttrNode = /*#__PURE__*/function (_Node) {
  _inherits(AttrNode, _Node);

  var _super = _createSuper(AttrNode);

  function AttrNode(node) {
    _classCallCheck(this, AttrNode);

    return _super.call(this, node);
  }

  _createClass(AttrNode, [{
    key: "update",
    value: function update(data) {
      var _f = _construct(Function, _toConsumableArray(Object.keys(data)).concat(["return ".concat(this.originalVal)]));

      this.node.nodeValue = _f.apply(void 0, _toConsumableArray(Object.values(data)));
    }
  }]);

  return AttrNode;
}(Node);

function inputNodeFactory(node, originalVal) {
  var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "text";

  switch (type) {
    case "text":
    case "textarea":
    case "select-one":
      return new InputNode(node, originalVal);

    case "radio":
      return new RadioNode(node, originalVal);

    case "checkbox":
      return new CheckBoxNode(node, originalVal);

    case "select-multiple":
      return new SelectMultipleNode(node, originalVal);
  }
} // select-one 和 text textarea 都适用


var InputNode = /*#__PURE__*/function (_Node2) {
  _inherits(InputNode, _Node2);

  var _super2 = _createSuper(InputNode);

  function InputNode(node, originalVal) {
    var _this5;

    _classCallCheck(this, InputNode);

    _this5 = _super2.call(this, node);
    _this5.originalVal = originalVal;
    return _this5;
  }

  _createClass(InputNode, [{
    key: "update",
    value: function update(data) {
      var _f = _construct(Function, _toConsumableArray(Object.keys(data)).concat(["return ".concat(this.originalVal)]));

      this.node.value = _f.apply(void 0, _toConsumableArray(Object.values(data)));
    }
  }]);

  return InputNode;
}(Node);

var RadioNode = /*#__PURE__*/function (_InputNode) {
  _inherits(RadioNode, _InputNode);

  var _super3 = _createSuper(RadioNode);

  function RadioNode(node, originalVal) {
    _classCallCheck(this, RadioNode);

    return _super3.call(this, node, originalVal);
  }

  _createClass(RadioNode, [{
    key: "update",
    value: function update(data) {
      var _f = _construct(Function, _toConsumableArray(Object.keys(data)).concat(["return ".concat(this.originalVal)]));

      this.node.checked = _f.apply(void 0, _toConsumableArray(Object.values(data))) === this.node.value;
    }
  }]);

  return RadioNode;
}(InputNode);

var CheckBoxNode = /*#__PURE__*/function (_InputNode2) {
  _inherits(CheckBoxNode, _InputNode2);

  var _super4 = _createSuper(CheckBoxNode);

  function CheckBoxNode(node, originalVal) {
    _classCallCheck(this, CheckBoxNode);

    return _super4.call(this, node, originalVal);
  }

  _createClass(CheckBoxNode, [{
    key: "update",
    value: function update(data) {
      var _f = _construct(Function, _toConsumableArray(Object.keys(data)).concat(["return ".concat(this.originalVal)]));

      this.node.checked = _f.apply(void 0, _toConsumableArray(Object.values(data))).includes(this.node.value);
    }
  }]);

  return CheckBoxNode;
}(InputNode);

var SelectMultipleNode = /*#__PURE__*/function (_InputNode3) {
  _inherits(SelectMultipleNode, _InputNode3);

  var _super5 = _createSuper(SelectMultipleNode);

  function SelectMultipleNode(node, originalVal) {
    _classCallCheck(this, SelectMultipleNode);

    return _super5.call(this, node, originalVal);
  }

  _createClass(SelectMultipleNode, [{
    key: "update",
    value: function update(data) {
      var _f = _construct(Function, _toConsumableArray(Object.keys(data)).concat(["return ".concat(this.originalVal)]));

      var selectedOpt = _f.apply(void 0, _toConsumableArray(Object.values(data)));

      var _iterator2 = _createForOfIteratorHelper(this.node),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var option = _step2.value;
          option.selected = selectedOpt.includes(option.value);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
  }]);

  return SelectMultipleNode;
}(InputNode);