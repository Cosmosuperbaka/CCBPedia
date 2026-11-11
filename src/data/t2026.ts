// 2026 年赛事数据。来源：第2届新人杯.docx、第二届LBC.docx、solo杯赛程.docx、数据统计表.xlsx、第三届新人杯截图。
import type { Duel, TeamDef, Tournament } from './types';
import { absent, carryLobby, lobby, match, names, teamSide } from './build';

// ───────────────────────── 第二届新人杯 ─────────────────────────

const rookie2: Tournament = {
  id: 'rookie-2',
  name: '第二届新人杯',
  series: 'rookie',
  edition: 2,
  mode: 'solo',
  start: '2026-01-09',
  end: '2026-01-11',
  status: 'aborted',
  tagline: '积分累计制瑞士轮：每轮得分加排名分一路带到底。十人决赛打到中途终止，奖金由十人平分。',
  formatTags: ['个人赛', '积分累计瑞士轮', '血战模式', '125 分赛点决赛'],
  rules: [
    '全程使用血战模式计分。瑞士轮阶段系统出题，淘汰赛阶段人工出题。',
    '系统出题范围为 1990–2025 年，每年 40 部，6 人物标签 + 6 作品标签，仅主角，10 次机会，45 秒。',
    '瑞士轮第一轮随机抽签，后续按积分分组（以 1-0 为例：积分第 1–4 与第 9–12 为一组，第 5–8 与第 13–16 为一组）。积分一直累计，不重置。',
    '第一、二轮：8 人一组，限时 30 分钟，40 分提前晋级，时间结束按分数取前四；分数转化为积分，并按排名加分（第一 +8，第二 +7，以此类推）。',
    '第三轮：2-0 与 0-2 不分组，1-1 分两组 8 人；50 分提前晋级，其余同上。',
    '第四轮：2-1 与 1-2 各分两组 6 人，限时 30 分钟，40 分提前晋级，取前三；排名加分第一 +6，以此类推。',
    '第五轮：2-2 分两组 6 人，不限时，40 分晋级，直至三人晋级。',
    '瑞士轮 3-0 直通决赛；3-1 与 3-2 进行单败淘汰赛：限时 40 分钟，3-1 晋级者开局 +10 分，70 分提前晋级，时间结束取前六。',
    '十人决赛采用赛点制，赛点为 125 分，开启赛点后第一位猜中者夺冠。',
  ],
  participants: [
    ...names('断念 一起失眠 虎纹鲲 Godyoull 鸡 俺是一头猪 Ishmael nassu Eleseven Lenaa 龙玉涛'),
    ...names("孤门一辉 花园 水映天虹 arisu 铁桶sa'ma 云霄 安格 Wheatley 御宅导师 CC WolfsRevenge"),
    ...names('爱牛的神子 金风叽叽叽 zc 米浴 新条茜 非也非也 小人牛勿 佐藤ひろし 十二叶 淮南皓月 Ral'),
  ],
  stages: [
    {
      kind: 'swiss',
      title: '瑞士轮',
      desc: '每行为「带入积分 + 本轮得分 + 排名加分」。带入积分按原始记录填写，个别与上一轮结算值略有出入。',
      rounds: [
        {
          title: '第一轮',
          date: '2026-01-09',
          pools: [
            {
              record: '0-0',
              lobbies: [
                lobby(
                  'A 组',
                  [['鸡', 29, 8], ['云霄', 25, 7], ['arisu', 22, 6], ['虎纹鲲', 20, 5], ['十二叶', 5, 4], ['CC', 0, 3], ['Lenaa', 0, 2], ['花园', 0, 1]],
                  { advance: 4 },
                ),
                lobby(
                  'B 组',
                  [['龙玉涛', 33, 8], ['nassu', 32, 7], ['Oblivionis', 27, 6], ['安格', 26, 5], ['断念', 4, 4], ['Godyoull', 4, 3], absent('金风叽叽叽'), absent("铁桶sa'ma")],
                  { advance: 4 },
                ),
                lobby(
                  'C 组',
                  [
                    ['Ishmael', 39, 8],
                    ['淮南皓月', 38, 7],
                    ['zc', 34, 6],
                    ['米浴', 28, 5],
                    ['Wheatley', 19, 4],
                    ['非也', 15, 3],
                    ['水映天虹', 14, 2],
                    ['ral', 0, { bonus: 1, note: '小人牛勿缺席，补位出场' }],
                  ],
                  { advance: 4 },
                ),
                lobby(
                  'D 组',
                  [['俺是一头猪', 38, 8], ['新条茜', 31, 7], ['WolfsRevenge', 20, 6], ['孤门一辉', 13, 5], ['Eleseven', 9, 4], ['佐藤ひろし', 5, 3], ['一起失眠', 0, 2], ['御宅导师', 0, 1]],
                  { advance: 4 },
                ),
              ],
            },
          ],
        },
        {
          title: '第二轮',
          date: '2026-01-09',
          pools: [
            {
              record: '1-0',
              lobbies: [
                carryLobby(
                  'A 组',
                  [['Oblivionis', 33, 47, 8], ['淮南皓月', 45, 38, 7], ['安格', 33, 38, 6], ['俺是一头猪', 46, 35, 5], ['云霄', 32, 33, 4], ['龙玉涛', 41, 29, 3], ['Ishmael', 47, 25, 2], ['米浴', 33, 7, 1]],
                  { advance: 4 },
                ),
                carryLobby(
                  'B 组',
                  [['WolfsRevenge', 26, 45, 8], ['nassu', 39, 45, 7], ['鸡', 37, 42, 6], ['arisu', 28, 41, 5], ['zc', 40, 38, 4], ['虎纹鲲', 25, 37, 3], ['新条茜', 38, 23, 2], ['孤门一辉', 18, 17, 1]],
                  { advance: 4 },
                ),
              ],
            },
            {
              record: '0-1',
              lobbies: [
                {
                  ...carryLobby('A 组', [['水映天虹', 16, 31, 8], ['Eleseven', 13, 28, 7], ['一起失眠', 2, 19, 6], ['非也', 18, 19, 5], ['CC', 3, 18, 4], ['Wheatley', 23, 6, 3]], {
                    advance: 4,
                  }),
                },
                carryLobby('B 组', [['Godyoull', 7, 33, 8], ['ral', 1, 28, 7], ['断念', 8, 20, 6], ['Yi', 0, 19, 5], ['十二叶', 9, 13, 4]], { advance: 4 }),
              ],
            },
          ],
        },
        {
          title: '第三轮',
          date: '2026-01-09',
          desc: '2-0 组于 1 月 9 日进行，1-1 组于 1 月 10 日进行。',
          pools: [
            {
              record: '2-0',
              lobbies: [
                carryLobby(
                  undefined,
                  [['鸡', 85, 40, 8], ['Oblivionis', 88, 39, 7], ['安格', 77, 32, 6], ['淮南皓月', 90, 28, 5], ['俺是一头猪', 86, 26, 4], ['nassu', 91, 18, 3], ['WolfsRevenge', 79, 16, 2], ['arisu', 74, 16, 1]],
                  { advance: 4 },
                ),
              ],
            },
            {
              record: '1-1',
              lobbies: [
                carryLobby(
                  'A 组',
                  [
                    ['zc', 82, 27, 8],
                    ['龙玉涛', 73, 26, 7],
                    ['云霄', 69, 24, 6],
                    ['Ishmael', 74, 21, 5],
                    ['米浴', 41, 15, 4],
                    ['Godyoull', 48, 8, 3],
                    ['非也', 42, undefined, undefined, { status: 'absent' }],
                    ['孤门一辉', 36, undefined, undefined, { status: 'absent' }],
                  ],
                  { advance: 4 },
                ),
                carryLobby(
                  'B 组',
                  [
                    ['虎纹鲲', 65, 45, 8],
                    ['水映天虹', 55, 41, 7],
                    ['新条茜', 63, 32, 6],
                    ['Eleseven', 48, 32, 5],
                    ['ral', 36, 0, 0],
                    ['断念', 34, 0, 0],
                    ['Yi', 24, 0, 0],
                    ['一起失眠', 27, undefined, undefined, { status: 'absent' }],
                  ],
                  { advance: 4 },
                ),
              ],
            },
            {
              record: '0-2',
              note: '人数不齐，到场选手无需比赛直接晋级。',
              lobbies: [
                carryLobby(undefined, [
                  ['wheatly', 32, undefined, undefined, { status: 'advance' }],
                  ['十二叶', 26, undefined, undefined, { status: 'advance' }],
                  ['CC', 25, undefined, undefined, { status: 'advance' }],
                  ['佐藤ひろし', 9, undefined, undefined, { status: 'advance' }],
                ]),
              ],
            },
          ],
          outcomes: [
            {
              record: '3-0',
              kind: 'advance',
              label: '直通决赛',
              rows: [
                { name: 'Oblivionis', total: 134 },
                { name: '鸡', total: 133 },
                { name: '淮南皓月', total: 123 },
                { name: '安格', total: 115 },
              ],
            },
            {
              record: '0-3',
              kind: 'out',
              label: '淘汰（缺席）',
              rows: names('Lenaa 花园 御宅导师 小人牛勿 金风叽叽叽').map((name) => ({ name })),
            },
          ],
        },
        {
          title: '第四轮',
          date: '2026-01-10',
          pools: [
            {
              record: '2-1',
              lobbies: [
                carryLobby(
                  'A 组',
                  [['云霄', 107, 36, 6], ['虎纹鲲', 118, 33, 5], ['俺是一头猪', 116, 24, 4], ['zc', 114, 20, 3], ['水映天虹', 103, 11, 2], ['新条茜', 101, 5, 1]],
                  { advance: 3 },
                ),
                carryLobby(
                  'B 组',
                  [['nassu', 112, 41, 6], ['Ishmael', 109, 38, 5], ['WolfsRevenge', 97, 34, 4], ['arisu', 91, 22, 3], ['Eleseven', 85, 14, 2], ['龙玉涛', 112, 0, 1]],
                  { advance: 3 },
                ),
              ],
            },
            {
              record: '1-2',
              lobbies: [
                carryLobby(
                  undefined,
                  [
                    ['米浴', 60, 48, 8],
                    ['ral', 36, 47, 7],
                    ['一起失眠', 27, 42, 6],
                    ['Godyoull', 65, 41, 5],
                    ['十二叶', 26, 37, 4],
                    ['wheatly', 32, 33, 3],
                    ['断念', 34, 25, 2],
                    ['CC', 25, 0, 0],
                    ['非也', 42, undefined, undefined, { status: 'absent' }],
                    ['孤门一辉', 36, undefined, undefined, { status: 'absent' }],
                    ['Yi', 24, undefined, undefined, { status: 'absent' }],
                    ['佐藤ひろし', 9, undefined, undefined, { status: 'absent' }],
                  ],
                  { advance: 6 },
                ),
              ],
            },
          ],
          outcomes: [
            {
              record: '3-1',
              kind: 'advance',
              label: '晋级淘汰赛',
              rows: [
                { name: 'nassu', total: 159 },
                { name: '虎纹鲲', total: 156 },
                { name: 'Ishmael', total: 152 },
                { name: '云霄', total: 149 },
                { name: '俺是一头猪', total: 144 },
                { name: 'WolfsRevenge', total: 135 },
              ],
            },
            {
              record: '1-3',
              kind: 'out',
              label: '淘汰',
              rows: [
                { name: '断念', total: 61 },
                { name: '非也', total: 42 },
                { name: '孤门一辉', total: 36 },
                { name: 'CC', total: 25 },
                { name: 'Yi', total: 24 },
                { name: '佐藤ひろし', total: 9 },
              ],
            },
          ],
        },
        {
          title: '第五轮',
          date: '2026-01-10',
          pools: [
            {
              record: '2-2',
              lobbies: [
                carryLobby(
                  'A 组',
                  [['arisu', 116, 43, 6], ['Godyoull', 111, 42, 5], ['zc', 137, 40, 4], ['Eleseven', 101, 35, 3], ['ral', 90, 27, 2], ['水映天虹', 116, 21, 1]],
                  { advance: 3 },
                ),
                carryLobby(
                  'B 组',
                  [['新条茜', 107, 37, 6], ['龙玉涛', 113, 33, 5], ['十二叶', 67, 21, 4], ['米浴', 116, 15, 3], ['一起失眠', 75, 9, 2], ['wheatly', 68, 9, 1]],
                  { advance: 3 },
                ),
              ],
            },
          ],
          outcomes: [
            {
              record: '3-2',
              kind: 'advance',
              label: '晋级淘汰赛',
              rows: [
                { name: 'zc', total: 181 },
                { name: 'arisu', total: 165 },
                { name: 'Godyoull', total: 158 },
                { name: '龙玉涛', total: 151 },
                { name: '新条茜', total: 150 },
                { name: '十二叶', total: 92 },
              ],
            },
            {
              record: '2-3',
              kind: 'out',
              label: '淘汰',
              rows: [
                { name: 'Eleseven', total: 139 },
                { name: '水映天虹', total: 138 },
                { name: '米浴', total: 134 },
                { name: 'ral', total: 119 },
                { name: '一起失眠', total: 86 },
                { name: 'Wheatly', total: 78 },
              ],
            },
          ],
        },
      ],
    },
    {
      kind: 'lobbies',
      title: '单败淘汰赛',
      date: '2026-01-11',
      desc: '3-1 与 3-2 共 12 人同场，限时 40 分钟，3-1 晋级者开局 +10 分，取前六进入决赛。',
      lobbies: [
        lobby(
          '淘汰赛',
          [
            ['云霄', 79],
            ['WolfsRevenge', 78],
            ['Ishmael', 71],
            ['nassu', 70],
            ['龙玉涛', 64],
            ['俺是一头猪', 57],
            ['zc', 39],
            ['arisu', 31],
            ['Godyoull', 30],
            ['十二叶', 23],
            ['新条茜', 21],
            ['虎纹鲲', 10, { status: 'absent' }],
          ],
          { advance: 6 },
        ),
      ],
    },
    {
      kind: 'lobbies',
      title: '决赛',
      date: '2026-01-11',
      desc: '赛点 125 分。比赛中途终止，以下为终止时的分数，不计最终名次。',
      lobbies: [
        lobby(
          '十人决赛（中途终止）',
          [['Oblivionis', 93], ['云霄', 78], ['Ishmael', 78], ['nassu', 77], ['安格', 73], ['鸡', 71], ['WolfsRevenge', 56], ['俺是一头猪', 39], ['龙玉涛', 33], ['淮南皓月', 19]],
          { note: '由于比赛中途终止，奖金最终由十人平分，每人 30。' },
        ),
      ],
    },
  ],
  placements: [],
  notes: ['决赛中途终止，本届不设最终名次；奖金由决赛十人平分，每人 30。'],
};

