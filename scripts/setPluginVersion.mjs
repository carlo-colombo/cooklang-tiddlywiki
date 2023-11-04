import fs from 'fs'

const path = './plugins/litapp/cooklang/plugin.info'

const pluginInfo = JSON.parse(fs.readFileSync(path))

console.log(process.argv)

if (process.argv[2]==""){
    process.exit(1)
}

pluginInfo.version = process.argv[2]

fs.writeFileSync(path, JSON.stringify(pluginInfo, ' ', 4))
