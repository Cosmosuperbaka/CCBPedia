# 贡献指南

感谢你愿意帮忙完善 CCBPedia。这里最需要的贡献是**数据**：补录新赛事、更正比分、给选手加别名和头像。

- 只是发现了错误：直接[提 Issue](../../issues/new/choose)，写清楚哪一届、哪一场、正确的应该是什么，最好附上截图或记录来源。
- 想自己动手：Fork 仓库 → 新建分支 → 修改 → 本地检查 → 发 PR。

## 本地准备

```bash
pnpm install
pnpm dev
```

提交前请确认下面这条命令能通过（CI 也会跑它）：

```bash
pnpm build
```

## 数据的几条原则

1. **照实录入，不要推测。** 记录里没有的比分就留空，不要补一个「大概的数」。
2. **选手名写原始写法。** 记录里怎么写就怎么写（`Lese`、`lese`、`is` 都可以），归一交给 `players.ts`，不要在赛事数据里手动改名。
3. **有疑问就写备注。** 原始记录自相矛盾、疑似笔误时，用 `note` 字段把情况写在页面上，而不是悄悄改掉。
4. **日期用 `YYYY-MM-DD`。** 不知道具体日期时，`start` 写一个只用于排序的日期，并用 `dateNote` 说明（例如 `'2026 · 日期待补'`）。

## 新增一届赛事

所有赛事都在 `src/data/t<年份>.ts` 里。步骤：

1. 在对应年份的文件里新建一个 `Tournament` 对象（新的年份就新建 `t2027.ts`，并在 `src/data/index.ts` 里引入）。
2. 把它加进文件末尾导出的数组。
3. 如果出现了新选手的别名或头像，按下文更新 `players.ts`。

`Tournament` 的完整字段见 [`src/data/types.ts`](./src/data/types.ts)，每个字段都有注释。最小示例：

```ts
import type { Tournament } from './types';
import { lobby } from './build';

const major4: Tournament = {
  id: 'major-4',            // 路由 id：系列-届数
  name: '第四届 Major',
  series: 'major',          // major | lbc | rookie | msi | tianhong | solo | other
  edition: 4,
  mode: 'solo',             // solo 个人赛 | team 团队赛
  start: '2026-12-01',
  end: '2026-12-03',
  status: 'finished',       // 中途终止写 'aborted'
  tagline: '一句话概述这届比赛。',
  formatTags: ['个人赛', '瑞士轮', '十人决赛'],
  rules: ['赛制说明，一段一条。'],
  stages: [
    {
      kind: 'lobbies',
      title: '决赛',
      lobbies: [lobby('十人决赛', [['选手A', 53, { status: 'champion' }], ['选手B', 40]])],
    },
  ],
  placements: [
    { rank: 1, label: '冠军', players: ['选手A'], score: 53 },
    { rank: 2, label: '亚军', players: ['选手B'], score: 40 },
  ],
};
```

新系列需要在 `types.ts` 的 `SeriesId` 和 `index.ts` 的 `SERIES` 里各加一项。

### 阶段（stages）怎么写

一届赛事由若干阶段组成，`kind` 决定用哪种视图。`src/data/build.ts` 提供了简写工具，现有赛事都是很好的参考。

#### `lobbies` —— 多人房间（混战计分 / 仅名单）

```ts
{
  kind: 'lobbies',
  title: '淘汰赛',
  desc: '每组前五进入决赛。',
  lobbies: [
    lobby('A 组', [['琪露诺', 27], ['shaw', 26], '悠之空穹'], { advance: 2 }),
  ],
}
```

- 行的写法：`'名字'`（只有名单）、`['名字', 得分]`、`['名字', 得分, 排名加分]`、`['名字', 得分, { status, note, deduct, bonus }]`。
- **行的顺序就是页面上的顺序**，请按名次排好。
- `advance: N` 表示前 N 行晋级，会画出晋级线；也可以逐行写 `status`（`champion` / `direct` / `advance` / `out` / `absent` / `forfeit`）。
- 团队赛的行写成 `{ name: '二组', team: ['Shaw', '云霄', '中华小当家'], score: 104 }`。
- 带入积分的累计制用 `carryLobby('A 组', [['名字', 带入, 本轮, 加分]])`。

#### `matches` —— 对阵列表（BO1 / BO3）

```ts
{
  kind: 'matches',
  title: '小组赛 · 第一轮',
  matches: [
    match(side('八组', 'Shaw', '顶碗人', '澄梦Crystal'), side('七组', 'lese', 'gura', 'arisu'), [[42, 20]]),
  ],
}
```