// ───────────────────────── 第二届 LBC ─────────────────────────

const lbc2Teams: TeamDef[] = [
  { name: '一组', players: ['玩设备', 'akizawa', '阿赵'] },
  { name: '二组', players: ['安格', '绫依骑士', 'shaw'] },
  { name: '三组', players: ['切尔茜', '水映天虹', '新条茜'] },
  { name: '四组', players: ['lese', '顶碗人', 'gura'] },
  { name: '五组', players: ['Ishmael', '姜姜大当家', '非也非也'] },
];
const [L1, L2, L3, L4, L5] = lbc2Teams.map(teamSide);

const lbc2: Tournament = {
  id: 'lbc-2',
  name: '第二届 LBC',
  series: 'lbc',
  edition: 2,
  mode: 'team',
  start: '2026-02-01',
  end: '2026-03-14',
  status: 'finished',
  tagline: '改为三人组队：五队单循环后四强打 BO3。小组第三的五组连克四组、一组，逆袭夺冠。',
  formatTags: ['三人组队', '单循环 BO1', '淘汰赛 BO3', '30 分赛点制'],
  rules: [
    '小组赛：五支队伍打单循环 BO1，一天两场共五天。小组前四晋级淘汰赛，第五淘汰。',
    '淘汰赛：全程 BO3，每一把选手可要求中场休息 10 分钟，一天一场。小组第一对第四、第二对第三；之后两支负者打季军赛，胜者打决赛。',
    '计分：不限时，同步模式 + 血战模式，手动计分。先猜中的队伍 +3 分，后猜中的队伍 +2 分，仅猜中作品 +1 分。',
    '30 分赛点制：到达 30 分开启赛点，之后先猜中角色的一方获胜。',
  ],
  teams: lbc2Teams,
  stages: [
    {
      kind: 'roundRobin',
      title: '小组赛',
      desc: '一组与三组同为 1-3，因胜负关系（一组胜三组）一组排第四、三组排第五。',
      teams: [L1, L2, L3, L4, L5],
      matches: [
        match(L2, L4, [[34, 25]], { date: '2026-02-01' }),
        match(L3, L5, [[20, 33]], { date: '2026-02-01' }),
        match(L1, L2, [[29, 35]], { date: '2026-02-02' }),
        match(L4, L5, [[34, 20]], { date: '2026-02-02' }),
        match(L2, L5, [[38, 28]], { date: '2026-02-03' }),
        match(L1, L3, [[35, 32]], { date: '2026-02-03' }),
        match(L1, L4, [], { date: '2026-02-04', winner: 'b', result: 'forfeit' }),
        match(L2, L3, [], { date: '2026-02-04', winner: 'b', result: 'forfeit' }),
        match(L1, L5, [[31, 37]], { date: '2026-02-05' }),
        match(L3, L4, [[24, 35]], { date: '2026-02-05' }),
      ],
      standings: [
        { name: '二组', win: 3, loss: 1, status: 'advance' },
        { name: '四组', win: 3, loss: 1, status: 'advance' },
        { name: '五组', win: 2, loss: 2, status: 'advance' },
        { name: '一组', win: 1, loss: 3, status: 'advance', note: '胜负关系优于三组' },
        { name: '三组', win: 1, loss: 3, status: 'out' },
      ],
    },
    {
      kind: 'bracket',
      title: '淘汰赛',
      desc: '全程 BO3。',
      tracks: [
        {
          rounds: [
            {
              title: '半决赛',
              matches: [
                match(L4, L5, [[34, 35], [34, 35]], { bestOf: 3, date: '2026-02-06' }),
                match(L1, L2, [[34, 31], [25, 33], [34, 34, 'a']], { bestOf: 3, date: '2026-02-07' }),
              ],
            },
            {
              title: '决赛 / 季军赛',
              matches: [
                match(L1, L5, [[30, 35], [38, 31], [30, 36]], { bestOf: 3, date: '2026-03-14', label: '决赛' }),
                match(L2, L4, [[25, 35], [22, 35]], { bestOf: 3, date: '2026-02-14', label: '季军赛' }),
              ],
            },
          ],
        },
      ],
    },
  ],
  placements: [
    { rank: 1, label: '冠军', team: '五组', players: ['Ishmael', '姜姜大当家', '非也非也'] },
    { rank: 2, label: '亚军', team: '一组', players: ['玩设备', 'Akizawa', '阿赵'] },
    { rank: 3, label: '季军', team: '四组', players: ['lese', '顶碗人', 'gura'] },
    { rank: 4, label: '殿军', team: '二组', players: ['安格', '绫依骑士', 'Shaw'] },
    { rank: 5, label: '第五', team: '三组', players: ['切尔茜', '水映天虹', '新条茜'], note: '小组赛出局' },
  ],
};

