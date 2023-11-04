import fs from 'fs'

const path = './plugins/litapp/cooklang/plugin.info'

const pluginInfo = JSON.parse(fs.readFileSync(path))

pluginInfo.version = process.argv[2]

fs.writeFileSync(path, JSON.stringify(pluginInfo, ' ', 4))
