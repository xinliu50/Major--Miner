import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import throng from 'throng';

// const throng = require('throng')

const WORKERS = process.env.WEB_CONCURRENCY || 1
const PORT = process.env.PORT || 3000

throng({
  workers: WORKERS,
  lifetime: Infinity
}, start)

function start() {
  const crypto = require('crypto')
  const express = require('express')
  const app = express()

  app
    .get('/cpu', cpuBound)
    .get('/memory', memoryBound)
    .get('/io', ioBound)
    .get('/', hello)
    .listen(PORT, onListen)

  function hello(req, res, next) {
    ReactDOM.render(<App />, document.getElementById('root'));
  }

  function cpuBound(req, res, next) {
    const key = Math.random() < 0.5 ? 'ninjaturtles' : 'powerrangers'
    const hmac = crypto.createHmac('sha512WithRSAEncryption', key)
    const date = Date.now() + ''
    hmac.setEncoding('base64')
    hmac.end(date, () => res.send('A hashed date for you! ' + hmac.read()))
  }

  function memoryBound(req, res, next) {
    const large = Buffer.alloc(10 * 1024 * 1024, 'X')
    setTimeout(() => {
      const len = large.length  // close over the Buffer for 1s to try to foil V8's optimizations and bloat memory
      console.log(len)
    }, 1000).unref()
    res.send('Allocated 10 MB buffer')
  }

  function ioBound(req, res, next) {
    setTimeout(function SimulateDb() {
      res.send('Got response from fake db!')
    }, 300).unref()
  }

  function onListen() {
    console.log('Listening on', PORT)
  }
}


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();
