import chalk from 'chalk'
export default class More {
  constructor (nextButton) {
    this.nextButton = nextButton
    this.dom = null
  }
  async getDom (page) {
    let dom
    if (typeof this.nextButton === 'string') {
      dom = await page.$(this.nextButton); // 获取下一页按钮      
    } else {
      dom = this.nextButton(page)
    }
    if (!dom) {
        chalk.red('数据获取完毕');
        return;
    }
    this.dom = dom
  }
  async next () {
    await this.dom.click() // 模拟点击跳转下一页
  }
}