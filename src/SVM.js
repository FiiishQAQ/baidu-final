let mustacheRegExp = /{{(.*?)}}/g;

class SVM {
  model = {};
  view;
  channel = {};
  
  constructor(model) {
    this.view = document.querySelector(model.el);
    let publish = this.publish.bind(this);
    
    this.proxyAllArraysOrObjects(model.data, this.publish.bind(this));
    
    this.model = new Proxy(model, {
      get(target, prop, receiver) {
        if (target.data && Object.keys(target.data).includes(prop)) {
          return Reflect.get(target.data, prop, receiver.data);
        } else if (target.methods && Object.keys(target.methods).includes(prop)) {
          return Reflect.get(target.methods, prop, receiver.methods);
        } else {
          return Reflect.get(target, prop, receiver);
        }
      },
      set(target, p, value, receiver) {
        // console.log(`set ${p} as ${value}`, target, receiver)
        Reflect.set(target.data, p, value);
        publish(p);
        return true;
      }
    })
    
    if (this.view) {
      this.initAllNodes(this.view);
    }
  }
  
  proxyAllArraysOrObjects(target, publish, name = null, layer = 0,) {
    if (layer === 0) {
      Object.keys(target).forEach(key=>{
        if (typeof target[key] === "object") {
          target[key] = this.proxyAllArraysOrObjects(target[key], publish, key, layer+1)
        }
      });
    } else {
      for(let i in target) {
        if (typeof target[i] === "object") {
          target[i] = this.proxyAllArraysOrObjects(target[i], publish, name, layer+1)
        }
      }
    }
    
    return new Proxy(target, {
      get(...args) {
        return Reflect.get(...args);
      },
      set(t, p, value, receiver) {
        Reflect.set(t, p, value, receiver);
        publish(name);
        return true;
      }
    });
  }
  
  initAllNodes(node) {
    switch (node.nodeType) {
      case 3: // 普通文本Node
        if (node.nodeValue.match(mustacheRegExp)) {
          let nodeInstance = new Node(node, this.channel);
          this.initSubscription(nodeInstance, node.nodeValue);
          nodeInstance.update(this.model.data);
        }
        break;
      case 1: // Element
        let bindInput = (node, attr, type = 'text') => {
          let originalVal = node.getAttribute(attr);
          node.removeAttribute(attr);
          
          let inputNodeInstance = inputNodeFactory(node, originalVal, type);
          this.initSubscription(inputNodeInstance, originalVal, false);
          
          inputNodeInstance.update(this.model.data);
        }
        
        let isBindingFormNode = (node, attr) => {
          return (
              ((node.type === "text" || node.tagName === "TEXTAREA") && attr === ":value") ||
              ((node.type === "radio" || node.type === "checkbox") && attr === ":checked") ||
              (node.type === "select-one" && attr === ":value") ||
              (node.type === "select-multiple" && attr === ":value")
          );
        }
        
        let addDefaultMVVMEventListener  = (node, attr) => {
          let originalVal = node.getAttribute(attr);
          switch (node.type) {
            case "text":
            case "textarea":
            case "select-one":
              node.addEventListener("input", (function (e) {
                this[originalVal] = e.target.value
              }).bind(this.model));
              break;
            case "radio":
              node.addEventListener("change", (function (e) {
                this[originalVal] = e.target.value
              }).bind(this.model));
              break;
            case "checkbox":
              node.addEventListener("change", (function (e) {
                if (e.target.checked) {
                  this[originalVal].push(e.target.value);
                } else {
                  let i = -1;
                  if ((i = this[originalVal].findIndex(item => item === e.target.value)) !== -1) {
                    this[originalVal].splice(i, 1);
                  }
                }
              }).bind(this.model));
              break;
            case "select-multiple":
              node.addEventListener("change", (function (e) {
                let origin = [...this[originalVal]];
                for(let option of node){
                  if (option.selected && !origin.includes(option.value)) {
                    origin.push(option.value);
                  } else if ((!option.selected) && origin.includes(option.value)) {
                    origin.splice(origin.indexOf(option.value),1);
                  }
                }
                this[originalVal].splice(0, this[originalVal].length, ...origin);
              }).bind(this.model));
              break;
          }
        }
        
        node.getAttributeNames().forEach(attr => {
          // 双向绑定初始化
          if (attr === "mvvm-model") {
            addDefaultMVVMEventListener(node, attr)
            bindInput(node, attr, node.type);
          } else if (isBindingFormNode(node, attr)) {
            bindInput(node, attr, node.type);
          } else if (attr.startsWith(":")) { // 绑定值初始化
            let originalVal = node.getAttribute(attr);
            let attrName = attr.substring(1);
            node.removeAttribute(attr);
            node.setAttribute(attrName, originalVal);
            
            let attrNodeInstance = new AttrNode(node.getAttributeNode(attrName));
            this.initSubscription(attrNodeInstance, originalVal, false);
            
            attrNodeInstance.update(this.model.data);
          } else if (attr.startsWith("@")) { // 事件初始化
            let funcExp = node.getAttribute(attr);
            let eventName = attr.substring(1);
            node.removeAttribute(attr);
            if( funcExp.endsWith(")") ) {
              let funcName = funcExp.substring(0, funcExp.match(/\((.*)\)/).index);
              console.log(funcName, funcExp, this.model[funcName])
              let _f = new Function (funcName, '$event', funcExp);
              console.log(_f)
              node.addEventListener(eventName, event => _f(this.model[funcName].bind(this.model), event));
            } else {
              console.log(funcExp)
              node.addEventListener(eventName, this.model[funcExp].bind(this.model));
            }
          }
        })
        break;
    }
    if (node.childNodes.length) {
      node.childNodes.forEach(item => this.initAllNodes(item))
    }
  }
  
