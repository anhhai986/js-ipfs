/* eslint-env mocha */
/* eslint max-nested-callbacks: ["error", 8] */
'use strict'

const expect = require('chai').expect
const isNode = require('detect-node')
const path = require('path')
const fs = require('fs')
const FactoryClient = require('../factory/factory-client')

describe('.util', () => {
  if (!isNode) {
    return
  }

  let ipfs
  let fc

  before(function (done) {
    this.timeout(20 * 1000) // slow CI
    fc = new FactoryClient()
    fc.spawnNode((err, node) => {
      expect(err).to.not.exist
      ipfs = node
      done()
    })
  })

  after((done) => {
    fc.dismantle(done)
  })

  it('.streamAdd', (done) => {
    const tfpath = path.join(__dirname, '/../data/testfile.txt')
    const rs = fs.createReadStream(tfpath)
    rs.path = '' // clean the path for testing purposes

    ipfs.util.streamAdd(rs, (err, result) => {
      expect(err).to.not.exist
      expect(result.length).to.equal(1)
      done()
    })
  })

  it('.fsAdd a directory', (done) => {
    const filesPath = path.join(__dirname, '../data/test-folder')
    ipfs.util.fsAdd(filesPath, { recursive: true }, (err, result) => {
      expect(err).to.not.exist
      expect(result.length).to.be.above(8)
      done()
    })
  })

  it('.fsAdd a file', (done) => {
    const filePath = path.join(__dirname, '../data/testfile.txt')
    ipfs.util.fsAdd(filePath, (err, result) => {
      expect(err).to.not.exist
      expect(result.length).to.be.above(5)

      done()
    })
  })

  it('.urlAdd', (done) => {
    ipfs.util.urlAdd('http://example.com/', (err, result) => {
      expect(err).to.not.exist
      expect(result.length).to.equal(1)
      done()
    })
  })
})
