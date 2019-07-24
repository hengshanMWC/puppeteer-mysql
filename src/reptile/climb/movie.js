import Climb from '../../plugin/climb'
import path from 'path'
const url = 'https://v.qq.com/channel/movie?listpage=1&channel=movie&itype=100062'
let climb = new Climb({
  url,
  limit: 10,
  nextButton: '.page_next',
  store: path.join(__dirname, '../store/movie.json')
})
export default function () {
  climb.start(() => {
    var $ = window.$; // // 拿到页面上的JQuery
    var itemList = $('.list_item'); // 拿到所有的item
    var links = []; // 存储爬取的数据
    // 循环写进数组
    itemList.each((index, item) => {
        let i = $(item);
        let vid = i.find('.figure').data('float'); // id
        let link = i.find('.figure').attr('href'); // 链接地址
        let star = i.find('.figure_desc').attr('title'); // 主演
        let title = i.find('.figure_pic').attr('alt'); // 电影名称
        let poster = i.find('.figure_pic').attr('src'); // 封面图片
        let count = i.find('.figure_count').text(); // 播放量
        // 存进之前定义好的数组中
        links.push({
            vid,
            title,
            count,
            star,
            poster,
            link
        });
    });
    return links; // 返回数据
  })
}
