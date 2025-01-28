# Crypto Dashboard

This is a minimal project to display an orderbook for a crypto asset pair such as BTC / USDT.

Data is retrieved via a websocket stream and an api available publicy on Binance.

The steps to maintain a local orderbook are laid out here:

- [@vitejs/plugin-react](https://developers.binance.com/docs/binance-spot-api-docs/web-socket-streams#how-to-manage-a-local-order-book-correctly) uses [Babel](https://babeljs.io/) for Fast Refresh