// ───────────────────────── Solo 杯 ─────────────────────────

const d = (a: string, sa: number, b: string, sb: number): Duel => [a, sa, b, sb];
const OLD = '老资历组';
const NEW = '小资历组';

const solo1: Tournament = {
  id: 'solo-1',
  name: 'Solo 杯',
  series: 'solo',
  edition: 1,
  mode: 'solo',
  start: '2026-06-13',
  end: '2026-06-18',
  status: 'finished',
  tagline: '六天自由约战的 1v1 单挑赛：分老资历、小资历两组，只记胜负不设冠军，按战绩发放奖金。',
  formatTags: ['个人赛', '1v1 单挑', '自由约战', '分组别'],
  rules: [
    '选手分为老资历组与小资历组，组内自由约战，每场为 1v1 单挑。',
    '单场先得 9 分者获胜（个别场次打到 10、11 分才分出胜负）。',
    '积分：胜一场 2 分，负一场 1 分。本赛事不设最终冠军，按战绩发放奖金。',
  ],
  staff: [{ role: '裁判席', names: ['新条茜', '鸡', '老鸨', '75sp'] }],
  stages: [
    {
      kind: 'ladder',
      title: '全部对局',
      divisions: [
        {
          name: OLD,
          idle: ['澄梦crystal'],
          rewards: { shaw: 30, 俺是一头猪: 20, 切尔茜: 10, Godyoull: 15, nassu: 30, lese: 30, 云霄: 10, 吴织亚切: 10, Ishmael: 30, Yukiyra: 30 },
        },
        {
          name: NEW,
          idle: ['shiroha', '黑川', '浩瀚佰仟'],
          rewards: {
            林陌: 20,
            Avi: 30,
            十二叶: 10,
            EZ: 30,
            MRzixi: 10,
            'Recalling the past': 30,
            被带飞的托雷那桑: 30,
            正义联盟: 30,
            luanma: 15,
            WolfsRevenge: 30,
            sugarlovesalt: 20,
            冷叶: 10,
            淮南皓月: 15,
          },
        },
      ],
      days: [
        {
          date: '6.13',
          division: NEW,
          duels: [
            d('Wolfsrevenge', 9, '正义联盟', 8),
            d('林陌', 8, '被带飞的托雷纳桑', 9),
            d('Luanma', 5, 'EZ', 9),
            d('十二叶', 7, '林陌', 9),
            d('绫依骑士', 2, 'Avi', 9),
            d('Avi', 9, 'luanma', 3),
            d('Recalling the past', 9, 'sugarlovesalt', 5),
            d('林陌', 9, '真令', 0),
            d('林陌', 9, 'mono熊', 4),
            d('十二叶', 7, 'Avi', 9),
          ],
        },
        {
          date: '6.13',
          division: OLD,
          duels: [
            d('Lese', 9, 'godyull', 3),
            d('Nassu', 9, 'yukiyra', 8),
            d('切尔茜', 9, '奶龙', 8),
            d('shaw', 3, '猪', 9),
            d('Lese', 9, 'is', 7),
            d('Yukiyra', 9, '吴织亚切', 7),
            d('lese', 9, '云霄', 4),
          ],
        },
        {
          date: '6.14',
          division: OLD,
          duels: [
            d('Lese', 11, '吴织亚切', 10),
            d('Lese', 9, 'yukiyra', 2),
            d('Lese', 6, '俺是一头猪', 9),
            d('奶龙', 6, 'yukiyra', 9),
            d('Shaw', 9, 'yukiyra', 2),
            d('奶龙', 4, 'lese', 9),
            d('云霄', 7, 'yukiyra', 9),
            d('Shaw', 10, 'lese', 9),
          ],
        },
        {
          date: '6.14',
          division: NEW,
          duels: [
            d('被带飞的拖累那桑', 9, 'eleseven', 2),
            d('MRzixi', 7, 'sugarlovesalt', 9),
            d('Eleseven', 1, 'MRzixi', 9),
            d('天虹', 4, 'Avi', 9),
            d('被带飞的拖累那桑', 4, 'Recalling the past', 9),
            d('十二叶', 9, 'sugarlovesalt', 4),
            d('Avi', 9, 'eleseven', 4),
            d('被带飞的拖累那桑', 9, 'MRzixi', 4),
            d('真令', 3, 'sugarlovesalt', 9),
            d('正义联盟', 9, '十二叶', 7),
            d('Eleseven', 4, 'luanma', 9),
            d('MRzixi', 7, 'Avi', 9),
            d('淮南皓月', 6, '冷叶', 9),
            d('Recalling the past', 9, '林陌', 5),
            d('被带飞的拖累那桑', 9, 'Jack frost', 3),
          ],
        },
        {
          date: '6.15',
          division: OLD,
          duels: [
            d('Ishmael', 9, '切尔茜', 5),
            d('Shaw', 9, 'Godyoll', 6),
            d('Yukiyra', 9, '切尔茜', 7),
            d('云霄', 4, 'shaw', 9),
            d('Nassu', 8, 'shaw', 9),
            d('Lese', 9, 'nassu', 3),
            d('俺是一头猪', 9, 'Yukiyra', 2),
            d('俺是一头猪', 4, 'nassu', 9),
            d('Ishmael', 9, 'Yukiyra', 3),
            d('Shaw', 9, 'Ishmael', 10),
          ],
        },
        {
          date: '6.15',
          division: NEW,
          duels: [d('EZ', 8, 'wolfsrevenge', 9), d('林陌', 0, 'wolfsrenvenge', 9)],
        },
        {
          date: '6.16',
          division: OLD,
          duels: [d('切尔茜', 3, 'lese', 9), d('云霄', 9, '切尔茜', 8), d('云霄', 7, 'Ishmael', 9), d('云霄', 6, 'nassu', 9)],
        },
        {
          date: '6.16',
          division: NEW,
          duels: [
            d('EZ', 9, '淮南皓月', 4),
            d('Sugarlovesalt', 9, 'Avi', 7),
            d('Wolfsrevenge', 9, '本', 1),
            d('Luanma', 9, '风痕', 3),
            d('Recalling the past', 7, 'EZ', 9),
            d('Recalling the past', 7, 'wolfsrenvenge', 9),
            d('Recalling the past', 9, 'luanma', 5),
          ],
        },
        {
          date: '6.17 – 6.18',
          division: OLD,
          duels: [
            d('Shaw', 9, '顶碗人', 3),
            d('Shaw', 9, '吴织亚切', 4),
            d('Shaw', 9, '奶龙', 3),
            d('Nassu', 9, '奶龙', 2),
            d('奶龙', 5, 'Ishmael', 9),
            d('Godyull', 5, 'Yukiyra', 9),
            d('Godyull', 5, 'Ishmael', 9),
            d('Godyull', 9, '切尔茜', 5),
            d('吴织亚切', 9, 'Godyull', 8),
            d('Nassu', 9, 'Godyull', 4),
            d('云霄', 4, 'Godyull', 9),
            d('Nassu', 9, 'ishmael', 5),
            d('Lese', 9, '顶碗人', 3),
            d('Ishmael', 9, '俺是一头猪', 3),
          ],
        },
        {
          date: '6.17 – 6.18',
          division: NEW,
          duels: [
            d('水映天虹', 8, '淮南皓月', 9),
            d('被带飞的拖累那桑', 9, 'sugarlovesalt', 5),
            d('Eleseven', 7, '淮南皓月', 9),
            d('正义联盟', 9, 'Recalling the past', 5),
            d('正义联盟', 9, 'sugarlovesalt', 6),
            d('被带飞的托雷纳桑', 9, '淮南皓月', 2),
            d('被带飞的托雷纳桑', 8, '正义联盟', 9),
            d('被带飞的托雷纳桑', 9, 'EZ', 8),
            d('正义联盟', 7, 'EZ', 9),
            d('EZ', 9, 'eleseven', 2),
            d('Eleseven', 3, '正义联盟', 9),
            d('EZ', 9, '水映天虹', 6),
            d('Wolfsrevenge', 9, 'sugarlovesalt', 4),
            d('淮南皓月', 3, 'recalling the past', 9),
          ],
        },
      ],
    },
  ],
  placements: [],
  notes: ['Solo 杯为自由约战，只统计胜负与积分，不设最终冠军。'],
};

