# js-deep

## js 是單執行緒 且同步執行的

## 全域物件 vs `this`

當你通過瀏覽器打開一個 `html` 並且裡面引入一個完全空白的 js

你會發現 js 幫你生成了兩個東西

- 全域物件: 如果你用瀏覽器開啟 該全域物件即是 `window`

- `this`: 全域物件本身

## 變量與函數

當變量與函數不是寫在某個函數中時 該變量與函數就是全域物件

比如我們創建一個變數 a 與一個函數 b 並且變數與函數都沒有寫在其他函數中

這時候你打開瀏覽器的 `Console` 即會發現 `window` 這個全域物件中多了變數 a 與函數 b

並且你可以通過 `console.log(a, b)` 或 `console.log(window.a, window.b)` 來得到該值

## 執行過程

js 在執行代碼時 不是把所有代碼都直接通過電腦去執行 而是會先把代碼編譯成電腦能理解的東西

在編譯的時候 代碼中的變數與函數會先被記憶體預留空間 而函數會整個被保存在記憶體 變數則是給予預設值 `undefined`

於是當我們的代碼順序是先執行函數後定義函數時 就會發現函數是可以被執行調用的

但變數如果先定義後獲取 則是會給出 `undefined` 這個值（記憶體中預設的值）

該執行過程被稱為`提升(hoisting)`

- 因為在 js 執行的過程中 會先編譯你所寫的代碼 而編譯的過程會先在記憶體儲存變量/函數的空間 所以不會出現 `is not defined` 的錯誤 (該提示是在這個變量完全沒有被定義的情況下才會出現)

- 變量的賦值會在儲存至記憶體後 才開始執行 導致當代碼的順序是先獲取變數定義的值 再給變數賦值時 獲取到的結果是一開始在記憶體中預設的值 `undefined`

- 所以我們在撰寫 js 代碼時盡量不要依賴`提升(hoisting)`的行為 而是應該先設定好變數與函數後 再執行獲取/調用的動作

## `undefined`

當一個變數被賦值 但執行的過程是先獲取該變數後才給予值時 該獲取到的值就會是 `undefined`

原因是在創造 js 執行環境的過程中我們會先給該變數保留一個記憶體空間 並給它預設值 `undefined`

這個 `undefined` 並不是字符串 而是 js 的關鍵字 它所代表的意思是 `該變量沒有被設定值`

這是 js 在執行環境的創造過程中幫我們設定的值 讓我們在看到該關鍵字時 可以馬上知道該變量沒有被設定值

並且 在一個變數沒有被賦值 僅僅只是被定義的時候 該變量的值也會是 `undefined`

- `undefined` 代表的是`該變量存在但是沒有賦值`

- `變量 is not defined` 則是該變量沒有被定義過 (即該變量它`完全不存在`)

- `理論上`是可以`手動`將一個變量賦值為`undefined`的 **_但建議最好不要這樣做_**

- 當你想給一個變量定義為沒有值時 建議使用 `null` (訴求是讓`undefined`始終為 js 的預設值 比較好 debug)

## 函數與執行堆

當一個函數被呼叫或調用的時候 就會產生一個執行堆

假設有一個函數 1 與函數 2 在函數 1 中呼叫了函數 2

這時候的執行順序是:

a. 生成全域物件與 `this` 然後在記憶體中為函數 1 與函數 2 預留空間

b. 調用了函數 1, 此時會創造一個執行堆 執行堆中生成新的全域物件與 `this` (這裡面的 `this` 會指向函數 1)

c. 發現函數 1 調用了函數 2 所以再在函數 1 的執行堆上面創造一個執行堆 並在該執行堆中生成一個新的全域物件與 `this` (這裡的 `this` 則會指向函數 2)

接下來檢查函數 2 中是否還有別的函數 有就繼續創造執行堆在函數 2 上面

當函數 2 執行完, js 就會繼續往下執行函數 1, 看函數 1 中除了調用函數 2 以外還要做什麼

如果函數 1 沒有其他操作了 就再往下執行全域環境的代碼

## 函數、環境與變數環境

在函數中聲明的變量僅會在自己的函數環境中有效

假設有一個全域變量 `var a = 1` 在函數 a 中又聲明了 `var a = 0`

當函數 a 執行完畢後 在全域環境中 `console.log(a)`

變量 a 的結果並不會受到函數 a 影響 而依然會是全域變量的 `1`

即 每個執行堆裡面的變量 並`不會`互相影響 它們都是`獨立存在`於該執行環境(`執行堆`)中的

參考代碼如下:

```js
function b() {
  var myVar;
  console.log(myVar); // 它在自己的執行堆中是默認值 `undefined` 所以輸出結果也是 `undefined`
}

function a() {
  var myVar = 2;
  console.log(myVar); // 它在自己的執行堆中是 2 所以輸出結果還是 2
  b();
}

var myVar = 1;
console.log(myVar); // 1 全域
a();
console.log(myVar); // 1 全域
```

## 範圍鏈

在函數中如果你查找了某個完全沒有在函數中被定義的變數 會有幾種情況

- 情境 1 - 函數外層沒有被其他函數包覆:

```js
function b() {
  console.log(myVar); // 輸出結果 myVar 為 1
}

function a() {
  var myVar = 2;
  b();
}

var myVar = 1;
a();
```

