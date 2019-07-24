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
    Object.keys(options).forEach(key => {
      this[key] = options[key]
    })
    this.more = new More(this.nextButton)
  }
  onConsole (page) {
    page.on('console', message => {
      if (typeof message === 'object') {
        console.dir(message)
      } else {
        log(chalk.blue(message))
      }
    })
  }
  async start (fn) {
    const browser = await puppeteer.launch()
    log(chalk.green('服务正常启动'))
    try {
      const page = await this.newPage(browser)
      log(chalk.yellow('页面初次加载完毕'))
      await this.forClimb(page, fn)
      log(chalk.green('服务正常结束'));
    } catch (error) {
      console.log(error)
      log(chalk.red('服务意外终止'))
    } finally {
      await browser.close()
    }
  }
  // 创建page
  async newPage (browser) {
    const page = await browser.newPage()
    this.onConsole(page)
    await page.goto(this.url, {
      waitUntil: 'networkidle2' // 网络空闲说明已加载完毕
    })
    return page
  }
  async forClimb (page, fn) {
    for (let i = 1;i <= this.limit; i++) {
      this.plan(i)
      await this.handleData(page, fn); // 执行方法
      try {
        await this.nextPage(page)
      } catch (error) {
        log(chalk.red(error))
        await page.waitFor(2500); // 一个页面爬取完毕以后稍微歇歇
        await this.nextPage(page)
      }
    }
  }
  // 打印当前的爬取进度
  plan (i) {
    console.clear();
    log(chalk.yellow(this.formatProgress(i)));
    log(chalk.yellow('页面数据加载完毕'));
  }
  // 进入下一页
  async nextPage (page) {
    await this.more.getDom(page)
    await this.more.next(); // 模拟点击跳转下一页
    await page.waitFor(2500); // 一个页面爬取完毕以后稍微歇歇
  }
  async handleData (page, fn) {
    const result = await page.evaluate(fn);
    // 写入json文件中
    fs.writeFile(this.store, JSON.stringify(result, null, '\t', {
        'flag': 'a'
    }), function (err) {
        if (err) {
            throw err;
        }
    });
    log(chalk.yellow('写入数据完毕'));
  }
  formatProgress (current) {
    let percent = (current / this.limit) * 100;
    let done = ~~(current / this.limit * 40);
    let left = 40 - done;
    let str = `当前进度：[${''.padStart(done, '=')}${''.padStart(left, '-')}]  ${percent}%`;
    return str;
  }
}