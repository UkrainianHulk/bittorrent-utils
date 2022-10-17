import { env, cwd } from 'process'
import path from 'path'

const { NODE_ENV } = env

async function importConfig(name) {
    const configPath = path.resolve(cwd(), 'config', name)
    return import(`file://${configPath}.js`)
}

function merge(target, source) {
    for (const key of Object.keys(source))
        if (source[key] instanceof Object)
            Object.assign(source[key], merge(target[key], source[key]))
    Object.assign(target || {}, source)
    return target
}

const { default: defaultConfig } = await importConfig('default')
const { default: environmentConfig } = await importConfig(NODE_ENV)
const config = merge(defaultConfig, environmentConfig)

export default config
