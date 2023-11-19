# Tiddlywiki Cooklang plugin

Cooklang support for Tiddlywiki, render cooklang markup language tiddlers and use
cooklang filters to extract and manipolate information from the recipes.

* Renders cooklang tiddlers (`text/x-cooklang`), showing ingredients and metadata as tables.
* Filters to parse cooklang tiddlers
  * `cooklang` convert into tiddlers with metadata and ingredients as fields, JSON of the recipe as text.
  * `cooklangjson` parse cooklang recipes to JSON.

## Installation

Go to the demo and follow the instructions there https://carlo-colombo.github.io/cooklang-tiddlywiki/

## Development

Install all dependencies with `npm install`.

Start the server and watch for changes with `npm run dev`. Manual reload in the browser is necessary.

Build the plugin demo edition with `npm run build`, the output will be found in `editions/demo/output/index.html`.