當在 b 裡面找不到該變數時 就會往外部參考去查找該變數

而由於它被定義時的物理位置是在全域上(即它是在全域那層最基底層上 沒有被任何東西包覆)

所以它的外部參考就是全域環境

最後 它就會在全域環境中查找該變數 輸出結果就是 `myVar = 1`

- 情境 2 - 函數的外部有被其他函數包住:

函數 b 中沒有`myVar`這個變量 所以往外參考包住它的函數 a

當函數 a 有`myVar`這個變量時 輸出結果就是 `myVar = 2` 如下:

```js
function a() {
  function b() {
    console.log(myVar); // 參考外部的函數 a 所以結果是 2
  }
  var myVar = 2;
  b();
}

var myVar = 1;
a();
```

但如果函數 a 裡面也沒有變數`myVar`, 函數 b 就會再繼續找到全域中的變量(因為函數 a 的外部參照是全域)

所以如果函數 a 與函數 b 都沒有聲明過這個變量`myVar` 就會輸出全域中的變量`myVar = 1`

```js
function a() {
  function b() {
    console.log(myVar); // 參考外部的函數 a 但函數 a 也沒有 就參考函數 a 的外部全域 所以結果是 1
  }
  b();
}

var myVar = 1;
a();
```

## js 的非同步處理

前面說過 js 是單執行緒加同步處理

但它有一些比如點擊事件或 ajax 行為 當遇上這種必須使用到非同步處理的事件時

它的處理順序並不是真的非同步處理 而是看起來好像是非同步處理

在 js 中的真正執行順序會如下:

1. 把這些要非同步處理的事件暫時放在佇列中

2. 當所有同步事件處理完成後 回頭去看佇列裏的事件 並依序執行

乍看之下 執行起來雖然與非同步很像 但其時它會先等到執行堆全部空了才開始執行佇列中的事件

可參考下方代碼:

```js
// 強制讓 js 三秒後再開始執行
function waitThreeSeconds() {
  var ms = 3000 + new Date().getTime();
  while (new Date() < ms) {}
  console.log("finished function");
}

function clickHandler() {
  console.log("click event!");
}

// 監聽非同步的點擊事件(測試方式為: 開啟瀏覽器後在三秒鐘內點擊)
document.addEventListener("click", clickHandler);

waitThreeSeconds();
console.log("finished execution");
```

最後上述代碼的輸出結果會是:

1. `finished function`

2. `finished execution`

3. `click event!`

原因是點擊事件被暫時放到佇列中 並等待執行堆執行完畢後才依序執行佇列中的事件

所以 `click` 事件永遠在最後才執行

## js 的六種純值(基本型別)類型

1. `undefined` : 表示該變數`沒有被賦值過`的預設值

2. `null` : 設置一個變數為`空`

3. `boolean` : 只有 `true` 與 `false`

4. `string` : 字符串，通常用雙引號或單引號包裹

5. `number` : 數字，帶浮點數

6. `symbol` : 符號， `ES6` 版本出現的

## 運算子

運算子其實也是一個函數 該函數會將兩個值傳入並返回一個值 而運算子的函數通常使用中綴表示法

運算子有優先性與相依性 優先性是指`當兩個符號同時出現在一句話上時 優先執行哪一個`

比如 `var a = 2 + 3 * 4` 時 `3 * 4` 會優先執行 因為 `*` 的優先性比 `+` 高

相依性是指`當優先性完全一樣時 會從哪個方向開始執行`

比如 `var a = 1, b = 2, c = 3; a = b = c` 此時全部的運算子都是等於 所以它們的`優先性相同`

但等號的相依性是`由右到左` 所以會先執行 `b = c`(返回 3) 再執行 `a = b`(返回 3)

`console.log(a = b = c)` 結果就是 `3`

## js 中的強制轉換型別

舉例:

```js
console.log(1 < 2 < 3); // 結果為 true

console.log(3 < 2 < 1); // 結果為 true
```

上述兩個例子的結果都是`true`

- WHY?

首先 `<` 符號的相依性是從左到右 所以會先執行 `1 < 2` 返回的結果是 `true`

接下來會執行 `true < 3` 此時 js 就會進行強制轉換型別 把 `true` 轉換為 `1`(true 與 false 分別為 1 與 0)

所以實際上會變成 `1 < 3` 返回結果就是 `true` 了

同理 在第二句的 `3 < 2 < 1`

會先執行 `3 < 2` 返回 `false`

接下來會執行 `false < 1` 此時 js 就會進行強制轉換型別 把 `false` 轉換為 `0`

所以實際上會變成 `0 < 1` 返回結果就還是 `true`

這是 js 的`強制轉換型別機制` 所以當要判斷兩個值是否相等時 如果使用`雙等於` 就會被強制轉換

但是 如果使用`三等於` 就可以阻止它們被強制轉換

因此建議在判斷時都`使用三等於取代雙等於` 除非你就是希望他們被強制轉換 否則不要使用雙等於做比較

- 補充: 在 `ES6` 中還新增了幾種精確度比三等於更高的方法 這裏暫時不說

## 框架

假設你在檔案中引入了兩個框架 且兩個框架中都存在同一個名稱的東西 此時執行後可能會造成`命名衝突`

所以你會發現在很多框架中的第一行會出現 `window.xxx = window.xxx || newValue`

