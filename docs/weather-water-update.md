# 第一批：天气节奏与水面移动 · 2026-10-07

本批仅处理天气/昼夜节奏和水面移动。上海中心塔冠广告与人物贴图保留为下一批，未修改其源文件。

## 依据与取舍

Minecraft官方[首夜指南](https://www.minecraft.net/en-us/article/how-survive-your-first-night-minecraft)说明白天约10分钟；[Minecraft Education官方教材](https://education.minecraft.net/lessonsupportfiles/8325548264145603-Coding%20with%20Minecraft_Unit%206_Functions.pdf)说明完整游戏日为24000 ticks、20分钟。游戏参考完整20分钟昼夜，不把10分钟白天误当成完整一天。旧版默认40分钟，自动天气周期60分钟且开局晴天约19.5分钟。

[官方水域更新说明](https://www.minecraft.net/ja-jp/article/update-aquatic-out-java)介绍水下冲刺进入游泳，[官方Education键鼠指南](https://edusupport.minecraft.net/hc/en-us/articles/360047116832-Minecraft-keyboard-and-mouse-controls)介绍空格上浮。这里采用本项目既有键位：空格上浮、Shift下潜。没有逐项复刻Minecraft全部游泳、潜行或天气随机机制。

## 行为

新游戏默认一昼夜20分钟，已有存档的有效40/60/120分钟设置保持。Esc菜单可选择昼夜长度；固定时刻仍只冻结昼夜，不冻结天气或交通。

自动天气新增活跃/标准/缓慢三档，完整周期分别10/20/60分钟，默认标准。标准开局晴天约6.5分钟，随后各段约2.25–4.5分钟；活跃开局晴天约3.25分钟。画面保留原55秒指数渐变时间常数，因此这些是目标天气切换时间，视觉完全过渡仍需一段时间。晴/多云/雨/雾独立于昼夜变化，手动固定天气仍保持选择，速度控件在手动模式禁用。

天气快慢保存到原玩家存档内；旧版天气elapsed按周期比例迁移，保留所在阶段和雨雾强度；切换速度也保留当前阶段。地图缓存和整体存档版本不变。

水面接触判定提前到水位附近，水中水平移动不再使用陆地跑步速度。开阔水面按住空格会受控上浮到能呼吸的高度，不再每次靠近水面都给8格/秒弹射；Shift优先下潜。附近有真实低矮出口时保留上岸辅助，码头和船面上的正常步行/跑步、地铁干燥环境与创造飞行保持。

## 验收

新weather-water回归覆盖默认20分钟、原时长设置保留、天气各阶段/渐变/旧时间迁移/速度保存，以及不同步长下的上浮、下潜和水中速度。atmosphere、world、metro、river-life回归均通过。

静音、不写存档的浏览器验收：持续跑步开启时，水中10秒移动35格，上浮停在脚高21.4、水位22.25，仍为游泳且无碰撞；下潜2秒约7.6格。陆地跑步1秒8.5格。现有潜水码头上岸后脚高约23、与真实地面高度差小于0.002且有脚下支撑。界面选择活跃后存档捕获cycleSeconds=600。浏览器无脚本错误。

本地验收证据位于.local-data/qa/weather-water-browser-results.json和weather-settings-v31.png，不上传玩家存档或测试入口。
