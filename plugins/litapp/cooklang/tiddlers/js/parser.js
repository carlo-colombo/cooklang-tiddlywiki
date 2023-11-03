var __commonJS = (callback, module2) => () => {
  if (!module2) {
    module2 = {exports: {}};
    callback(module2.exports, module2);
  }
  return module2.exports;
};

// node_modules/@cooklang/cooklang-ts/dist/tokens.js
var require_tokens = __commonJS((exports2) => {
  "use strict";
  Object.defineProperty(exports2, "__esModule", {value: true});
  exports2.tokens = exports2.shoppingList = exports2.blockComment = exports2.comment = void 0;
  var metadata = /^>>\s*(?<key>.+?):\s*(?<value>.+)/;
  var multiwordIngredient = /@(?<mIngredientName>[^@#~[]+?){(?<mIngredientQuantity>[^]*?)(?:%(?<mIngredientUnits>[^}]+?))?}/;
  var singleWordIngredient = /@(?<sIngredientName>[^\s]+)/;
  var multiwordCookware = /#(?<mCookwareName>[^@#~[]+?){(?<mCookwareQuantity>.*?)}/;
  var singleWordCookware = /#(?<sCookwareName>[^\s]+)/;
  var timer = /~(?<timerName>.*?)(?:{(?<timerQuantity>.*?)(?:%(?<timerUnits>.+?))?})/;
  exports2.comment = /--.*/g;
  exports2.blockComment = /\s*\[\-.*?\-\]\s*/g;
  exports2.shoppingList = /\[(?<name>.+)\]\n(?<items>[^]*?)(?:\n\n|$)/g;
  exports2.tokens = new RegExp([metadata, multiwordIngredient, singleWordIngredient, multiwordCookware, singleWordCookware, timer].map((r) => r.source).join("|"), "g");
});

// node_modules/@cooklang/cooklang-ts/dist/Parser.js
var require_Parser = __commonJS((exports2) => {
  "use strict";
  Object.defineProperty(exports2, "__esModule", {value: true});
  var tokens_1 = require_tokens();
  var Parser = class {
    constructor(options) {
      this.defaultUnits = "";
      this.defaultCookwareAmount = options?.defaultCookwareAmount ?? 1;
      this.defaultIngredientAmount = options?.defaultIngredientAmount ?? "some";
      this.includeStepNumber = options?.includeStepNumber ?? false;
    }
    parse(source) {
      const ingredients = [];
      const cookwares = [];
      const metadata = {};
      const steps = [];
      const shoppingList = {};
      source = source.replace(tokens_1.comment, "").replace(tokens_1.blockComment, " ");
      for (let match of source.matchAll(tokens_1.shoppingList)) {
        const groups = match.groups;
        if (!groups)
          continue;
        shoppingList[groups.name] = parseShoppingListCategory(groups.items || "");
        source = source.substring(0, match.index || 0);
        +source.substring((match.index || 0) + match[0].length);
      }
      const lines = source.split(/\r?\n/).filter((l) => l.trim().length > 0);
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const step = [];
        let pos = 0;
        for (let match of line.matchAll(tokens_1.tokens)) {
          const groups = match.groups;
          if (!groups)
            continue;
          if (pos < (match.index || 0)) {
            step.push({
              type: "text",
              value: line.substring(pos, match.index)
            });
          }
          if (groups.key && groups.value) {
            metadata[groups.key.trim()] = groups.value.trim();
          }
          if (groups.sIngredientName) {
            const ingredient = {
              type: "ingredient",
              name: groups.sIngredientName,
              quantity: this.defaultIngredientAmount,
              units: this.defaultUnits
            };
            if (this.includeStepNumber)
              ingredient.step = i;
            ingredients.push(ingredient);
            step.push(ingredient);
          }
          if (groups.mIngredientName) {
            const ingredient = {
              type: "ingredient",
              name: groups.mIngredientName,
              quantity: parseQuantity(groups.mIngredientQuantity) ?? this.defaultIngredientAmount,
              units: parseUnits(groups.mIngredientUnits) ?? this.defaultUnits
            };
            if (this.includeStepNumber)
              ingredient.step = i;
            ingredients.push(ingredient);
            step.push(ingredient);
          }
          if (groups.sCookwareName) {
            const cookware = {
              type: "cookware",
              name: groups.sCookwareName,
              quantity: this.defaultCookwareAmount
            };
            if (this.includeStepNumber)
              cookware.step = i;
            cookwares.push(cookware);
            step.push(cookware);
          }
          if (groups.mCookwareName) {
            const cookware = {
              type: "cookware",
              name: groups.mCookwareName,
              quantity: parseQuantity(groups.mCookwareQuantity) ?? this.defaultCookwareAmount
            };
            if (this.includeStepNumber)
              cookware.step = i;
            cookwares.push(cookware);
            step.push(cookware);
          }
          if (groups.timerQuantity) {
            step.push({
              type: "timer",
              name: groups.timerName,
              quantity: parseQuantity(groups.timerQuantity) ?? 0,
              units: parseUnits(groups.timerUnits) ?? this.defaultUnits
            });
          }
          pos = (match.index || 0) + match[0].length;
        }
        if (pos < line.length) {
          step.push({
            type: "text",
            value: line.substring(pos)
          });
        }
        if (step.length > 0)
          steps.push(step);
      }
      return {ingredients, cookwares, metadata, steps, shoppingList};
    }
  };
  exports2.default = Parser;
  function parseQuantity(quantity) {
    if (!quantity || quantity.trim() === "") {
      return void 0;
    }
    quantity = quantity.trim();
    const [left, right] = quantity.split("/");
    const [numLeft, numRight] = [Number(left), Number(right)];
    if (right && isNaN(numRight))
      return quantity;
    if (!isNaN(numLeft) && !numRight)
      return numLeft;
    else if (!isNaN(numLeft) && !isNaN(numRight) && !(left.startsWith("0") || right.startsWith("0")))
      return numLeft / numRight;
    return quantity.trim();
  }
  function parseUnits(units) {
    if (!units || units.trim() === "") {
      return void 0;
    }
    return units.trim();
  }
  function parseShoppingListCategory(items) {
    const list = [];
    for (let item of items.split("\n")) {
      item = item.trim();
      if (item == "")
        continue;
      const [name, synonym] = item.split("|");
      list.push({
        name: name.trim(),
        synonym: synonym?.trim() || ""
      });
    }
    return list;
  }
});

// node_modules/@cooklang/cooklang-ts/dist/Recipe.js
var require_Recipe = __commonJS((exports2) => {
  "use strict";
  var __importDefault = exports2 && exports2.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {default: mod};
  };
  Object.defineProperty(exports2, "__esModule", {value: true});
  var Parser_1 = __importDefault(require_Parser());
  var Recipe = class {
    constructor(source, options) {
      this.ingredients = [];
      this.cookwares = [];
      this.metadata = {};
      this.steps = [];
      this.shoppingList = {};
      this.parser = new Parser_1.default(options);
      if (source)
        Object.assign(this, this.parser.parse(source));
    }
    toCooklang() {
      let metadataStr = "";
      let stepStrs = [];
      let shoppingListStrs = [];
      for (let [key, value] of Object.entries(this.metadata)) {
        metadataStr += `>> ${key}: ${value}
`;
      }
      for (let step of this.steps) {
        let stepStr = "";
        for (let item of step) {
          if ("value" in item) {
            stepStr += item.value;
          } else {
            if (item.type == "ingredient")
              stepStr += "@";
            else if (item.type == "cookware")
              stepStr += "#";
            else
              stepStr += "~";
            stepStr += item.name;
            stepStr += "{";
            if (item.quantity)
              stepStr += item.quantity;
            if ("units" in item && item.units)
              stepStr += "%" + item.units;
            stepStr += "}";
          }
        }
        stepStrs.push(stepStr);
      }
      for (let [category, items] of Object.entries(this.shoppingList)) {
        let shoppingListStr = "";
        shoppingListStr += category + "\n";
        shoppingListStr += items.map((x) => x.name + (x.synonym ? "|" + x.synonym : "")).join("\n");
        shoppingListStrs.push(shoppingListStr);
      }
      return [metadataStr, stepStrs.join("\n\n"), shoppingListStrs.join("\n\n")].join("\n");
    }
  };
  exports2.default = Recipe;
});

