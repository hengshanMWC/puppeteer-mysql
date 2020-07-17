import Climb from '../../plugin/climb'
import path from 'path'
const url = 'http://bang.dangdang.com/books/bestsellers/01.00.00.00.00.00-24hours-0-0-1-1'
let climb = new Climb({
  url,
  limit: 25,
  nextButton: '.next a',
  store: path.join(__dirname, '../store/book.json')
})
export default function () {
  climb.start(() => {
    var $ = window.$; // // 拿到页面上的JQuery
    var itemList = $('.bang_list.clearfix.bang_list_mode li'); // 拿到所有的item
    var links = []; // 存储爬取的数据
    // 循环写进数组
    itemList.each((index, item) => {
        let i = $(item);
        let publisherInfos = i.find('.publisher_info')
        let detailLink = i.find('.pic>a').attr('href'); // 详情链接地址
        let cover = i.find('.pic>img').attr('src'); // 封面
        let title = i.find('.name').attr('title'); // 标题
        let star = parseInt(i.find('.star>span>span').attr('style')); // 星
        let commentNumber = parseInt(i.find('.star>a').text()); // 评论数量
        let commentLink = i.find('.star>a').attr('href'); // 评论链接
        let recommend = parseInt(i.find('.tuijian').text()); // 推荐
        let publisherInfo = publisherInfos.eq(0).html(); // 出版信息html
        let date = publisherInfos.eq(1).find('span').text(); // 日期
        let publishingHouse = publisherInfos.eq(1).find('a').text(); // 出版社
        let publishingHouseLink = publisherInfos.eq(1).find('a').attr('href'); // 出版社链接
        let priceDiscount = parseInt(i.find('.price_n').text()); // 折后价格
        let price = parseInt(i.find('.price_r').text()); // 原价
        let discount = parseInt(i.find('.price_s').text()); // 打折
        let electronicEdition = !!i.find('.listbtn_buydz').text() // 是否有电子版
        // 存进之前定义好的数组中
        links.push({
          detailLink,
          cover,
          title,
          star,
          commentNumber,
          commentLink,
          recommend,
          publisherInfo,
          date,
          publishingHouse,
          publishingHouseLink,
          priceDiscount,
          price,
          discount,
          electronicEdition
        });
    });
    return links; // 返回数据
  })
}
