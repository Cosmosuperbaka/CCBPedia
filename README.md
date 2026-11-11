# CCBPedia

[![在线访问](https://img.shields.io/badge/在线访问-ccbpedia.baka.website-c2553a)](https://ccbpedia.baka.website)
[![CI](https://github.com/Cosmosuperbaka/CCBPedia/actions/workflows/ci.yml/badge.svg)](https://github.com/Cosmosuperbaka/CCBPedia/actions/workflows/ci.yml)
[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL--3.0-2f7a59)](./LICENSE)

「[二刺猿笑传之猜猜呗](https://ccb.baka.website)」赛事数据百科：记录每一届赛事的赛程、比分、选手与年度榜单。

- 在线访问：<https://ccbpedia.baka.website>
- 游戏本体：<https://ccb.baka.website>（[源码](https://github.com/Cosmosuperbaka/anime-character-guessr)）

## 这里有什么

- **赛事**：从 2025 年 6 月第一届 Major 至今的全部赛事。每届赛制都不一样，页面按各自的赛制原样呈现：
  - BO1 / BO3 对阵 —— 记分牌样式，大比分一列、每一图一列，加时与弃赛单独标出
  - 单败 / 双败 —— 按轮次分列的对阵树
  - 单循环 —— 积分榜 + 交叉对阵表
  - 瑞士轮 —— 按轮次切换，顶部有晋级 / 淘汰总览
  - 多人混战房间 —— 分数条与晋级线
  - 自由约战（Solo 杯）—— 战绩表 + 对局记录，可按选手筛选
- **选手**：每位选手的参赛履历、名次、队友与单挑战绩。同一个人的不同写法（大小写、昵称）会自动归到一起。
- **榜单**：年度最佳选手评选、年度积分榜及其构成、积分细则与年度荣誉。

## 本地运行

需要 Node.js 20+ 与 pnpm。

```bash
pnpm install
pnpm dev        # 本地开发，默认 http://localhost:5199
pnpm typecheck  # 类型检查
pnpm build      # 类型检查 + 生产构建，产物在 dist/
```

站点是纯前端（CSR），使用相对路径和 Hash 路由，`dist/` 放到任何静态托管上都能直接打开。

## 目录结构

```
src/
├─ data/              全部数据（改数据只需要动这里）
│  ├─ types.ts        数据结构约定，带详细注释
│  ├─ build.ts        录入用的简写工具（lobby / match / side …）
│  ├─ t2025.ts        2025 年赛事
│  ├─ t2026.ts        2026 年赛事
│  ├─ players.ts      选手别名归一、头像映射
│  ├─ rankings.ts     年度榜单
│  └─ index.ts        聚合：赛事列表、选手档案、全站统计
├─ lib/               胜负、总分、天梯统计等纯函数
├─ components/
│  ├─ ui.tsx          通用基础组件（头像、选手名、标签、Tabs、分数条 …）
│  ├─ Layout.tsx      顶栏、主题切换、路由过渡、页脚
│  └─ stages/         六种赛制的视图组件
├─ pages/             首页、赛事、选手、榜单
└─ styles/            设计变量（tokens.css）与全局样式
public/
├─ avatars/           选手头像
└─ brand/             游戏图标与海报
```

## 补充或更正数据

赛事数据全部手工整理，难免有遗漏和笔误。欢迎提 Issue 指出，或者直接发 PR 修改——录入一届新赛事、给选手加别名和头像的完整步骤见 [CONTRIBUTING.md](./CONTRIBUTING.md)。

## 部署

线上站点托管在阿里云 ESA Pages，配置见 [`esa.jsonc`](./esa.jsonc)：

```bash
pnpm build
esa-cli deploy --name ccbpedia --assets ./dist --environment production
```

## 许可

- 代码以 [GNU AGPL-3.0](./LICENSE) 许可发布：可以自由使用、修改和再发布，但修改后的版本（包括部署成网站对外提供服务的情况）必须以同样的许可公开源码。
- 赛事数据由赛事主办方与群友整理；选手头像、游戏图标与海报的权利归各自的作者所有，仅用于展示。如有不希望被展示的内容，请提 Issue，会尽快处理。