// node_modules/@cooklang/cooklang-ts/dist/cooklang.js
var require_cooklang = __commonJS((exports2) => {
  "use strict";
  Object.defineProperty(exports2, "__esModule", {value: true});
});

// node_modules/@cooklang/cooklang-ts/dist/index.js
var require_dist = __commonJS((exports2) => {
  "use strict";
  var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === void 0)
      k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = {enumerable: true, get: function() {
        return m[k];
      }};
    }
    Object.defineProperty(o, k2, desc);
  } : function(o, m, k, k2) {
    if (k2 === void 0)
      k2 = k;
    o[k2] = m[k];
  });
  var __exportStar = exports2 && exports2.__exportStar || function(m, exports3) {
    for (var p in m)
      if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports3, p))
        __createBinding(exports3, m, p);
  };
  var __importDefault = exports2 && exports2.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {default: mod};
  };
  Object.defineProperty(exports2, "__esModule", {value: true});
  exports2.Parser = exports2.Recipe = exports2.getImageURL = void 0;
  function getImageURL(name, options) {
    options ?? (options = {});
    return name + (options.step ? "." + options.step : "") + "." + (options.extension || "png");
  }
  exports2.getImageURL = getImageURL;
  var Recipe_1 = __importDefault(require_Recipe());
  exports2.Recipe = Recipe_1.default;
  var Parser_1 = __importDefault(require_Parser());
  exports2.Parser = Parser_1.default;
  __exportStar(require_Recipe(), exports2);
  __exportStar(require_Parser(), exports2);
  __exportStar(require_cooklang(), exports2);
});

// src/parser.js
module.exports = require_dist();