- 个人赛直接写名字：`match('V.', 'Shinon', [[54, 49]])`。
- BO3 传 `{ bestOf: 3 }`，每一图一个比分：`[[34, 31], [25, 33], [34, 34, 'a']]`。
- 加时：`[30, 31, [4, 0]]`（第三项是加时比分，有加时就以加时定胜负）。
- 比分相同或需要显式指定胜方：第三项写 `'a'` 或 `'b'`。
- 弃赛：`match(A, B, [], { winner: 'b', result: 'forfeit' })`；对手人员不齐自动晋级用 `result: 'walkover'`。
- 其它可选项：`date`、`label`（如「决赛」）、`note`。

#### `bracket` —— 对阵树（单败 / 双败）

```ts
{
  kind: 'bracket',
  title: '双败淘汰赛',
  tracks: [
    { name: '胜者组', rounds: [{ title: '第一轮', matches: [ /* match(...) */ ] }] },
    { name: '败者组', rounds: [{ title: '第一轮', matches: [ /* … */ ] }] },
  ],
}
```

单败只需要一条不带 `name` 的赛道。

#### `roundRobin` —— 单循环

需要 `teams`（参赛方）、`matches`（全部场次）和**已排好序**的 `standings`（`{ name, win, loss, status?, note? }`）。参考 `t2026.ts` 的第二届 LBC。

#### `swiss` —— 瑞士轮

`rounds` → 每轮若干战绩池 `pools`（`record: '1-0'`）→ 每池若干房间 `lobbies`；`outcomes` 写本轮产生的晋级 / 淘汰名单。参考 `t2026.ts` 的第二届新人杯（有完整比分）和 `t2025.ts` 的第一届新人杯（只有名单）。

#### `ladder` —— 自由约战

`days` 里每场单挑写成 `[选手A, A得分, 选手B, B得分]`，战绩表会自动统计。参考 `t2026.ts` 的 Solo 杯。

### 名次、奖项与其它

- `placements`：最终名次。并列时 `rank` 相同；团队赛写 `team` 和 `players`。没有决出名次就留空数组，并在 `notes` 里说明。
- `awards`：`{ player, award: 'MVP' | 'EVP' }`。
- `reviews`：赛评，`{ title, score?, body }`。
- `participants` / `teams` / `staff`：报名名单、队伍、工作人员。

## 选手别名与头像

都在 [`src/data/players.ts`](./src/data/players.ts)。

**别名**：在 `ALIASES` 里以「标准展示名」为键，列出其它写法。只有大小写不同的写法不用列。

```ts
const ALIASES = {
  切尔茜: ['切尔茜总冠军'],
  Godyoull: ['Godyull', 'Godyoll'],
};
```

合并两个人之前请确认他们确实是同一位选手，并在 PR 里说明依据。

**头像**：

1. 把图片放进 `public/avatars/`，文件名用小写英文或拼音（如 `shaw.jpg`），建议 200×200 左右、100 KB 以内。**文件名不要带 QQ 号等个人信息。**
2. 在 `AVATARS` 里加一行 `标准展示名: '文件名（不带扩展名）'`。

没有头像的选手会显示首字占位，不影响使用。

## 年度榜单

在 [`src/data/rankings.ts`](./src/data/rankings.ts) 里按赛季维护：`board`（积分榜顺序）、`events`（每届赛事的积分规则与各人得分）、`bestPlayers`（年度评选）、`honors`（年度荣誉）。新赛季新建一个 `SeasonRanking` 并加入 `seasons` 数组。

## 改代码

也欢迎改进页面本身，请遵守几条约定，保证全站风格统一：

- 颜色、间距、圆角、字号、动效时长一律使用 `src/styles/tokens.css` 里的变量，不要写死颜色值（否则深色主题会出问题）。
- 出现选手名的地方用 `PlayerChip` / `PlayerList`，分数数字加 `className="num"`。
- 视觉上保持安静克制：不用发光、霓虹、大面积高饱和色；动效要轻，并尊重「减少动态效果」的系统设置。
- 新的赛制视图放在 `src/components/stages/`，并在 `StageView.tsx` 里登记。
- TypeScript 开了 `strict`，不要使用 `any`。

## 提交信息

用一句话说清楚做了什么即可，例如：

```
数据：补录第四届 Major 瑞士轮比分
修正：第一届天虹杯八组对三组的比分
选手：合并「爱梅斯」与「ams」
```
