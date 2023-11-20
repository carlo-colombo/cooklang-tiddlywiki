/*jslint node: true, browser: true */
/*global $tw: false */

const { Recipe } = require("./lib/cooklang");

const formatIngredient = ({ name, quantity, units }) =>
  `''${name}` +
  (quantity ? ` (${quantity}${units ? " " + units : ""})` : "") +
  `''`;
const formatTimer = formatIngredient;

const stepMap = {
  text: ({ value }) => value,
  ingredient: formatIngredient,
  timer: formatTimer,
  cookware: ({ name }) => `''${name}''`,
};

class CooklangParser {
  constructor(type, text, options) {
    const recipe = new Recipe(text);

    const ingredients = recipe.ingredients
      .map(({ name, quantity, units }) => `* ${quantity} ${units} ${name}`)
      .join("\n");

      const cookwares = recipe.cookwares
        .map(({ name, quantity, units }) => `* ${name}`)
        .join("\n");

    const metadata = Object.entries(recipe.metadata)
      .map(([k, v]) => `| ${k}|${v} |`)
      .join("\n");

    const steps = recipe.steps
      .map(
        (step) => "* " + step.map((step) => stepMap[step.type](step)).join(""),
      )
      .join("\n");

      const wikiText = [
          metadata,
          "!! Ingredients", ingredients,
          "!! Cookwares", cookwares,
          "!! Instructions", steps
      ].join(`\n\n`);

    this.tree = $tw.wiki.parseText("text/vnd.tiddlywiki", wikiText).tree;
  }
}

exports["text/x-cooklang"] = CooklangParser;
