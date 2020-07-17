import Climb from '../../plugin/climb'
import path from 'path'
import fs from 'fs'
import chalk from 'chalk'
import { Phone, phoneDetail } from '../../model/test'
const url = 'http://www.zol.com/cell_phone/list/c34_s57.html'
const fnUrl = function (i) {
  return `http://www.zol.com/cell_phone/list/c34_s57_${i+1}.html`
}
const storeList = path.join(__dirname, '../store/phone.json')
const storeDetails = path.join(__dirname, '../store/phone-details.json')
let log = console.log
let climb = new Climb({
  waitFor: 5000,
  url: fnUrl,
  pageTimeout: 0,
  // log: true,
  limit: 100,
  // nextButton: '.next'
})
async function addList (list, b) {
  log(chalk.green('导入phone表中'))
  if (b) {
    // 写入json文件中
    fs.appendFile(storeList, JSON.stringify(list, null, '\t', {
      'flag': 'a'
    }), function (err) {
      if (err) {
        throw err;
      }
    });
  } else {
    await Phone.bulkCreate(list)
  }
  log(chalk.green('导入phone表成功'))
}
async function addDetail (detail, b) {
  log(chalk.green('导入phone_detail表中'))
  if (b) {
    // 写入json文件中
    fs.appendFile(storeDetails, JSON.stringify(detail, null, '\t', {
      'flag': 'a'
    }), function (err) {
        if (err) {
          throw err;
        }
    });
  } else {
    await phoneDetail.create(detail)
  }
  log(chalk.green('导入phone_detail表成功'))
}
async function getDetails (page, arr) {
  let details = []
  for (let i = 0, len = arr.length; i < len; i++) {
    let url = arr[i].detailLink
    try {
      await climb.goto(page, url)
      log(chalk.magenta(`第${i}个详情加载完毕`))
      let detail =  await page.evaluate(() => {
        let $ = window.$
        let covers = Array.from($('#zs-focus-list img')).map(img => img.src).join(',')
        let colors = Array.from($('#zp-choose-color span')).map(span => span.firstChild.nodeValue).join(',')
        let memorys = Array.from($('#zp-choose-product span')).map(span => span.firstChild.nodeValue).join(',')
        let meansPurchases = Array.from($('#zp-choose-sale span')).map(span => span.firstChild.nodeValue).join(',')
        let suits = Array.from($('#zp-choose-suit span')).map(span => span.firstChild.nodeValue).join(',')
        return {
          covers, 
          title: $('.zs-commodity-title')[0].firstChild.nodeValue.trimStart().trimEnd(),
          subheading: $('.subheading').text(),
          price: Number($('#zp-goods-price').text()),
          colors,
          memorys,
          meansPurchases,
          suits,
          comment: Number($('#zp-nav-order-review').text()),
          salesVolume: Number($('zp-nav-order-record').text()),
        }
      })
      await addDetail(detail)
      details.push(detail)
    } catch (error) {
      log(chalk.red(`第${i}个为${url}的详情获取失败`))
      log(chalk.red(error))
    }
    
  }
}
export default function () {
  climb.start(async page => {
    let list = await page.evaluate(() => {
      const $ = window.$
      var itemList = Array.from($('#goodsPicList>li')); // 拿到所有的item
      const list = []; // 存储爬取的数据
      for (var index = 0; index < itemList.length; index++) {
        let i = $(itemList[index]);
        let data = {
          detailLink: i.find('.pic').attr('href'),
          shopLink: i.find('.shop-name > a').attr('href'),
          img: i.find('.img>img').attr('src'),
          title: i.find('.title').text().trimStart().trimEnd(),
          price: Number(i.find('.price').text().slice(1)),
          activityinfor: i.find('.activity-infor').text(),
          salesVolume: Number(i.find('.volume em').text().trimStart()),
          commentNum: Number(i.find('.volume a').text()),
          shopName: i.find('.shop-name > a').text(),
          shopMake: Number(i.find('.shop-volume > em').text())
        }
        // 存进之前定义好的数组中
        list.push(data);
      }
      return list
    })
    // console.log(list)
    await addList(list)
    await getDetails(page, list)
    return list
  })
}