這是在判斷其他框架中是否已經有了這個名稱 以阻止框架被覆蓋的問題

可以通過這種方式處理的究其原因是 當你在某個檔案中引入多個 `.js` 它們不會各自創造自己的執行環境

而是集中將所有代碼放到同一個執行環境中

如果它們的外部沒有其他 `.js` 包覆 則他們就是存在於同一個全域環境下

所以可以通過 `window.xxx = window.xxx || newValue` 來處理衝突問題 這是在檢查全域命名空間

## 物件與函數

首先 對 js 而言 物件與函數在很多情況下其實是幾乎一樣的

而在物件裡面的值 除了可以是一個單純的值 它還可以是一個新的物件

甚至可以是方法(在物件中的函數即被稱為方法)

## 物件中的成員取用方式

物件可以通過`中括號`來添加/獲取某屬性 如 `name['firstname']`

這個中括號是一個運算子 該運算子被稱為`計算取用成員` 它的優先性很高 排在所有運算子中的第三順位

也可以通過`點`來添加/獲取某屬性 如 `name.firstname`

這個點也是一個運算子 是成員取用的方式之一 而它的優先性比中括號更高 排在第二

括弧與點在操作物件屬性時的差別在於:

1. 括弧記法中可以傳入字符串 也可傳入變數 但點記法只能傳入屬性名

   括弧記法傳入字符串的方式為:

   `name['firstname']`

   括弧記法傳入變數的方式為:

   ```js
   var name = new Object();
   var first = "firstname";

   name[first] = "Joe";
   ```

   點記法的使用方式為:

   `name.firstname = "Joe"`

2. 括弧記法中傳入屬性名時需要加上引號 將字符串包裹住 但點記法則必須省略引號

## 創建物件的方式

創建物件 除了通過聲明變量為 `new Object()` 的方式外

還可以通過花括號來創建物件 該方法叫做`物件實體語法`

物件實體語法的使用方式為:

1. 用花括號定義一個物件

2. 在花括號中用冒號區隔屬性名與屬性值

3. 用逗號區隔兩個不同的屬性

注意: 這個花括號並不是運算子 可以這樣做的原因是 js 在語法解析時 看到花括號 會自動判定這是一個物件

在物件實體語法出現以前 我們須通過 `new Object()` 的方式先創建一個空物件對象

再通過中括號或點的方式一個一個的添加物件屬性

而物件實體語法 則可以直接通過往花括號中撰寫屬性名與屬性值來添加物件屬性

並且物件實體語法可以在任意位置使用

比如可以在函數傳參的位置中 直接通過物件實體語法創建一個新物件 也可以在點記法設定屬性值的時候使用等

## 命名空間

在程式語言中 命名空間就是一個用來存放變數與函式的容器

但 js 沒有命名空間 這是由於物件的本質

在 js 中要避免同樣的名稱在全域命名空間中被取代 可以通過創建物件的方式達到偽裝命名空間的效果

比如:

```js
var greet = "hi";
var greet = "hola";
console.log(greet); // greet 重名所以被取代 輸出結果為 hola
var E = { greet: "hi" };
var S = { greet: "hole" };
console.log(E.greet, S.greet); // greet 各自被物件包裹 所以獨立存在 輸出結果為 hi, hola
```

## JSON

`JSON` 是指`物件表示法` 它是被物件實體語法所啟發而產生的一種資料傳輸格式

JSON 的格式可以用在物件上 但物件的格式不一定可以用在 JSON 上

JSON 對語法的要求很嚴謹 它規定所有除了布爾值與數字外的字符都`必須`使用`雙引號`包住 不管該字符是屬性值或屬性名

但在物件中 就算使用這種雙引號方式寫法 被解析後仍是普通的物件格式 不會出錯

另外 js 中提供了兩種方便操作 JOSN 的方法

```js
JSON.stringify(); // 將傳入的值轉換為 JSON 格式
JSON.parse(); // 將傳入的 JSON 數據轉換為物件
```

## 函數即是物件

在 js 中 函數其實是一個物件 該物件中包含 `屬性` `方法` `名稱` 與 `程式碼`

當你通過 `函數名()` 呼叫執行該函數時 它其實是執行該函數物件下的程式碼

並且你可以通過 `函數名.屬性 = 屬性值` 來為函數物件添加屬性

雖然執行`console.log(函數名)`得到的結果只有原來的函數 沒有其他東西

但若執行`console.log(函數名.屬性)`得到的結果就會是你添加的屬性值

你也可以理解為函數只是程式碼的容器 並且它是一個物件 這讓你可以在任何地方使用它

## 函數陳述句與函數表示式

函數陳述句 是指這個函數不會回傳任何東西 而是做其他事 如 `if(...){...}` 就是函數陳述句

函數表示式 是指這個函數會回傳一個值 這個值可以是任何值 如運算子的 `=` 就是函數表示式

函數陳述句可以先調用後聲明 而函數表示式先調用後聲明則會報錯

要注意的是 函數陳述句可以被提升 但表示式不行

參考代碼如下:

```js
greet();

// 這是陳述句 它會被存在記憶體中 所以可以直接調用該函數後再定義
function greet() {
  console.log("hi");
}

// 這是表示式 如果先調用 greetFn() 會報錯 => undefined is not a function
var greetFn = function () {
  console.log("hi");
};

greetFn();
```

