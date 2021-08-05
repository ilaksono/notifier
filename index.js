'use strict';
require('dotenv').config();
const app = require('express')();
const fetch = require('node-fetch');


// const cryptoSymbols = [
//   'BTC/USDT',
//   'ETH/USDT',
//   'BNB/USDT',
//   'ADA/USDT',
//   'XRP/USDT',
//   'USDC/USDT',
//   'DOGE/USDT',
//   'DOT/USDT',
//   'BUSD/USDT',
//   'UNI/USDT',
//   'BCH/USDT',
//   'LTC/USDT',
//   'LINK/USDT',
//   'WBTC/USDT',
//   'SOL/USDT',
//   'MATIC/USDT',
//   'ETC/USDT',
//   'XLM/USDT',
//   'THETA/USDT',
//   'DAI/USDT',
//   'ICP/USDT',
//   'VET/USDT',
//   'LUNA/USDT',
//   'FIL/USDT',
//   'TRX/USDT',
//   'XMR/USDT',
//   'AAVE/USDT',
//   'EOS/USDT',
//   'AMP/USDT',
//   'CRO/USDT',
//   'FTT/USDT',
//   'CAKE/USDT',
//   'LEO/USDT',
//   'BTCB/USDT',
//   'AXS/USDT',
//   "GRT/USDT",
//   "ALGO/USDT",
//   "MKR/USDT",
//   "BSV/USDT",
//   "KLAY/USDT",
//   "ATOM/USDT",
//   "SHIB/USDT",
//   "NEO/USDT",
//   "XTZ/USDT",
//   "MIOTA/USDT",
//   "AVAX/USDT",
//   "COMP/USDT",
//   "UST/USDT",
//   "BTT/USDT",
//   "HT/USDT",
//   "HBAR/USDT",
//   "DCR/USDT",
//   "TFUEL/USDT",
//   "EGLD/USDT",
//   "WAVES/USDT",
//   "KSM/USDT",
//   "DASH/USDT",
//   "CHZ/USDT",
//   "XEM/USDT",
//   "CEL/USDT",
//   "QNT/USDT",
//   "STX/USDT",
//   "ZEC/USDT",
//   "TUSD/USDT",
//   "RUNE/USDT",
//   "HNT/USDT",
//   "MANA/USDT",
//   "ENJ/USDT",
//   "YFI/USDT",
//   "OKB/USDT",
//   "HOT/USDT",
//   "SNX/USDT",
//   "SUSHI/USDT",
//   "TEL/USDT",
//   "NEXO/USDT",
//   "XDC/USDT",
//   "PAX/USDT",
//   "NEAR/USDT",
//   "FLOW/USDT",
//   "ZIL/USDT",
//   "BAT/USDT",
//   "BTG/USDT",
//   "BNT/USDT",
//   "KCS/USDT",
//   "ONE/USDT",
//   "CHSB/USDT",
//   "CELO/USDT",
//   "MDX/USDT",
//   "QTUM/USDT",
//   "ZEN/USDT",
//   "DGB/USDT",
//   "ONT/USDT",
//   "SC/USDT",
//   "ZRX/USDT",
//   "FTM/USDT",
//   "CRV/USDT",
//   "HUSD/USDT",
//   "ICX/USDT",
//   "ANKR/USDT",
//   "RVN/USDT",
//   "REV/USDT",
//   "OMG/USDT",
//   "NANO/USDT",
//   "UMA/USDT",
//   "RENBTC/USDT"
// ]
const cryptoSymbols = ['BTC/USDT', 'ETH/USDT', 'XRP/USDT',
  'LTC/USDT', 'XMR/USDT'];

let index = 0;

const incrementIndex = () => {
  if (++index >= cryptoSymbols.length)
    index = 0;
  return;
}

const memo = {}
const editMemo = (symbol, value) => {
  if (memo[symbol]) {
    const bool = checkMemo(symbol, value);
    memo[symbol].push(value);
    return bool;
  }

  memo[symbol] = [value];
}

const checkMemo = (symbol, value) => {
  if (memo[symbol]?.slice(-1) < 0 && value >= 0)
    return true

  return false;
}

const fetchData = async (symbol) => {
  try {
    console.log('getting data for: ', symbol);
    const raw = await fetch(`https://api.taapi.io/macd?secret=${process.env.TAAPI_KEY}&exchange=binance&symbol=${symbol}&interval=4h`)
    const clean = await raw.json();
    console.log(clean);
    return clean;
  } catch (er) {
    console.error(er)
    return {};
  }
}

const getMACDs = (data, symbol) => {
  const {
    valueMACDSignal: red,
    valueMACD: blue
  } = data;
  if (!red || !blue) return;
  const bool = editMemo(symbol, blue - red);
  console.log('checking values: blue: ', blue, 'red: ', red, ' | data: ', memo);
  if (bool) {
    console.log('buy ', symbol);
  }
  return true;
}


app.get('/', (req, res) => {

  console.log('intialized ');
  setInterval(async () => {
    const symbol = cryptoSymbols[index];
    const clean = await fetchData(symbol);

    if (getMACDs(clean, symbol))
      incrementIndex();
  }, 16000)
  res.send('init');

})
app.listen(8081, () => console.log('listening 8081'))