import fetch from 'node-fetch'

export async function getPublicIp() {
    const res = await fetch('https://api.ipify.org?format=json')
    const { ip } = await res.json()
    return ip
}