最後補充一個觀念: 函數表示式是可以被當成參數傳入另一個函數中的

因為在 js 中函數就是物件 所以當一個變數被指向一個函數表示式 它其實就指向該函數在記憶體中的位置

所以可以通過 `變數名()` 來調用到該函數表示式 其調用的就是該函數在記憶體中的位置

參考代碼如下:

```js
// a = 傳入的 `function () { console.log(123); }`
function log(a) {
  a();
}

log(function () {
  console.log(123);
});
```

## 傳值與傳參考

當兩個變數被指向同一個值 其實是拷貝了記憶體位置的值 所以這兩個變數都是獨立的 這就是傳值

但在物件中 當兩個變數指向同一個物件 其實他們指向的是同一個記憶體的位置 是共享的 而這就是傳參考

代碼如下:

```js
var a = { greet: "hi" };
var b = a; // 指向同一個物件 { greet: "hi" } 的記憶體位置

console.log(a);
console.log(b);
// 結果都是 { greet: "hi" }

// 這個函式改變了傳入物件的屬性值
function changeG(obj) {
  obj.greet = "hola";
}
changeG(a); // 記憶體中的 greet 從 hi 變成 hola

console.log(a);
console.log(b);
// 結果都是 { greet: "hola" }

a = { greet: "hi" };

console.log(a);
console.log(b);
// 由於前面的 { greet: "hi" } 已經變成 { greet: "hola" } 了
// 所以這個 { greet: "hi" } 對 js 來說就是新的物件 js 會產生新的記憶體位置
// 於是 a 跟 b 指向的就不再是同一個物件
// a 變成新的記憶體位置了 指向 { greet: "hi" }
// 所以結果變成 a => { greet: "hi" }, b => { greet: "hola" }
```

## 函數中的 `this` 關鍵字

在普通函數中的 `this` 會指向全域物件 在物件中的函數(又稱方法) 則指向整個物件

但是 在方法中的方法的 `this` 又會指向到全域物件 所以在方法中常常會在第一句看到 `var that = this`

這是讓 `that` 替代 `this` 指向整個物件 接著在方法中的方法用 `that` 就能指向整個物件 而不會指向全域物件

舉例如下:

```js
var a = function () {
  console.log(this);
};
a(); // this 為全域物件的 window
function b() {
  console.log(this);
}
b(); // this 為全域物件的 window
```

```js
var c = {
  name: "object C",
  log: function () {
    this.name = "111";
    console.log(this); // this 為整個物件 c 並且 name 從 object C 變成 111

    var newFn = function () {
      this.name = "222";
      console.log(this); // this 為全域物件的 window 並且全域新增了變數 name 為 222
    };

    newFn();
  },
};

c.log();
```

```js
var c = {
  name: "object C",
  log: function () {
    var that = this; // 用 that 取代 this 後 所有 that 都指向整個物件 c
    that.name = "111";
    console.log(that); // that 為整個物件 c 並且 name 從 object C 變成 111

    var newFn = function () {
      that.name = "222";
      console.log(that); // that 為整個物件 c 並且 name 從 111 變成 222
    };

    newFn();
  },
};

c.log();
```

## 陣列

在 js 中陣列可以是任何東西的集合

要創建一個陣列可以通過 `new Array()` 的方法 也可以直接寫 `[]`

我們也可以通過 `arr[index]` 來獲取陣列中的某個值( index 為下標 是指處於陣列中的位置減 1)

並且陣列中的內容可以是任何值 不需要讓每個值的類型都是一樣的

如:

```js
var arr = [
  1,
  "I am string",
  true,
  { firstname: "Tony", lastname: "doe" },
  function () {
    console.log(arr);
  },
];
arr[3].firstname = "Joe"; // arr[3] 取得陣列中的物件 並將物件的 firstname 修改
arr[4](); // arr[4] 定位到陣列中的函數 並使用 `()` 來調用該函數
```

## js 中的函式過載（Function overloading）

過載(又稱重載)可以理解成 同一個函數名稱 傳入不同個數的參數時執行不同程式碼

如陣列的 splice() 方法 只傳入一個參數時可以刪除 傳入兩個可以刪除一部分 傳入三個可以刪除並新增

在 js 中並沒有的過載 但是我們可以通過判斷函數的參數長度或參數類型來達到同樣的過載效果

這裡首先要提到 當函數需傳入參數時 如果你調用而不傳入參數 其實還是可以執行的 只是參數會自動被設為 `undefined`

並且 在函數中有一個`arguments`物件 它是一個類陣列(像陣列但不是陣列的意思) 對應到函數被調用時所傳入的所有參數

通常被使用的方法為 `arguments.length` 用來判斷傳入的參數數量

這也是在 js 中使用重載的方法 我們可以在函數中通過 `arguments.length` 判斷傳入的參數個數 達到不同個數做不同事件的效果

另外在 `ES6` 中提供了一個展開運算子(spread)為 `...` 它有許多種用法

這裡先說它用在函式的時候 我們可以在參數的地方添加一個 `...others`

假設在函數中原本我們只能傳三個參數 當使用了展開運算子後 我們在執行函數的地方就可以帶入不只三個參數

