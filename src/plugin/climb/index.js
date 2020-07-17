import puppeteer from 'puppeteer'
import chalk from 'chalk'
import fs from 'fs'
import More from './more'
const log = console.log
export default class Climb {
  /**
   * 
   * @param {*} options 
   *  @param {String} url // 爬的链接
   *  @param {Number} limit // 页数
   *  @param {String} nextButton // JQ：下一页按钮
   *  @param {String} store // 储存
   */
  constructor (options) {
    this.options = options
    this.waitFor = 2500
    this.pageTimeout
    this.log = false
    Object.keys(options).forEach(key => {
      this[key] = options[key]
    })
    if (this.nextButton) {
      this.more = new More(this.nextButton)
    }
  }
  isUrl () {
    return typeof this.url === 'string'
  }
  // get _url
  onConsole (page) {
    if (!this.log) return
    page.on('console', message => {
      if (typeof message === 'object') {
        console.dir(message)
      } else {
        log(chalk.blue(message))
      }
    })
  }
  async start (fn, fn2) {
    this.browser = await puppeteer.launch()
    log(chalk.green('服务正常启动'))
    try {
      await this.forClimb(fn, fn2)
      log(chalk.green('服务正常结束'));
    } catch (error) {
      console.log(error)
      log(chalk.red('服务意外终止'))
    } finally {
      await this.browser.close()
    }
  }
  // 创建page
  async newPage (i) {
    const page = await this.browser.newPage()
    log(chalk.yellow('页面初次加载完毕'))
    this.onConsole(page)
    await page.goto(this.getUrl(i), {
      timeout: this.pageTimeout,
      waitUntil: 'networkidle2' // 网络空闲说明已加载完毕
    })
    log(chalk.yellow('页面数据加载完毕'));
    return page
  }
  async forClimb (fn, fn2) {
    let arr = []
    let page = null
    if (this.isUrl) {
      page = await this.newPage()
    }
    for (let i = 0;i < this.limit; i++) {
      log(chalk.blue(`第${i}个列表页,url为${this.getUrl(i)}`))
      if (!this.isUrl) {
        page = await this.newPage(i)
      }
      let data = await fn(page)
      arr.push(...data)
      this.plan(i + 1)
      if (!this.isUrl) page.close()
      await this.nextCentre(page, i)
    }
    typeof fn2 === 'function' && await fn2(page, arr)
  }
  // 打印当前的爬取进度
  plan (i) {
    // console.clear();
    log(chalk.yellow(this.formatProgress(i)));
  }
  // 进入下一页
  async nextPage (page, i) {
    if (this.more) {
      await this.more.getDom(page)
      await this.more.next(); // 模拟点击跳转下一页
      await page.waitFor(this.waitFor); // 一个页面爬取完毕以后稍微歇歇
    } else {
      await this.goto(page, this.url(i))
    }
  }
  async nextCentre (page, i) {
    if (this.isUrl) {
      try {
        await this.nextPage(page, i)
      } catch (error) {
        log(chalk.red(error))
        await page.waitFor(this.waitFor); // 一个页面爬取完毕以后稍微歇歇
        await this.nextPage(page, i)
      }
    }
  }
  async goto (page, url) {
    try {
      await page.goto(url, {
        timeout: this.pageTimeout,
        waitUntil: 'networkidle2' // 网络空闲说明已加载完毕
      })
      return page
    } catch (error) {
      console.log(error)
    }
  }
  getUrl (i) {
    let url = this.url
    if (typeof url === 'string') {
      return url
    } else {
      return url(i)
    }
  }
  formatProgress (current) {
    let percent = (current / this.limit) * 100;
    let done = ~~(current / this.limit * 40);
    let left = 40 - done;
    let str = `当前进度：[${''.padStart(done, '=')}${''.padStart(left, '-')}]  ${percent}%`;
    return str;
  }
}