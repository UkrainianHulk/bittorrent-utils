export const getBttPrice = async (): Promise<number> => {
  const res = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTTCUSDT')
  const { price } = await res.json()
  return parseFloat(price)
}