且多的參數會直接被放到 `others` 這個陣列當中( `...others` 的 `others` 可以是自己取的任意名稱)

代碼如下:

```js
function test(num1, num2, num3, ...others) {
  if (arguments.length === 0) {
    console.log("你沒有傳入任何參數");
  }
  if (arguments.length === 1) {
    console.log(num1);
  }
  if (arguments.length === 2) {
    console.log(num1 * num2);
  }
  if (arguments.length === 3) {
    console.log(num1 + num2 + num3);
  }
  if (arguments.length > 3) {
    console.log(others);
  }
}

test(); // 輸出結果為 你沒有傳入任何參數
test(1); // 輸出結果為 1
test(3, 4); // 輸出結果為 12
test(6, 7, 13); // 輸出結果為 26
test(1, 2, 3, "a", "b", "c"); // 輸出結果為 ["a", "b", "c"]
```

## 分號

在 js 的語法解析器中 它會在看到換行時給出一個符號 並且 js 會自動把這個符號判定為這裡需要加上分號的意思

所以假設我的代碼是想 return 一個物件 然後我在 return 後面換行 那 return 後就會被自動加上一個分號

於是我的代碼執行到 `return;` 就結束了 不會往下看到物件

這是要注意的地方 我們不能任意的換行 也不要讓 js 語法解析時有機會自動幫我們加上分號

所以在撰寫代碼時要留意使用分號與使用換行的時機

## 立即呼叫的函數表示式(IIFE)

當我們創造函數後 都是通過`()` 調用執行函數的

前面提過函數陳述句與函數表示式 而 `IIFE` 是針對函數表示式所使用的

它的意思是 我們可以在創造函數的同時 立即執行該函數

首先 假設我有一個變數 值指向一個函數 正常情況下是這樣的:

```js
var greet = function (name) {
  console.log(name);
};

console.log(greet); // 結果會是整個函數
```

當我想在創建函數時立即執行的話我可以這麼做:

```js
var greet = (function (name) {
  console.log(name);
})("Andy");

console.log(greet); // 結果依然是整個函數

// 現在我們把代碼稍微改一下 把 console.log 改成 return
var greet = (function (name) {
  return name;
})("Andy");

console.log(greet); // 結果為 'Andy' 這是因為它把立即執行的函數所回傳的東西 設為 `greet` 的變數值
```

當我們在創建的函數後方加上一個括號時 該函數就會被立刻執行 執行後的值再傳到變數去

所以我們 `console.log(greet)` 的結果就會是函數執行後傳回的 `name`

這就是 `IIFE` 的一種使用方式

而 `IIFE` 最為常見的用法如下:

本來平常我們可以在任何地方撰寫函數陳述句 但如果我們不想撰寫函數陳述句 想直接寫一個 `IIFE` 的話

當 js 的語法解析器 看到 `function` 開頭的函數時 它會判定這是一個函數陳述句

即 它必須有函數名稱否則報錯 而函數表示式通常是匿名函數 這導致了 js 的報錯訊息會產生

這時候我們可以用一個括號將整個函數表示式包裹起來 括號是一個運算子 並且括號裡面只能放函數表示式

所以當我們這樣做的時候 匿名函數就會被當作函數表示式 並且可以直接撰寫不會報錯了

代碼如下:

```js
// 這是會報錯的寫法
function(name){
  console.log(name)
}

// 這是可以執行的寫法 用括號把整個函數表示式包裹起來
(function (name) {
  console.log(name);
});
```

並且我們一樣可以通過 `IIFE` 來立即執行這個函數表示式

方法如下:

```js
(function (name) {
  console.log(name);
})("Joe");
```

或

```js
(function (name) {
  console.log(name);
})("Joe");
```

一個是把立即執行的括號放在包裹函數的括號外 另一個是把立即執行的括號放在包裹函數的括號內

這兩者都可以達到 `IIFE` 立即執行的效果

只是會建議在撰寫時 僅選擇一種寫法固定使用

這是為了避免自己在看代碼時不懂為何這邊放裡面那邊放外面 兩者有什麼差別之類的困惑

## 閉包

閉包是函數記得並存取外部參考的參數的能力 當函數是在其宣告的參數之外的地方執行時 也能正常運作 並獲取到外部函數的參數

假設我們有一個函數 參數為名字 這個函數的內部返回另一個函數 參數為年齡 並且內部函數會 log 出名字與年齡

請參考以下代碼:

```js
function a(name) {
  return function (age) {
    console.log("I'm " + name + ", " + age + " years old.");
  };
}

// 執行方式1 我們直接在調用 a 函數後繼續調用內部函數
a("Joe")(18);

// 執行方式2 我們定義一個變量 j 來接收 a 函數返回的內部函數
var j = a("Joe");
// 然後調用 j
j(18);
```

上述兩個執行結果都是 `I'm Joe, 18 years old.`

- why?

首先當這些代碼開始執行時會先創建全域執行環境 接著開始調用後 會先創建 a 函數的執行環境

此時 a 函數的參數會被存到記憶體中 接著執行內部函數 內部函數會往 a 函數中找外部參考 所以內部函數可以獲得 a 傳入的參數 並使用它 這就是閉包

這裡舉例一個利用閉包的方法:

假設你想在迴圈中獲取到某個特定值 你可能會像這樣做:

