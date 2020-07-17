export default (sequelize, DataTypes) =>
// define() 方法接受三个参数
// 表名，表字段的定义和表的配置信息
  sequelize.define('phone', {
    id: {
      // Sequelize 库由 DataTypes 对象为字段定义类型
      type: DataTypes.INTEGER(11),
      // 允许为空
      allowNull: false,
      // 主键
      primaryKey: true,
      // 自增
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: '标题'
    },
    img: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: '封面'
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '价钱'
    },
    activityinfor: {
      type: DataTypes.STRING,
      comment: '活动优惠'
    },
    salesVolume: {
      type: DataTypes.INTEGER,
      comment: '销售量'
    },
    commentNum: {
      type: DataTypes.INTEGER,
      comment: '评论数量'
    },
    shopName: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: '商家名'
    },
    shopMake: {
      type: DataTypes.STRING,
      comment: '商家销量'
    },
    // detailLink: {
    //   type: DataTypes.STRING,
    //   comment: '详情链接'
    // },
    // shopLink: {
    //   type: DataTypes.STRING,
    //   comment: '商家链接'
    // }
  }
)