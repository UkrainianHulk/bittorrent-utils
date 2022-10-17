import fetch from 'node-fetch'

export async function getBttPrice() {
    const res = await fetch(
        'https://api.binance.com/api/v3/ticker/price?symbol=BTTCUSDT'
    )
    const { price } = await res.json()
    return parseFloat(price)
}
