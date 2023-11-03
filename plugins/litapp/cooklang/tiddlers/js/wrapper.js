/*jslint node: true, browser: true */
/*global $tw: false */

const { Recipe } = require('./parser');

exports["text/cooklang"] = function (type, text, options) {
  const recipe = new Recipe(text)

  console.log(recipe)

  const f = ({ name, quantity, units }) => ({
    type: "element", tag: "b", children: [
      { type: "text", text: name },
      { type: "text", text: quantity ? ` (${quantity}${units ? ' ' + units : ''})` : '' },
    ]
  })

  const steps = recipe.steps.map(step => {
    return {
      type: "element", tag: "li", children: step.map(e => {
        return {
          text: { type: "text", text: e.value },
          ingredient: f(e),
          cookware: {
            type: "element", tag: "b", children: [
              { type: "text", text: e.name }
            ]
          },
          timer: f(e)
        }[e.type]
      })
    }
  })

  this.tree = [{
    type: "element", tag: "table", children: recipe.ingredients.map(({ name, quantity, units }) => {
      return {
        type: "element", tag: "tr", children: [
          { type: "element", tag: "td", attributes: { align: "right" }, children: [{ type: "text", text: "" + quantity }] },
          { type: "element", tag: "td", children: [{ type: "text", text: units || '' }] },
          { type: "element", tag: "td", children: [{ type: "text", text: name }] },
        ]
      }
    })
  }, {
    type: "element", children: steps, tag: "ol"
  }]

  console.log(this.tree)
}