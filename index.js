const cheerio = require('cheerio')
const axios = require('axios')

const DEV_MODE = true

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
  const url = 'http://54.187.242.127:11111/send'
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

    if (newVersion !== currentVersion) {
      console.log(currentVersion)
      console.log(newVersion)
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