```js
var arr = [];
function getArr() {
  for (var i = 0; i < 3; i++) {
    arr.push(function () {
      console.log(i);
    });
  }
  return arr;
}
getArr();
arr[0](); // 3
arr[1](); // 3
arr[2](); // 3
```

輸出結果都是 3

- why?

因為函數會在被調用後才開始找參數

而此時 for 迴圈執行完畢了

所以 i 就都是 3

輸出結果就不會是你預想中的 0 1 2 了

正確符合預期的執行方式應該這樣:

```js
var arr = [];
function getArr() {
  for (var i = 0; i < 3; i++) {
    arr.push(
      (function (num) {
        return function () {
          console.log(num);
        };
      })(i)
    );
  }
  return arr;
}
getArr();
arr[0]();
arr[1]();
arr[2]();
```

這裡我們使用前面所學的 IIFE 立即執行函數 讓函數的參數被保存下來

所以在 push 時 函數執行了 把 i 傳到內部的 num 然後我們返回整個內部函數

這之後當你調用 `arr[index]()` 就可以獲得個別的 i 值 因為在內部函數中 i 被傳到 num 去了

而閉包會幫我們把 num 保存下來 所以 num 分別為 0 1 2

## 使用閉包特性創建一個函數工廠

舉例來說 我們先創建一個叫工廠的函數(factory) 參數為物品(thing)

然後我們在函數中判斷傳入的物品是車(car)還是手機(phone)

是車的話返回一個內部函數 參數為名字(name) 用來 log 車名

是手機則返回一個內部函數 參數為號碼(number) 用來 log 號碼

接著我們跳出工廠函數的內部 回到全域中 定義變量為新的函數名稱

以例子而言我定義一個變量為獲取車名(getCarName) 另一個為獲取號碼(getNumber)

最後我就可以直接通過 `getCarName(name)` 來取代 `factory('car')(name)`

或是通過 `getNumber(number)` 來取代 `factory('phone')(number)`

代碼如下:

```js
function factory(thing) {
  if (thing === "car") {
    return function (name) {
      console.log(name + " 的車");
    };
  }
  if (thing === "phone") {
    return function (number) {
      console.log("號碼：" + number);
    };
  }
}

var getCarName = factory("car");
var getNumber = factory("phone");

getCarName("toyota");
getNumber("0912-123-123");
```

以上就是利用閉包設定預設的參數 並且創造變數接收 並用該變數來調用執行特定方法

## 回呼(callback)

回呼的意思是 一個函數中傳入另一個函數 並在該函數執行完畢後呼叫傳入的函數

在 js 中最常見的使用回呼的函數為 setTimeout

它接收兩個參數 第一個是函數(callback) 第二個是時間(毫秒)

另外如 jQuery 的點擊事件 也是回呼 同樣是一個函數中接收了另一個作為參數的函數

當函數執行完內部的程式碼後 就呼叫傳入的函數

如下:

```js
// setTimeout 加閉包, 在 setTimeout 中 num 就是通過閉包獲取的
function tryLater() {
  var num = 2;
  setTimeout(function () {
    console.log(num);
  }, 2000);
}

tryLater();

// callback 例子, 傳入的函數會在定義好 num 後執行 console.log("All done!");
function testcb(callback) {
  var num = 2;

  callback();
}

testcb(function () {
  console.log("All done!");
});
```

## bind() , call() , apply()

這是函數中設定 `this` 關鍵字的幾種方法 任何函數都可以使用

- `bind()` : 它會拷貝函數 並將傳入的參數作為拷貝函數中的 `this`

參考代碼如下:

```js
var person = {
  firstname: "Joe",
  lastname: "Doe",
  getName: function () {
    return this.firstname + " " + this.lastname;
  },
};

var logName = function (a, b) {
  console.log(this.getName());
};

// 這個會報錯 this.getName is not a function 因為 this 指向全域 全域中沒有這個方法
logName();

// 用 bind() 方法把 logName 拷貝 並且將 this 指向傳入的 person 最後把整個函數指向 bindLogName
var bindLogName = logName.bind(person);

bindLogName(); // 這個就能正確執行 person.getName()
```

- `call()` : 它會執行函數 並將傳入的第一個參數作為函數中的 `this`

  - 如果函數有參數 則傳在第一個參數後面 因為 call 的第一個參數永遠會指向 `this`

參考代碼如下:

```js
var person = {
  firstname: "Joe",
  lastname: "Doe",
  getName: function () {
    return this.firstname + " " + this.lastname;
  },
};

var logName = function (a, b) {
  console.log(this.getName());
  console.log(a));
  console.log(b);
};

logName.call(person,'I am A','I am B'); // 第一個參數指向 this 其他依序對應函數中的參數
```

- `apply()` : 跟 `call()` 類似 唯一差別在傳入的參數須為陣列

參考如下:

```js
var person = {
  firstname: "Joe",
  lastname: "Doe",
  getName: function () {
    return this.firstname + " " + this.lastname;
  },
};

var logName = function (a, b) {
  console.log(this.getName());
  console.log(a));
  console.log(b);
};

logName.call(person,['I am A','I am B']); // 把所有參數改為一個陣列傳入 即可
```

## 函數借用

我們可以通過 `call()` 或 `apply()` 來借用別人的函數