  initSubscription(node, value, mustache = true) {
    if (mustache) {
      Array.from(value.matchAll(mustacheRegExp)).forEach(item => {
        Object.keys(this.model.data).forEach(v => {
          if (item[1].match(new RegExp(`\\b(?<!\\.)${v}\\b`))) this.subscribe(v, node);
        })
      })
    } else {
      Object.keys(this.model.data).forEach(v => {
        if (value.match(new RegExp(`\\b(?<!\\.)${v}\\b`))) this.subscribe(v, node);
      })
    }
  }
  
  subscribe(key, node) {
    let thisChannel = this.channel[key] || (this.channel[key] = []);
    if (!thisChannel.includes(node)) thisChannel.push(node);
  }
  
  publish(key) {
    this.channel[key]?.forEach(item => {
      item.update(this.model.data)
    })
  }
}

class Node {
  node = null;
  originalVal = null;
  
  constructor(node) {
    this.node = node;
    this.originalVal = node.nodeValue;
  }
  
  update(data) {
    this.node.nodeValue = this.originalVal.replace(mustacheRegExp, (match, p1)=>{
      let _f = new Function(...Object.keys(data), `return ${p1}`);
      return _f(...Object.values(data));
    });
  }
}

class AttrNode extends Node {
  constructor(node) {
    super(node);
  }
  
  update(data) {
    let _f = new Function(...Object.keys(data), `return ${this.originalVal}`);
    this.node.nodeValue = _f(...Object.values(data));
  }
}

function inputNodeFactory(node, originalVal, type = "text") {
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
}

// select-one 和 text textarea 都适用
class InputNode extends Node {
  constructor(node, originalVal) {
    super(node);
    this.originalVal = originalVal;
  }
  
  update(data) {
    let _f = new Function(...Object.keys(data), `return ${this.originalVal}`);
    this.node.value = _f(...Object.values(data));
  }
}

class RadioNode extends InputNode {
  constructor(node, originalVal) {
    super(node, originalVal);
  }
  
  update(data) {
    let _f = new Function(...Object.keys(data), `return ${this.originalVal}`);
    this.node.checked = _f(...Object.values(data)) === this.node.value;
  }
}

class CheckBoxNode extends InputNode {
  constructor(node, originalVal) {
    super(node, originalVal);
  }
  
  update(data) {
    let _f = new Function(...Object.keys(data), `return ${this.originalVal}`);
    this.node.checked = _f(...Object.values(data)).includes(this.node.value);
  }
}

class SelectMultipleNode extends InputNode {
  constructor(node, originalVal) {
    super(node, originalVal);
  }
  
  update(data) {
    let _f = new Function(...Object.keys(data), `return ${this.originalVal}`);
    let selectedOpt = _f(...Object.values(data));
    for(let option of this.node){
      option.selected = selectedOpt.includes(option.value)
    }
  }
}

export {SVM};