// ───────────────────────── 第三届新人杯 ─────────────────────────

const rookie3: Tournament = {
  id: 'rookie-3',
  name: '第三届新人杯',
  series: 'rookie',
  edition: 3,
  mode: 'solo',
  start: '2026-11-01',
  dateNote: '2026 · 日期待补',
  status: 'finished',
  tagline: '三个小组打完直接会师十人决赛：小组前二带着 +10 分优势出战，Octeven 打到 95 分提前锁定冠军。',
  formatTags: ['个人赛', '小组赛', '十人决赛', '100 分制'],
  rules: [
    '小组赛分三组，系统计分。每组前二直通决赛；第三至第五名原定还要再打一轮淘汰赛。',
    '由于到场人数不足，淘汰赛取消，晋级选手直接进入决赛；直通者的优势改为决赛开局 +10 分。',
    '决赛为纯计分的 100 分制：小组前二自带 +10 分，因此打到 95 分即视为 105 分、比赛结束。',
    '3 组比其它组多打了题，多得的分数已扣回。',
  ],
  staff: [
    { role: '小组赛房主', names: ['鲁迪'] },
    { role: '决赛房主', names: ['爱吃棒棒糖'] },
  ],
  stages: [
    {
      kind: 'lobbies',
      title: '小组赛',
      desc: '每组前二直通决赛（决赛 +10 分），第三至第五名晋级。3 组为「原始分 − 多打题目的得分」。',
      lobbies: [
        lobby('1 组', [
          ['Octeven', 84, { status: 'direct' }],
          ['akl', 67, { status: 'direct' }],
          ['风痕', 36, { status: 'advance' }],
          ['Asahi', 34, { status: 'advance' }],
          ['megumin', 22, { status: 'advance' }],
          ['雪梨', 19, { status: 'out' }],
        ]),
        lobby('2 组', [
          ['arisu', 70, { status: 'direct' }],
          ['神尾观灯', 59, { status: 'direct' }],
          ['Godyoull', 55, { status: 'advance' }],
          ['ez', 52, { status: 'advance' }],
          ['和栗蒙布朗', 26, { status: 'advance' }],
          ['叽里咕噜', 20, { status: 'out' }],
          ['MY-N1GHTMARE', 14, { status: 'out' }],
        ]),
        lobby('3 组', [
          ['愛城華戀', 80, { deduct: 8, status: 'direct' }],
          ['不死之烟', 63, { status: 'direct' }],
          ['林陌', 63, { deduct: 7, status: 'advance' }],
          ['新条茜1', 48, { status: 'advance' }],
          ['十二叶', 35, { deduct: 2, status: 'advance' }],
          ['纷纷落落', 31, { status: 'out' }],
          ['Eleseven', 31, { deduct: 6, status: 'out' }],
          ['炎墨', 23, { deduct: 4, status: 'out' }],
        ]),
      ],
    },
    {
      kind: 'lobbies',
      title: '决赛',
      desc: '100 分制。小组前二带 +10 分出战；晋级的九人中只有四人到场，决赛共十人。',
      lobbies: [
        lobby('十人决赛', [
          ['Octeven', 95, { bonus: 10, status: 'champion' }],
          ['不死之烟', 65, { bonus: 10 }],
          ['Godyoull', 71],
          ['arisu', 52, { bonus: 10 }],
          ['愛城華戀', 40, { bonus: 10 }],
          ['akl', 31, { bonus: 10 }],
          ['新条茜1', 40],
          ['神尾观灯', 26, { bonus: 10 }],
          ['林陌', 17],
          ['Asahi', 0],
        ]),
      ],
    },
  ],
  placements: [
    { rank: 1, label: '冠军', players: ['Octeven'], score: 105, note: '决赛 95 分 + 直通 10 分' },
    { rank: 2, label: '亚军', players: ['不死之烟'], score: 75, note: '决赛 65 分 + 直通 10 分' },
    { rank: 3, label: '季军', players: ['Godyoull'], score: 71 },
    { rank: 4, label: '殿军', players: ['arisu'], score: 62, note: '决赛 52 分 + 直通 10 分' },
    { rank: 5, label: '第五', players: ['愛城華戀'], score: 50, note: '决赛 40 分 + 直通 10 分' },
    { rank: 6, label: '第六', players: ['akl'], score: 41, note: '决赛 31 分 + 直通 10 分' },
    { rank: 7, label: '第七', players: ['新条茜1'], score: 40 },
    { rank: 8, label: '第八', players: ['神尾观灯'], score: 36, note: '决赛 26 分 + 直通 10 分' },
    { rank: 9, label: '第九', players: ['林陌'], score: 17 },
    { rank: 10, label: '第十', players: ['Asahi'], score: 0 },
  ],
};

export const tournaments2026: Tournament[] = [rookie2, lbc2, solo1, rookie3];
