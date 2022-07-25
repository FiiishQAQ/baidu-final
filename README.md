# 大作业项目文档

## 基本信息
**姓名**：余骏扬

**学校**：南京大学

**专业**：软件工程

**年级**：2020 级

**QQ**：1336483859

## 功能与实现

### 概述
本项目通过 `Javascript` 的 `Proxy` 和 `Reflect` 实现了一个简单的 MVVM 前端框架。并通过 `发布/订阅者模式` 实现响应式更新。

框架包括了适用于属性和元素内容的单项绑定、事件监听以及`部分 input`、`textarea` 和 `select` 的双向绑定。

在语法上，本项目参考了 `Vue` 的语法。

项目的 `src` 文件夹中为框架源码，`lib` 文件夹中为 babel 编译后的文件。

**由于使用了 Safari 浏览器不支持的零宽断言正则表达式，项目在 Safari 浏览器上无法正常运行，请使用其他浏览器！**

### 初始化框架
在开始使用前需要通过以下方式初始化框架：
```html
<script src="./lib/SVM.js"></script>
<script>
  const APP = new SVM({
    el: "selector",
    data: {...},
    methods: {...}
  })
</script>
```
其中 `el` 需要传入希望由框架接管的元素的选择器；
在 `data` 中定义所需要监听更改的数据；
在 `methods` 中定义需要使用的函数，在 `methods` 中定义的函数可以通过 `this.[变量名]` 直接访问变量。

### 单项绑定的使用
在 `data` 中定义了相关数据之后，可以使用如下语法绑定数据并动态更新：
```html
<div class="app">
  <p :class="class">
    {{greeting}}
  </p>
</div>

<script src="./lib/SVM.js"></script>
<script>
  const APP = new SVM({
    el: "#app",
    data: {
      greeting: "Hello World!",
      class: "red"
    }
  })
</script>
```
在元素的属性中，使用 `:[属性名]="表达式"` 的形式实现响应式绑定；
在文本内容中，使用 `{{表达式}}` 的形式实现响应式绑定。

在这两种形式中，使用 `data` 中的变量只需直接使用变量名，`SVM` 会将用户编写的表达式使用 `new Function()` 转化为函数，并在调用时传入 `data` 中目前的所有变量，
因此用户可以编写任意表达式、调用 `data` 中的任意变量，**但并不能调用函数或更改变量**。

### 事件监听的使用
在 `methods` 中定义了相关数据之后，可以使用如下语法绑定数据并动态更新：
```html
<div class="app">
  <p>{{counter}}</p>
  <button @click="addCounter">counter++</button>
  <button @click="addCounter($event, 5)">counter+5</button>
</div>

<script src="./lib/SVM.js"></script>
<script>
  const APP = new SVM({
    el: "#app",
    data: {
      counter: 0,
    },
    methods: {
      addCounter(e, num = 1) {
        this.counter += Number(num);
      }
    }
  })
</script>
```
即在需要进行事件监听的元素上添加一个 `@[事件名]="函数名/函数调用"` 的属性，其中属性值可以仅为 `methods` 中已经定义的函数名，也可以为完整的函数调用。

只使用函数名时，`事件对象` 将作为第一个参数传递给调用的函数；而使用函数调用的形式时，可以自由传递参数，但在需要传入 `事件对象` 时，必须使用 `$event` 显示制定其位置。

`SVM` 使用 `addEventListener` 实现事件监听，因此您可以给一个事件同时指定多个处理函数。

### 双向绑定
双向绑定实际上只是 `事件监听` 和 `单项绑定` 的语法糖，其支持 `type` 为 `text`、`radio` 和 `checkbox` 的 `INPUT` 元素、`TEXTAREA` 元素和 `SELECT` 元素。

在内部，对于 `text`、`textarea` 和 `select-one`，`SVM` 通过更改其 DOM 节点对象的 `value` 属性和监听其 `input` 事件来实现；

对于 `radio` 和 `checkbox`，`SVM` 通过更改各个选项的 `check` 属性和监听各个选项的 `change` 事件实现；

对于 `select-multiple`，`SVM` 通过更改 `select` 内部各个 `option` 的 `checked` 属性和监听 `select` 的 `change` 事件实现。

## 单测覆盖率情况
```
----------|---------|----------|---------|---------|-------------------
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
----------|---------|----------|---------|---------|-------------------
All files |    94.4 |    82.71 |    97.5 |   94.16 |                   
 SVM.js   |    94.4 |    82.71 |    97.5 |   94.16 | 122-130,142       
----------|---------|----------|---------|---------|-------------------
Test Suites: 1 passed, 1 total
Tests:       6 passed, 6 total
Snapshots:   0 total
Time:        0.652 s, estimated 1 s
```