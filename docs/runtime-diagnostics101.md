# 真机渲染诊断101（2026-10-24）

本轮完成诊断基础与真机采样，未证明新的手机帧率/加载收益。身份场景矩阵直写候选已撤回；最终仅合并显式开发诊断工具，默认游戏继续使用100轮运行逻辑。画质、人物、交通、距离、存档6/地图11/缓存84均未改变。

## 真机证据

Pura 70、HarmonyOS 4.2、Edge 155；最小化发布式专用包，seed101，静音且隔离玩家存档。正常帧节奏与区块预算，四个固定位置自动转向各12秒。画布835×465、比例1.25、MSAA开、目标30帧；不能与画布972×465的91轮直接比较。此次是固定转向诊断，不是真人走完任务，也没有单独测输入延迟、完整启动A/B或iPhone自动重载。

| 场景 | 记录帧间隔中位 | 同步帧函数中位 | render墙钟中位 | 矩阵树中位 | 实例整理中位 |
| --- | ---: | ---: | ---: | ---: | ---: |
| 外滩白天 | 50ms | 48.3ms | 25.7ms | 6.7ms | 4.9ms |
| 南京路首次夜景 | 50.1ms | 51.7ms | 25.9ms | 7.9ms | 5.1ms |
| 陆家嘴白天 | 50.1ms | 46.3ms | 24.1ms | 7.8ms | 5.0ms |
| 外滩已进入的夜景 | 50ms | 46.9ms | 27.0ms | 6.4ms | 4.6ms |

表中矩阵、实例属于render内部，不能相加重复计入整帧。render还含驱动等待，不代表独立GPU耗时。手机不支持EXT_disjoint_timer_query_webgl2，本轮GPU记为不可用，不能推断GPU无瓶颈。车流tick中位约3–4ms，GC并非本段抽样第一热点，不先改动已验证的交通行为。

授权QA标签的18.88秒CPU Profiler、8276样本（2ms抽样）也指向updateMatrixWorld、实例update、projectObject和multiplyMatrices；抽样主要在路线后段，不用其推算各区域占比。原报告保存在本地qa/runtime101-mvmi9ja0.json、phone101-summary.json、phone101.cpuprofile及phone101-profile.json。采样完成后切后台使最终状态成为paused/phase4，四段结果已完整保存；不是中途锁屏数据。浏览器信息只保存在本地诊断，不上传。

## 诊断接口

performance-probe仍仅由显式?perf=1启用。普通入口不创建计时器、GPU查询或方法包装；不自动上传报告。createRuntimeProfiler用有界typed ring保存粗粒度嵌套CPU墙钟与独占墙钟；保留调用this、参数、返回值和异常。探针本身有开销，只与相同探针配置对比，不把本次数值当成无探针的纯游戏上限。资源计数来自renderer.info，不是实际显存。

GPU采样每8帧最多4个未决query，返回浏览器后异步检查可用性，丢弃disjoint，超时释放；禁止gl.finish和强制回读。reset、隐藏、contextlost/restored和dispose有明确责任；dispose恢复自己仍持有的方法，不能覆盖后来替换者。分段报告有P50/P95/P99、超过100ms帧、纹理上传/着色器调用/资源计数；coarse channel不细到每个人物。

所有测量条件和有效性必须随报告保留。启动长任务在longTasks用at标记，不能全部解释成稳定运行卡顿。后台暂停排除；新自动QA需持久化每段、单条rAF链、失败保留此前报告，临时Wake Lock仅在采样期间申请、结束释放，不修改手机OS设置。

## 候选与资源试点

矩阵候选只在scene.matrixWorld严格为单位矩阵时直接写相同Float32实例值，其他变换回原乘法。随机变换、负零、父级变化、替换与前缀用量测试通过；三组固定画布WebGL对照的逐帧draw/tri、上传字节和四镜位像素一致。但帧函数中位原75.9/76.1/127.5ms，候选73.2/78.9/126.7ms；P95原398.2/129.2/1062.5ms，候选256.6/224.2/2640.1ms。后段系统调度噪声明显，没有稳定整帧收益，已撤回，不作为上线优化或手机FPS收益。qa/identity101-rejected.json留存失败证据，不放宽测试。

上海中心办公层审计：19mesh、15geometry、43,924字节几何、2张贴图理论RGBA+mips约0.755MiB。Node单次塔楼全部构造59.7ms、套房39.7ms只是构造诊断，不是手机启动或GPU驻留。跨房间共享的几何/材质不能重复计算收益，外立面玻璃必须继续可见。办公室资源很小，当前不足以证明值得先做完整卸载框架；暂不实施生产生命周期。

真正试点前须接通后挂载的碰撞、NPC索引、主线、烘焙、实例注册与恢复；现有实例器长期持有source引用，单独remove/dispose房间不成立。明确独占与共享资源后再决定有限保留/释放，不把visible=false称作释放。

## 下一步边界

优先审计可明确声明为静态的局部变换与不变实例提交，保留动态父级、显式坐标查询和外部替换；先统计实际命中量再试缓存，不全局重写Three或靠跳过人物模拟提帧。GPU扩展缺失仍是证据空缺，后续需要同画质重放/有限GPU诊断辅助；iPhone重载还需该设备复测。加载路线本轮无新收益，不声称减半。

参考：[Khronos异步GPU查询规范](https://registry.khronos.org/webgl/extensions/EXT_disjoint_timer_query_webgl2/)、[Chrome真机测量说明](https://developer.chrome.com/blog/devtools-grounded-real-world)。

## 验证

55项test:release与Sites/Pages双构建通过。新增回归覆盖默认入口不触发GPU诊断、有界异步查询、不可用/超时/disjoint/上下文丢失、嵌套CPU及异常恢复、reset、方法所有权和有界报告。功能构建通过不是手机性能达标；所有生产运行候选已撤回。正式诊断没有自动POST，本地自动保存只属于不发布的专用QA页。
