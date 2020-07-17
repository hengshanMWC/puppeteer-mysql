export default (sequelize, DataTypes) =>
// define() 方法接受三个参数
// 表名，表字段的定义和表的配置信息
  sequelize.define('phone_detail', {
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
    covers: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: '封面，用,分割'
    },
    subheading: {
      type: DataTypes.STRING,
      comment: '副标题'
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '价钱'
    },
    colors: {
      type: DataTypes.STRING,
      comment: '商品颜色,用,分割'
    },
    memorys: {
      type: DataTypes.STRING,
      comment: '内存容量，用,分割',
    },
    meansPurchases: {
      type: DataTypes.STRING,
      comment: '购买方式，用,分割',
    },
    suits: {
      type: DataTypes.STRING,
      comment: '套装，用,分割',
    },
    comment: {
      type: DataTypes.INTEGER,
      comment: '购买评价'
    },
    salesVolume: {
      type: DataTypes.INTEGER,
      comment: '销售量'
    }
  }
)