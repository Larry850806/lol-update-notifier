const cheerio = require('cheerio')
const axios = require('axios')

const DEV_MODE = false

const SECOND = 1000
const MINUTE = 60 * SECOND

const interval = DEV_MODE ? SECOND : 10 * MINUTE

const getLatestVersion = async () => {
  try {
    const res = await axios('https://lol.garena.tw/download/')
    const html = res.data
    const $ = cheerio.load(html)
    const version = $(
      'div.download-curver__main > div.download-curver__main-link a'
    )
      .attr('href')
      .split('TW_patch_')[1]
      .split('_')[0]

    return version
  } catch (err) {
    console.error(err)
  }
}

const annieID = '586e4c6be4b03a8e433572c9'
const larryID = '586e25c7e4b03a8e42bc3c82'

const subscribeIds = [annieID, larryID]

const sendToNotificationCenter = ({ userID }) => {
  const url = 'http://35.196.202.75:11111/send'
  const method = 'GET'

  const params = {
    message: 'LOL 有更新哦，記得要提早更新晚上才能馬上玩～～～',
    userID,
  }

  axios(url, {
    params,
  }).catch(err => {
    console.error(err)
  })
}

sendToNotificationCenter({ userID: larryID })
sendToNotificationCenter({ userID: annieID })

async function main() {
  let currentVersion = await getLatestVersion()

  if (DEV_MODE) {
    // change the old version to trigger sending notification
    setInterval(() => {
      currentVersion = 'very old version'
    }, 5000)
  }

  setInterval(async () => {
    const newVersion = await getLatestVersion()

    // sometimes lol website doesn't show latest version
    // and it will get undefined
    // ignore it
    if (newVersion === undefined) {
      return
    }

    console.log('current version:', currentVersion)

    if (newVersion !== currentVersion) {
      console.log('current version:', currentVersion)
      console.log('new version:', newVersion)
      console.log('send')
      console.log('----------')
      currentVersion = newVersion

      if (!DEV_MODE) {
        // If not in DEV_MODE, also send to annie
        sendToNotificationCenter({ userID: annieID })
      }
      sendToNotificationCenter({ userID: larryID })
    }
  }, interval)
}

main()
