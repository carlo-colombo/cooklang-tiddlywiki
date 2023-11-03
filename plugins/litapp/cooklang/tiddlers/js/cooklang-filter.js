const { Recipe } = require("./lib/cooklang");

exports.cooklangjson = (source, operator, options) => {
  const result = [];
  source((tiddler, title) => {
    result.push(JSON.stringify(new Recipe(tiddler.fields.text)));
  });
  return result;
};

exports.cooklang = (source, operator, options) => (callback) =>
  source((tiddler, title) => {
    const recipe = new Recipe(tiddler.fields.text);
    callback(
      new $tw.Tiddler({
        ...recipe.metadata,
        title,
        text: JSON.stringify(recipe),
        type: "application/json",
        list: recipe.ingredients.map(({ name }) => name),
        ingredients: recipe.ingredients.map(({ name }) => name),
      }),
      title,
    );
  });
