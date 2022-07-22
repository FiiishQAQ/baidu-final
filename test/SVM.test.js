import {SVM} from "../src/SVM";
function renderHtml() {
    const div = document.createElement('div');
    div.setAttribute("id", "app");
    div.innerHTML = `
          <div id="bind" :red="isRed" @click="changeRedState">
            {{obj.a.b.c.d.e + a}}
          </div>
          <button id="addObjBtn" @click="addObjA">obj.a.b.c.d.e++</button>
          
          <div id="bVal">{{b}}</div>
          <button id="bPlusOne" @click="addB(1, $event)">b++</button>
          <button id="bPlusFive" @click="addB(5, $event)">b+5</button>
          
          <input mvvm-model="b" id="testInput" type="text">
          <textarea id="test" mvvm-model="b"></textarea>

          <label id="testRadioA"><input name="testRadio" type="radio" value="a" mvvm-model="radio">a</label>
          <label><input name="testRadio" type="radio" value="b" mvvm-model="radio">b</label>
          <label><input name="testRadio" type="radio" value="c" mvvm-model="radio">c</label>
          <label><input id="testRadioD" name="testRadio" type="radio" value="d" mvvm-model="radio">d</label>
          
          <select id="testSelect" mvvm-model="radio">
            <option value="a">a</option>
            <option value="b">b</option>
            <option value="c">c</option>
            <option value="d">d</option>
          </select>
          

          <label><input id="testCheckBoxA" name="testRadio" type="checkbox" value="a" mvvm-model="checkbox">a</label>
          <label><input id="testCheckBoxB" name="testRadio" type="checkbox" value="b" mvvm-model="checkbox">b</label>
          <label><input id="testCheckBoxC" name="testRadio" type="checkbox" value="c" mvvm-model="checkbox">c</label>
          <label><input id="testCheckBoxD" name="testRadio" type="checkbox" value="d" mvvm-model="checkbox">d</label>
          
          <select class="select" multiple mvvm-model="checkbox">
            <option value="a">a</option>
            <option value="b">b</option>
            <option value="c">c</option>
            <option value="d">d</option>
          </select>
    `;
    document.body.appendChild(div);

    let svm = new SVM({
        el: '#app',
        data: {
            a: 1233,
            b: 723,
            obj: {
                a: {
                    b: {
                        c: {
                            d: {
                                e: 12,
                            }
                        }
                    }
                }
            },
            isRed: true,
            radio: "d",
            checkbox: ["a", "d"],
        },
        methods: {
            addB(step, e) {
                console.log(this)
                this.b += step;
            },
            changeRedState() {
                this.isRed = !this.isRed;
            },
            addObjA() {
                console.log("add obj.a.b.c.d.e")
                this.obj.a.b.c.d.e++;
            },
        }
    });
    return svm;
}

test('单向绑定测试', () => {
    let svm = renderHtml();
    svm.model.obj.a.b.c.d.e = 123;
    expect(Number(document.querySelector('#bind').innerHTML)).toBe(1356);
    document.querySelector('#app').remove();
});

test('事件监听测试', () => {
    renderHtml();
    let button = document.querySelector('#addObjBtn');
    button.click();
    expect(Number(document.querySelector('#bind').innerHTML)).toBe(1246);
    document.querySelector('#app').remove();
});

test('带参数事件监听测试', () => {
    renderHtml();
    let buttonOne = document.querySelector('#bPlusOne');
    let buttonFive = document.querySelector('#bPlusFive');
    buttonOne.click();
    expect(Number(document.querySelector('#bVal').innerHTML)).toBe(724);
    buttonFive.click();
    expect(Number(document.querySelector('#bVal').innerHTML)).toBe(729);
    document.querySelector('#app').remove();
});

test('双向绑定 text 类型 input 测试', () => {
    renderHtml();
    let input = document.querySelector('#testInput');
    let buttonOne = document.querySelector('#bPlusOne');
    buttonOne.click();
    expect(Number(input.value)).toBe(724);
    
    input.value = 123;
    let evt = document.createEvent('HTMLEvents');
    evt.initEvent('input', true, true);
    input.dispatchEvent(evt);
    expect(Number(document.querySelector('#bVal').innerHTML)).toBe(123);
    document.querySelector('#app').remove();
});

test('双向绑定 radio 类型 input 及 select-one 测试', () => {
    renderHtml();
    let testRadioLabelA = document.querySelector("#testRadioA");
    let testRadioD = document.querySelector("#testRadioD");
    let testSelect = document.querySelector("#testSelect");
    testRadioLabelA.click();
    expect(testSelect.value).toBe('a');
    document.querySelector('#app').remove();
});

test('双向绑定 checkbox 类型 input 及 select-multiple 测试', () => {
    let svm = renderHtml();
    let testCheckBoxA = document.querySelector("#testCheckBoxA");
    let testCheckBoxB = document.querySelector("#testCheckBoxB");
    let testCheckBoxC = document.querySelector("#testCheckBoxC");
    let testCheckBoxD = document.querySelector("#testCheckBoxD");
    testCheckBoxA.click();
    testCheckBoxB.click();
    expect(svm.model.checkbox).toStrictEqual(['d', 'b']);
    document.querySelector('#app').remove();
});