這裡是在通過 `call()` 或 `apply()` 調用某個函數 並傳入其他 `this` 指向 從而達到借用函數的效果

方法如下:

```js
var person1 = {
  firstname: "Joe",
  lastname: "Doe",
  getName: function () {
    return this.firstname + " " + this.lastname;
  },
};

var person2 = {
  firstname: "Andy",
  lastname: "Wu",
};

console.log(person1.getName.call(person2)); // Andy Wu
console.log(person1.getName.apply(person2)); // Andy Wu
```

## currying function

我們可以通過 `bind()` 來 柯理化函數

這裡是在通過 `bind()` 來預設參數 並拷貝為一個新函數

所以調用新函數時 就等於調用原本的函數但參數已被設定

並且當你已經通過 `bind()` 設定參數後 當你調用時無論傳入什麼都不會影響到 `bind()` 設定的參數

如下:

```js
function x(num1, num2) {
  return num1 * num2;
}

var x8 = x.bind(this, 8);

console.log(x8(4)); // 32

var x3and6 = x.bind(this, 3, 6);
console.log(x3and6()); // 18
```

## 函數程式設計

這是用前面所學的技巧做出簡潔有力的程式設計 可參考 `lodash.js` 或 `underscore.js`

舉例來說 我們以某數組為基準 傳入不同函數以創建新的數組 並且通過前面所學 來將代碼做更簡潔的使用

如下:

```js
var arr1 = [1, 2, 3]; // 基準數組

// 創建新數組的函數方法
function mapArr(arr, fn) {
  var newArr = [];
  for (var i = 0; i < arr.length; i++) {
    newArr.push(fn(arr[i]));
  }
  return newArr;
}

// 創建一個以 arr1 為基準的數組 且新數組中每個成員都乘以 20
var arr2 = mapArr(arr1, function (item) {
  return item * 20;
});
console.log(arr2);

// 創建一個以 arr2 為基準的數組 且新數組中每個成員都除以 10
var arr3 = mapArr(arr2, function (item) {
  return item / 10;
});
console.log(arr3);

// 創建一個函數 判斷數組中的成員是否大於傳入的數字
var checkNum = function (num, item) {
  return item > num;
};

// 因為 mapArr() 函數只能傳入一個參數 所以這裡將剛才的判斷大於函數通過 `bind()` 改寫
var checkNum2 = function (num) {
  return checkNum.bind(this, num);
};

// 這裡就可以調用改寫後的判斷大於函數了
var arr4 = mapArr(arr1, checkNum2(1));
console.log(arr4);
```

上述例子在 `lodash.js` 與 `underscore.js` 中 方法為 `map()`

## 原型

這裡指的是物件原型繼承 每個物件之間有原型鏈 類似於範圍鏈

範圍鏈是針對變數的 而原型鏈則是針對屬性與方法

js 中的每個物件都會有一個 `__proto__` 原型物件

每個物件都可以使用原型物件中的方法 並卻不需要通過 `XXX.__proto__.xxx` 來取用

而是在該物件找不到該方法時會自動往原型身上找

可以參考下列範例:

```js
// 首先創建一個 obj
var obj = {
  firstname: "default",
  lastname: "default",
  getName: function () {
    console.log(this.firstname + " " + this.lastname);
  },
};

var john = {
  firstname: "john",
  lastname: "doe",
};

// 然後我們手動把物件的原型設為 obj
john.__proto__ = obj;

var joe = {
  firstname: "joe",
};

// 接著設該物件的原型為 john
joe.__proto__ = john;

// 當這個物件沒有 getName() 方法 就會找它的原型物件 john 有沒有 getName() 方法
// 然後發現 john 也沒有就往 john 的原型物件 obj 身上找 找到即可調用
joe.getName();
```

以上是通過例子解釋原型的查找規律 在現實中不推薦強制設定 `__proto__`

因為 js 本身就有屬於物件的 `__proto__` 原型物件

其他諸如數組也有數組自己的原型鏈可以使用

## JS 的 Reflection and Extend

`reflection` 是指我們可以遍歷一個物件中的所有屬性與屬性值

如下:

```js
var obj = {
  name: "Joe",
  age: 18,
  getPerson: function () {
    console.log(this.name + ", " + this.age);
  },
};

var obj2 = {
  mail: "123@mail.com",
};

obj2.__proto__ = obj;

for (var prop in obj2) {
  // 判斷屬性是不是 obj2 自己的 而非原型鏈的 如果是才顯示
  if (obj2.hasOwnProperty(prop)) {
    console.log(prop + ":" + obj2[prop]);
  }
}
```

`extend` 是指繼承 我們可以通過 `Reflection` 的特性來達到繼承的效果

首先生成幾個物件 然後我們手寫一個 extend 函數 來將各個物件合併為一個物件

代碼如下:

