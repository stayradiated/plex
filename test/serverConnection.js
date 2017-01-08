import test from 'ava'
import nock from 'nock'

import {ServerConnection} from '../lib'

const URI = 'http://192.168.1.100:32400'
const PARENT_HEADERS = {
  'X-Plex-Header': true,
}
const PARENT = {
  headers: () => PARENT_HEADERS,
}

test.beforeEach((t) => {
  t.context.sc = new ServerConnection(URI, PARENT)
})

test('constructor without parent', (t) => {
  const sc = new ServerConnection(URI)
  t.is(sc.uri, URI)
  t.is(sc.parent, undefined)
})

test('constructor with parent', (t) => {
  const sc = new ServerConnection(URI, PARENT)
  t.is(sc.uri, URI)
  t.is(sc.parent, PARENT)
})

test('headers', (t) => {
  const {sc} = t.context
  t.deepEqual(sc.headers(), PARENT_HEADERS)
})

test('getUrl', (t) => {
  const {sc} = t.context
  const url = sc.getUrl('/path', {key: 'value'})
  t.is(url, 'http://192.168.1.100:32400/path?key=value')
})

test('fetch', (t) => {
  const {sc} = t.context

  const scope = nock(URI)
    .get('/path')
    .reply(200, {})

  return sc.fetch('/path').then((res) => {
    scope.done()
    t.is(res.status, 200)
  })
})

test('fetch with params', (t) => {
  const {sc} = t.context

  const scope = nock(URI)
    .post('/path?key=value')
    .reply(200, {})

  return sc.fetch('/path', {
    method: 'POST',
    params: {
      key: 'value',
    },
  }).then((res) => {
    scope.done()
    t.is(res.status, 200)
  })
})

test('fetchJSON', (t) => {
  const {sc} = t.context

  const scope = nock(URI)
    .get('/path')
    .reply(200, {})

  return sc.fetchJSON('/path').then((res) => {
    scope.done()
    t.deepEqual(res, {})
  })
})

test('fetchJSON with params', (t) => {
  const {sc} = t.context

  const scope = nock(URI)
    .post('/path?key=value')
    .reply(200, {})

  return sc.fetchJSON('/path', {
    method: 'post',
    params: {
      key: 'value',
    },
  }).then((res) => {
    scope.done()
    t.deepEqual(res, {})
  })
})