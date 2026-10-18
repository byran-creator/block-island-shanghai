# 少量城市跑车外观

44 辆既有私家车中，12 辆使用原创低多边形豪车外观：4 辆楔形超跑、3 辆圆灯溜背跑车、2 辆长车头 GT、2 辆行政轿车、1 辆直瀑格栅礼宾轿车。分散在外滩、陆家嘴、浦东、桥上和北部道路；32 辆普通车及公交、配送电动车保留原样。

造型参考兰博基尼官方 [Huracán Tecnica](https://www.lamborghini.com/en-en/history/huracan-tecnica) 的低车身、锐利前后线条与 [Revuelto](https://www.lamborghini.com/en-en/models/revuelto-models/revuelto) 的雕塑感表面；采用原创方块化轮廓、灯组、进气格栅、轮毂和车牌图案，不使用下载的实车照片、商标或车型铭牌。

其他参考：[保时捷911](https://newsroom.porsche.com/en/press-kits/911/Exterior--design-and-body.html) 的圆灯和溜背、[法拉利Roma](https://www.ferrari.com/en-LB/magazine/articles/design-ferrari-roma-by-flavio-manzoni) 的长车头与GT比例、[劳斯莱斯Ghost](https://www.rolls-roycemotorcars.com/en_GB/showroom/ghost-in-detail.html) 的直立格栅、[奔驰S级](https://www.mercedes-benz.com.ng/models/s-class-sedan/) 的行政轿车轮廓。各类使用不同灯组、车顶、机盖和进气造型，而非只换颜色。

所有装饰合进单一车身网格，所有车型共用一张 256×64 RGBA 像素图集（64 KiB），相同款式复用几何体；前灯保留现有日夜开关并按四类灯组合批。没有新增实时光源、透明反射或逐帧贴图生成。最长/最宽的装饰仍落在原有 .72×1.32 半尺寸、1.3 高度以内；不改变路线、速度、车辆数量、交通预约或玩家存档。

`node tests/city-car-appearance.test.mjs` 检查少数比例、完整模型包围盒、车头方向、图集/几何共享和灯组合批。交通68的12分钟混合人车与15分钟障碍恢复证据保留；纯外观更换不重复扩大交通修改范围。