```js
var person = {
  fristname: "Joe",
  age: 18,
};

var obj2 = {
  lastname: "doe",
};

var fnObj = {
  getPerson: function () {
    console.log(this.fristname + ", " + this.age);
  },
};

var extend = function (obj) {
  var keys = [];
  var values = [];
  var l = arguments.length;
  // 判斷傳入幾個參數 如果只有一個則返回該對象
  if (l === 1) {
    return obj;
  }
  // 超過一個就遍歷參數
  for (var i = 1; i < l; i++) {
    var source = arguments[i];
    // 這裡即是用 reflection 特性來獲取每個 key(屬性)與 value(屬性值)
    for (var prop in source) {
      if (source.hasOwnProperty(prop)) {
        keys.push(prop);
        values.push(source[prop]);
      }
    }
    // 接下來遍歷屬性 將屬性與屬性值一一添加到 obj 中
    for (var j = 0; j < keys.length; j++) {
      var key = keys[j];
      var val = values[j];
      obj[key] = val;
    }
  }
  // 最後返回合併後的物件
  return obj;
};
extend(person, obj2, fnObj);
console.log(person);
```

## 函數建構子 創建物件

前面提過創建物件的方法有很多 這裡的函數建構子就是其中一種

它使用的是 `new` 運算子

首先創建一個函數 然後通過關鍵字 `new` 空格 函數名稱 即可創建一個新物件

如下:

```js
function person() {
  this.name = "Joe";
  this.age = 18;
}
var obj = new person();
console.log(obj); // person{ name: "Joe", age: 18}

function person2(name) {
  this.name = name;
  this.age = 18;
}
var obj2 = new person2("Andy");
console.log(obj2); // person{ name: "Andy", age: 18}
```

當使用 `new` 運算子 它會把函數中的 `this` 指向 new 創建出來的空物件

如果函數中沒有任何操作 `this` 的代碼 則輸出的新對象就會是一個空物件

如果函數如上述例子的 `person` 則輸出新對象的屬性與屬性值就會對應到函數中的 `this.xxx = xxx`

如果函數如上述例子的 `person2` 則輸出新對象的屬性與屬性值就會對應到函數中的 `this.xxx = 傳入的參數`

另外 函數建構子創造出來的物件沒有 `__proto__` 而是使用函數中的 `prototype` 取而代之

可以通過 `person.prototype.xxx = ...` 來往原型中添加屬性或方法

- 補充: 為了避免在使用函數建構子時忘記添加 `new` , 建議將所有函數建構子的名稱首字母統一大寫

## Object.create 創建物件

創建物件的方法還有這個 `Object.create` 它是通過原型繼承的方式創造物件的

一樣是先設定一個物件 A 然後通過 `var objName = Object.create(A)` 的方式以 A 為原型創建一個物件 `objName`

並且當你使用 `objName.屬性名 = 屬性值` 如果原型身上有同樣的屬性 就會被 objName 的屬性值覆蓋

參考代碼:

```js
// 建立原型物件
var Person = {
  firstName: "Default",
  lastName: "Default",
  getFullName: function () {
    return this.firstName + " " + this.lastName;
  },
};

var john = Object.create(Person); // 以 Person 為基底創建新物件 john

john.firstName = "John"; // Default 被 John 覆蓋
john.lastName = "Doe"; // Default 被 Doe 覆蓋
console.log(john.getFullName()); // 找到原型的方法並取用
```

## class 創建物件

class 是模仿 Java 等程式語言生成的 但與其他程式語言中的類別稍有不同

class 在 js 中也是用來定義原型物件的方式 並且它是 ES6 才出現的

使用方法如下:

```js
// class 不會生成物件 使用 new 後才會生成物件
class Person {
  // constructor 是 class 中的函數建構子
  constructor(fristname, lastname) {
    this.fristname = fristname;
    this.lastname = lastname;
  }
}

var john = new Person("John", "Doe");
```

## `typeof` 與 `instanceof`

`typeof` 是用來判斷類型的 使用方式為 `typeof＋空格＋要判斷的東西`

它會返回一個字符串 有以下結果:

```js
var a = 123;
console.log(typeof a); // number
var b = "hi";
console.log(typeof b); // string
var c = { name: "ccc" };
console.log(typeof c); // object
var d = function () {
  console.log("ddd");
};
console.log(typeof d); // function
var e = [1, 2, 3];
console.log(typeof e); // object
var f = undefined;
console.log(typeof f); // undefined
var g = null;
console.log(typeof g); // object
var h = true;
console.log(typeof h); // boolean
```

- `typeof null` 為 `object` 是 js 的一個 bug 但已被長期使用 所以 js 沒有修正它

`instanceof` 是用來檢查某個值是否為某 class 的實例物件或建構函式 使用方式為 `obj instanceof obj`

它會返回布爾值 如下:

```js
class Person {
  constructor(fristname, lastname) {
    this.fristname = fristname;
    this.lastname = lastname;
  }
}

var john = new Person("John", "Doe");
console.log(john instanceof Person); // true
```

最後補充一個物件的 `toString()` 方法 用來獲取呼叫者的正確類型 它回傳的值為 `[object xxx]`

使用方法為 `Object.prototype.toString.call()`

如下:

```js
console.log(Object.prototype.toString.call("hi")); // [object String]
console.log(Object.prototype.toString.call(1)); // [object Number]
console.log(Object.prototype.toString.call(true)); // [object Boolean]
console.log(Object.prototype.toString.call([])); // [object Array]
console.log(Object.prototype.toString.call({})); //[object Symbol]
console.log(Object.prototype.toString.call(function () {})); // [object Function]
console.log(Object.prototype.toString.call(new Date())); // [object Date]
console.log(Object.prototype.toString.call(undefined)); // [object Undefined]
console.log(Object.prototype.toString.call(null)); // [object Null]
```
