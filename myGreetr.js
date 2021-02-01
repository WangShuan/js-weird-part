// 利用 js 參考 jquery 做一個打招呼的小框架
(function (g, $) {
  // 設定 Greetr 為 new 一個新物件
  var Greetr = function (fristname, lastname, lang) {
    return new Greetr.init(fristname, lastname, lang);
  };

  // 設定可用語言種類
  var langs = ["en", "cn", "es"];

  // 設定語言的招呼語
  var msg = { en: "Hi", cn: "你好", es: "Hola" };
  // 設定語言的正式招呼語
  var formalmsg = { en: "hello", cn: "您好！", es: "Saludos" };

  // 做 Greetr 的原型
  Greetr.prototype = {
    // 方法1 獲取全名
    fullname: function () {
      return this.fristname + " " + this.lastname;
    },

    // 方法2 普通式打招呼
    greet: function () {
      this.checkLang();
      console.log(msg[this.lang] + " " + this.fristname + "!");
      return this;
    },

    // 方法3 正式打招呼
    formalGreet: function () {
      this.checkLang();
      console.log(formalmsg[this.lang] + " " + this.fullname() + "!");
      return this;
    },

    // 方法4 檢查語言是否為可用 不可用就拋出錯誤訊息
    checkLang: function () {
      if (langs.indexOf(this.lang) === -1) {
        throw "can not use this lang";
      }
    },

    // 方法5 設定語言
    setLang: function (lang) {
      this.lang = lang;
      this.checkLang();
      return this;
    },

    // 方法6 結合 jquery 使用
    HTMLGreeting: function (el, isFormal) {
      if (!$) {
        throw "jquery is not find.";
      }
      if (!el) {
        throw "element is not find.";
      }
      if (isFormal == true) {
        var text = formalmsg[this.lang] + " " + this.fullname() + "!";
        $(el).html(text);
      } else {
        var text = msg[this.lang] + " " + this.fristname + "!";
        $(el).html(text);
      }
    },
  };

  // 使用 Greetr 時 要 new 的函數建構子
  Greetr.init = function (fristname, lastname, lang) {
    var that = this;
    that.fristname = fristname || "dear";
    that.lastname = lastname || "";
    that.lang = lang || "en";
    that.checkLang();
  };

  // 設定 Greetr 跟 Greetr.init 的原型為同一個
  Greetr.init.prototype = Greetr.prototype;

  // 在全局中添加 Greetr 為 Greetr 或 _G
  g.Greetr = g._G = Greetr;
})(window, jQuery);
