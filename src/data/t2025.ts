// 2025 年赛事数据。来源：CCB-HOF 的 MatchHistory / ScoreLeaderboard 记录。
import type { TeamDef, Tournament } from './types';
import { lobby, match, names, side } from './build';

// ───────────────────────── 第一届 Major ─────────────────────────

const major1: Tournament = {
  id: 'major-1',
  name: '第一届 Major',
  series: 'major',
  edition: 1,
  mode: 'solo',
  start: '2025-06-20',
  status: 'finished',
  tagline: '猜猜呗的第一场正式赛事，29 人同场混战，SevenTen 以 42 分拿下首冠。',
  formatTags: ['个人赛', '多人混战'],
  participants: [
    ...names('Hobaka 琪露诺 正义联盟DCAT 淮南皓月 sh1ro WTDER 故障机器人'),
    ...names('阿赵 710 云霄 躁狂 郊眠寺 澄梦Crystal 抹茶巴菲 一个人吃饭'),
    ...names('czjun youmu 俾斯麦 凉 rany lese 谁去 TuSHx39 xwwwx'),
    ...names('rikka 乐乐 纱雾 遠野しき yanmuzhi'),
  ],
  stages: [
    {
      kind: 'lobbies',
      title: '决赛',
      date: '2025-06-20',
      desc: '本届只留下了前四名的分数记录。',
      lobbies: [
        lobby('决赛', [
          ['SevenTen', 42, { status: 'champion' }],
          ['阿赵', 26],
          ['xwwwx', 17],
          ['中华小当家', 17],
        ]),
      ],
    },
  ],
  placements: [
    { rank: 1, label: '冠军', players: ['SevenTen'], score: 42 },
    { rank: 2, label: '亚军', players: ['阿赵'], score: 26 },
    { rank: 3, label: '季军', players: ['xwwwx'], score: 17 },
    { rank: 3, label: '季军', players: ['中华小当家'], score: 17 },
  ],
};

// ───────────────────────── 第二届 Major ─────────────────────────

const major2: Tournament = {
  id: 'major-2',
  name: '第二届 Major',
  series: 'major',
  edition: 2,
  mode: 'solo',
  start: '2025-07-19',
  end: '2025-07-20',
  status: 'finished',
  tagline: '首次引入瑞士轮：18 人突围后分两组打淘汰赛，Shin\'on 在十人决赛中以 53 分登顶。',
  formatTags: ['个人赛', '瑞士轮', '淘汰赛房间', '十人决赛'],
  stages: [
    {
      kind: 'lobbies',
      title: '瑞士轮 · 晋级名单',
      desc: '三胜晋级。本届只留下了各战绩的晋级名单，没有逐轮比分。',
      lobbies: [
        lobby('3-0 晋级', names('shaw 诗歌剧 hobaka 悠之空穹 素质人士')),
        lobby('3-1 晋级', [
          { name: '阿赵', note: '晋级后弃赛' },
          ...names('茅庐 RainbowGirl Yuk1 shinon V.'),
        ]),
        lobby('3-2 晋级', names('lese rikka 玩设备 鲁迪乌斯 shiki 琪露诺 qiu')),
      ],
    },
    {
      kind: 'lobbies',
      title: '淘汰赛',
      desc: '18 人分为 A、B 两组，每组前五进入决赛。只有晋级选手留下了分数。',
      lobbies: [
        lobby(
          'A 组',
          [['琪露诺', 27], ['shaw', 26], ['鲁迪乌斯', 26], ['素质人士', 25], ['V.', 24], '悠之空穹', '茅庐', 'Yuk1', 'rikka'],
          { advance: 5 },
        ),
        lobby(
          'B 组',
          [
            ['sh1ro', 26, { note: '瑞士轮 2-3，顶替弃赛的阿赵' }],
            ['hobaka', 25],
            ['shiki', 25],
            ['shinon', 24],
            ['lese', 23],
            '诗歌剧',
            'RainbowGirl',
            '玩设备',
            'qiu',
          ],
          { advance: 5 },
        ),
      ],
    },
    {
      kind: 'lobbies',
      title: '决赛',
      lobbies: [
        lobby('十人决赛', [
          ['shinon', 53, { status: 'champion' }],
          ['hobaka', 40],
          ['琪露诺', 36],
          ['V.', 21],
          ['shiki', 20],
          ['shaw', 13],
          ['sh1ro', 13],
          ['素质人士', 10],
          ['鲁迪乌斯', 3],
          ['lese', 3],
        ]),
      ],
    },
  ],
  placements: [
    { rank: 1, label: '冠军', players: ['shinon'], score: 53, note: '瑞士轮 3-1 · 淘汰赛 24 分' },
    { rank: 2, label: '亚军', players: ['hobaka'], score: 40, note: '瑞士轮 3-0 · 淘汰赛 25 分' },
    { rank: 3, label: '季军', players: ['琪露诺'], score: 36, note: '瑞士轮 3-2 · 淘汰赛 27 分' },
    { rank: 4, label: '殿军', players: ['V.'], score: 21, note: '瑞士轮 3-1 · 淘汰赛 24 分' },
    { rank: 5, label: '第五', players: ['shiki'], score: 20, note: '瑞士轮 3-2 · 淘汰赛 25 分' },
    { rank: 6, label: '第六', players: ['shaw'], score: 13, note: '瑞士轮 3-0 · 淘汰赛 26 分' },
    { rank: 6, label: '第六', players: ['sh1ro'], score: 13, note: '顶替阿赵 · 淘汰赛 26 分' },
    { rank: 8, label: '第八', players: ['素质人士'], score: 10, note: '瑞士轮 3-0 · 淘汰赛 25 分' },
    { rank: 9, label: '第九', players: ['鲁迪乌斯'], score: 3, note: '瑞士轮 3-2 · 淘汰赛 26 分' },
    { rank: 9, label: '第九', players: ['lese'], score: 3, note: '瑞士轮 3-2 · 淘汰赛 23 分' },
  ],
};

// ───────────────────────── 第三届 Major ─────────────────────────

const m3Teams: TeamDef[] = [
  { name: '一组', players: ['Sakuya', 'Sh1ro', 'Sugar'] },
  { name: '二组', alias: '老鸨组', players: ['Shaw', '云霄', '中华小当家'] },
  { name: '三组', players: ['gura', '淮南皓月', '保科明里'] },
  { name: '四组', players: ['lese', '水映天虹', '设备'] },
  { name: '五组', players: ['茅庐', '吴织亚切', '暦'] },
  { name: '六组', players: ['75sp', 'shinon', '新条茜'] },
  { name: '七组', players: ['切尔茜总冠军', '鲁迪乌斯', 'Ryo'] },
  { name: '八组', alias: '凉组', players: ['V.', '安格', '710'] },
];

const m3 = {
  g1: side('一组', 'Sakuya', 'Sh1ro', 'Sugar'),
  g2: side('二组', 'Shaw', '云霄', '中华小当家'),
  g3: side('三组', 'gura', '淮南皓月', '保科明里'),
  g4: side('四组', 'lese', '水映天虹', '设备'),
  g5: side('五组', '茅庐', '吴织亚切', '暦'),
  g6: side('六组', '75sp', 'shinon', '新条茜'),
  g7: side('七组', '切尔茜总冠军', '鲁迪乌斯', 'Ryo'),
  g8: side('八组', 'V.', '安格', '710'),
};

const major3: Tournament = {
  id: 'major-3',
  name: '第三届 Major',
  series: 'major',
  edition: 3,
  mode: 'team',
  start: '2025-08-11',
  end: '2025-08-19',
  status: 'finished',
  tagline: '首届三人组队赛：八支队伍双败淘汰，最后三队同场决战，老鸨组 104 分险胜夺冠。',
  formatTags: ['三人组队', '双败淘汰', 'BO3', '三队决赛'],
  cover: 'brand/poster.jpg',
  teams: m3Teams,
  stages: [
    {
      kind: 'bracket',
      title: '双败淘汰赛',
      desc: '全程 BO3。部分场次有替补出场，阵容以每场记录为准。',
      tracks: [
        {
          name: '胜者组',
          rounds: [
            {
              title: '第一轮',
              matches: [
                match(m3.g2, m3.g7, [[30, 20], [34, 22]], { bestOf: 3, date: '2025-08-11' }),
                match(m3.g8, m3.g4, [[34, 13], [30, 31, [4, 0]]], { bestOf: 3, date: '2025-08-12' }),
                match(m3.g6, m3.g5, [[35, 11], [33, 10]], { bestOf: 3, date: '2025-08-12' }),
                match(m3.g1, m3.g3, [[33, 17], [25, 33], [33, 27]], { bestOf: 3, date: '2025-08-13' }),
              ],
            },
            {
              title: '第二轮',
              matches: [
                match(m3.g8, side('六组', '阿赵', 'shinon', '新条茜'), [[27, 34], [33, 19], [30, 31, [4, 2]]], {
                  bestOf: 3,
                  date: '2025-08-15',
                }),
                match(m3.g2, side('一组', 'WTDER', 'Sh1ro', 'Sugar'), [[34, 10], [33, 18]], {
                  bestOf: 3,
                  date: '2025-08-16',
                }),
              ],
            },
          ],
        },
        {
          name: '败者组',
          rounds: [
            {
              title: '第一轮',
              matches: [
                match(m3.g3, m3.g5, [[34, 17], [34, 19]], { bestOf: 3, date: '2025-08-14' }),
                match(m3.g7, m3.g4, [[35, 28], [31, 33, [3, 4]], [33, 4]], { bestOf: 3, date: '2025-08-14' }),
              ],
            },
            {
              title: '第二轮',
              matches: [
                match(
                  side('六组', '75sp', 'shinon', 'gura'),
                  side('三组', 'lese', '淮南皓月', '保科明里'),
                  [[35, 12], [31, 32, [2, 4]], [34, 28]],
                  { bestOf: 3, date: '2025-08-17', note: '原始记录的大比分写作 2:0，按各图比分应为 2:1。' },
                ),
                match(m3.g7, m3.g1, [[34, 9], [36, 21]], { bestOf: 3, date: '2025-08-17' }),
              ],
            },
            {
              title: '第三轮',
              matches: [
                match(m3.g7, side('六组', 'gura', 'shinon', '新条茜'), [[35, 16], [34, 21]], {
                  bestOf: 3,
                  date: '2025-08-17',
                }),
              ],
            },
          ],
        },
      ],
    },
    {
      kind: 'lobbies',
      title: '决赛',
      date: '2025-08-19',
      desc: '胜者组两支队伍与败者组冠军三队同场决战。',
      lobbies: [
        lobby('三队决赛', [
          { name: '二组（老鸨组）', team: ['Shaw', '云霄', '中华小当家'], score: 104, status: 'champion' },
          { name: '七组', team: ['切尔茜总冠军', '鲁迪乌斯', 'Ryo'], score: 98 },
          { name: '八组（凉组）', team: ['V.', '安格', '710'], score: 97 },
        ]),
      ],
    },
  ],
  placements: [
    { rank: 1, label: '冠军', team: '二组（老鸨组）', players: ['Shaw', '云霄', '中华小当家'], score: 104 },
    { rank: 2, label: '亚军', team: '七组', players: ['切尔茜', '鲁迪乌斯', 'Ryo'], score: 98 },
    { rank: 3, label: '季军', team: '八组（凉组）', players: ['V.', '安格', 'SevenTen'], score: 97 },
    { rank: 4, label: '殿军', team: '六组', players: ["Shin'on", 'gura', '新条茜'], note: '败者组第三轮出局' },
  ],
  awards: [
    { player: 'Shaw', award: 'MVP' },
    { player: '中华小当家', award: 'EVP' },
    { player: '鲁迪乌斯', award: 'EVP' },
    { player: 'V.', award: 'EVP' },
    { player: "Shin'on", award: 'EVP' },
    { player: 'lese', award: 'EVP' },
  ],
};

// ───────────────────────── 第一届 MSI ─────────────────────────

const msi1: Tournament = {
  id: 'msi-1',
  name: '第一届 MSI',
  series: 'msi',
  edition: 1,
  mode: 'solo',
  start: '2025-08-22',
  end: '2025-08-23',
  status: 'finished',
  tagline: '四人邀请赛，双败赛制 1v1 单挑。V. 两度击败 Shin\'on，全胜夺冠。',
  formatTags: ['个人赛', '四人邀请', '双败淘汰', '1v1'],
  stages: [
    {
      kind: 'bracket',
      title: '双败淘汰赛',
      tracks: [
        {
          name: '胜者组',
          rounds: [{ title: '胜者组决赛', matches: [match('V.', 'Shinon', [[54, 49]])] }],
        },
        {
          name: '败者组',
          rounds: [
            { title: '第一轮', matches: [match('Hobaka', '中华小当家', [[54, 36]])] },
            { title: '第二轮', matches: [match('Shinon', 'Hobaka', [[34, 27]])] },
          ],
        },
        {
          name: '总决赛',
          rounds: [{ title: '决赛', matches: [match('V.', 'Shinon', [[35, 28]])] }],
        },
      ],
    },
  ],
  placements: [
    { rank: 1, label: '冠军', players: ['V.'] },
    { rank: 2, label: '亚军', players: ['Shinon'] },
    { rank: 3, label: '季军', players: ['Hobaka'] },
    { rank: 4, label: '殿军', players: ['中华小当家'] },
  ],
};

// ───────────────────────── 第一届 LBC（老鸨杯） ─────────────────────────

const lbc1: Tournament = {
  id: 'lbc-1',
  name: '第一届 LBC',
  series: 'lbc',
  edition: 1,
  mode: 'solo',
  start: '2025-09-06',
  end: '2025-09-13',
  status: 'finished',
  tagline: '老鸨杯首届：24 人双败房间制，胜者组与败者组各出五人会师决赛，琪露诺 65 分夺冠。',
  formatTags: ['个人赛', '双败房间制', '十人决赛'],
  stages: [
    {
      kind: 'lobbies',
      title: '胜者组第一轮',
      desc: '24 人分两组，每组前六进入胜者组决赛，其余落入败者组。',
      lobbies: [
        lobby('A 组', names('Voyage1969 gura 水映天虹 V. 75sp Akizawa 切尔茜总冠军 玩设备 琪露诺 中华小当家 吴织亚切 孤门一辉')),
        lobby('B 组', names('正义联盟DCAT Shaw WTDER 鲁迪乌斯 bernkastel Shinon lese 暦 sh1ro Hobaka SevenTen 安格')),
      ],
    },
    {
      kind: 'lobbies',
      title: '胜者组决赛',
      desc: '前五直通决赛，其余落入败者组决赛。',
      lobbies: [
        lobby('A 组晋级', names('V. 琪露诺 切尔茜总冠军 75sp 中华小当家 gura')),
        lobby('B 组晋级', names('Shaw 鲁迪乌斯 Shinon lese sh1ro 安格')),
      ],
    },
    {
      kind: 'lobbies',
      title: '败者组第一轮',
      lobbies: [
        lobby('A 组落入', names('Voyage1969 水映天虹 Akizawa 玩设备 吴织亚切 孤门一辉')),
        lobby('B 组落入', ['云霄', { name: 'WTDER', status: 'forfeit' }, 'bernkastel', '暦', 'Hobaka', 'SevenTen']),
      ],
    },
    {
      kind: 'lobbies',
      title: '败者组决赛',
      desc: '前五进入决赛。',
      lobbies: [
        lobby('胜者组决赛落入', names('sh1ro 安格 Shinon gura 中华小当家 Shaw 切尔茜总冠军')),
        lobby('败者组第一轮晋级', names('水映天虹 Akizawa 玩设备 吴织亚切 SevenTen')),
      ],
    },
    {
      kind: 'lobbies',
      title: '决赛',
      desc: '胜者组五人（琪露诺、75sp、鲁迪乌斯、V.、lese）与败者组五人（Shinon、Shaw、中华小当家、切尔茜、安格）同场。',
      lobbies: [
        lobby('十人决赛', [
          ['琪露诺', 65, { status: 'champion' }],
          ['鲁迪乌斯', 60],
          ['V.', 57],
          ['lese', 48],
          ['shaw', 43],
          ['切尔茜', 32],
          ['安格', 25],
          ['75sp', 23],
          ['Shinon', 21, { note: '中途感冒取药，未能打完' }],
          ['中华小当家', 19, { status: 'forfeit', note: '中途弃赛' }],
        ]),
      ],
    },
  ],
  placements: [
    { rank: 1, label: '冠军', players: ['琪露诺'], score: 65 },
    { rank: 2, label: '亚军', players: ['鲁迪乌斯'], score: 60 },
    { rank: 3, label: '季军', players: ['V.'], score: 57 },
    { rank: 4, label: '殿军', players: ['lese'], score: 48 },
    { rank: 5, label: '第五', players: ['shaw'], score: 43 },
    { rank: 6, label: '第六', players: ['切尔茜'], score: 32 },
    { rank: 7, label: '第七', players: ['安格'], score: 25 },
    { rank: 8, label: '第八', players: ['75sp'], score: 23 },
    { rank: 9, label: '第九', players: ['Shinon'], score: 21, note: '中途感冒取药，未能打完' },
    { rank: 10, label: '第十', players: ['中华小当家'], score: 19, note: '中途弃赛' },
  ],
};

// ───────────────────────── 第一届新人杯 ─────────────────────────

const rookie1: Tournament = {
  id: 'rookie-1',
  name: '第一届新人杯',
  series: 'rookie',
  edition: 1,
  mode: 'solo',
  start: '2025-09-19',
  end: '2025-09-21',
  status: 'finished',
  tagline: '面向新选手的 32 人瑞士轮：3-0 直通决赛，其余晋级者再打单败淘汰，JDG 55 分夺冠。',
  formatTags: ['个人赛', '瑞士轮', '单败淘汰房间', '十人决赛'],
  rules: [
    '32 人五轮瑞士轮，三胜晋级、三败淘汰。',
    '3-0 的四人直通决赛；3-1 与 3-2 共 12 人进行单败淘汰赛，其中 3-1 晋级者开局 +3 分。',
  ],
  stages: [
    {
      kind: 'swiss',
      title: '瑞士轮',
      desc: '本届只留下了每轮的分组名单，没有逐场比分。',
      rounds: [
        {
          title: '第一轮',
          pools: [
            {
              record: '0-0',
              lobbies: [
                lobby('A 组', names('十二叶 Alexander8000 魔法火蚁 北京JDG 凉 Yuk1 阿卡林 WTDER')),
                lobby('B 组', names('玩设备 Anchianae 贝卡丝忒 王 YzL 爱梅斯 珠贝 Graue')),
                lobby('C 组', names('七七子Megumi Asahi 顶碗人12138 孤门一辉 帅哥 灰心星人 唐三彩 知椿')),
                lobby('D 组', names('你去祭典了吧 龍 暦 Akizawa 吴织亚切 水映天虹 姜姜大当家 arisu')),
              ],
            },
          ],
        },
        {
          title: '第二轮',
          pools: [
            {
              record: '1-0',
              lobbies: [
                lobby('A 组', names('JDG 凉 Graue 玩设备 知椿 Asahi 你去祭典了吧 水映天虹')),
                lobby('B 组', names('魔法火蚁 WTDER bernkastel 爱梅斯 顶碗人 唐三彩 暦 吴织亚切')),
              ],
            },
            {
              record: '0-1',
              lobbies: [
                lobby('C 组', names('阿卡林 Alexander8000 珠贝 Anchianae 孤门一辉 灰心星人 龍 arisu')),
                lobby('D 组', names('Yuk1 十二叶 王 YzL 七七子Megumi 帅哥 Akizawa 姜姜大当家')),
              ],
            },
          ],
        },
        {
          title: '第三轮',
          pools: [
            {
              record: '2-0',
              lobbies: [lobby(undefined, names('JDG 凉 Asahi 你去祭典了吧 bernkastel 爱梅斯 顶碗人 吴织亚切'))],
            },
            {
              record: '1-1',
              lobbies: [
                lobby('A 组', names('龍 孤门一辉 帅哥 王 Akizawa 唐三彩 WTDER 水映天虹 知椿')),
                lobby('B 组', names('珠贝 arisu 姜姜大当家 YzL 魔法火蚁 暦 Graue 玩设备')),
              ],
            },
            {
              record: '0-2',
              lobbies: [lobby(undefined, names('阿卡林 Alexander8000 Anchianae 灰心星人 Yuk1 十二叶 七七子Megumi'))],
            },
          ],
          outcomes: [
            {
              record: '3-0',
              kind: 'advance',
              label: '直通决赛',
              rows: names('你去祭典了吧 凉 JDG 吴织亚切').map((name) => ({ name })),
            },
          ],
        },
        {
          title: '第四轮',
          pools: [
            {
              record: '2-1',
              lobbies: [
                lobby('A 组', names('爱梅斯 暦 WTDER 姜姜大当家 YzL 孤门一辉')),
                lobby('B 组', names('Asahi bernkastel 龍 顶碗人 知椿 玩设备')),
              ],
            },
            {
              record: '1-2',
              lobbies: [lobby(undefined, names('王 Akizawa 唐三彩 帅哥 水映天虹 珠贝 arisu 魔法火蚁 Graue Anchianae'))],
            },
          ],
          outcomes: [
            {
              record: '3-1',
              kind: 'advance',
              label: '晋级淘汰赛',
              rows: names('暦 ams 姜姜大当家 顶碗人 bernkastel 龍').map((name) => ({ name })),
            },
          ],
        },
        {
          title: '第五轮',
          pools: [
            {
              record: '2-2',
              lobbies: [
                lobby('A 组', names('WTDER 孤门一辉 玩设备 唐三彩 arisu Anchianae')),
                lobby('B 组', names('YzL Asahi 知椿 水映天虹 魔法火蚁 zont1x')),
              ],
            },
          ],
          outcomes: [
            {
              record: '3-2',
              kind: 'advance',
              label: '晋级淘汰赛',
              rows: names('玩设备 孤门一辉 Anchianae 魔法火蚁 zont1x 知椿').map((name) => ({ name })),
            },
          ],
        },
      ],
    },
    {
      kind: 'lobbies',
      title: '单败淘汰赛',
      desc: '3-1 与 3-2 共 12 人同场，3-1 晋级者开局 +3 分，前六进入决赛。未留下比分。',
      lobbies: [
        lobby('淘汰赛', [
          ...names('姜姜大当家 ams 玩设备 暦 顶碗人 知椿').map((name) => ({ name, status: 'advance' as const })),
          ...names('bernkastel 龍 孤门一辉 Anchianae 魔法火蚁 zont1x').map((name) => ({ name, status: 'out' as const })),
        ]),
      ],
    },
    {
      kind: 'lobbies',
      title: '决赛',
      lobbies: [
        lobby('十人决赛', [
          ['JDG', 55, { status: 'champion' }],
          ['姜姜大当家', 51],
          ['爱梅斯', 38],
          ['吴织亚切', 31],
          ['你去祭典了吧', 27],
          ['玩设备', 24],
          ['暦', 19],
          ['顶碗人', 14],
          ['知椿', 12],
          ['凉', 9],
        ]),
      ],
    },
  ],
  placements: [
    { rank: 1, label: '冠军', players: ['JDG'], score: 55 },
    { rank: 2, label: '亚军', players: ['姜姜大当家'], score: 51 },
    { rank: 3, label: '季军', players: ['爱梅斯'], score: 38 },
    { rank: 4, label: '殿军', players: ['吴织亚切'], score: 31 },
    { rank: 5, label: '第五', players: ['你去祭典了吧'], score: 27 },
    { rank: 6, label: '第六', players: ['玩设备'], score: 24 },
    { rank: 7, label: '第七', players: ['暦'], score: 19 },
    { rank: 8, label: '第八', players: ['顶碗人'], score: 14 },
    { rank: 9, label: '第九', players: ['知椿'], score: 12 },
    { rank: 10, label: '第十', players: ['凉'], score: 9 },
  ],
};

// ───────────────────────── 第一届天虹杯 ─────────────────────────

const thTeams: TeamDef[] = [
  { name: '一组', players: ['琪露诺', 'Ryo', '凉'] },
  { name: '二组', players: ['SevenTen', '云霄', 'Akizawa'] },
  { name: '三组', players: ['切尔茜', '玩设备', '风早丶神人'] },
  { name: '四组', players: ['hobaka', '75sp', '虎纹鲲'] },
  { name: '五组', players: ['安格', 'ams', '一起失眠'] },
  { name: '六组', players: ['鲁迪乌斯', '新条茜', '御宅导师'] },
  { name: '七组', players: ['lese', 'gura', 'arisu'] },
  { name: '八组', players: ['Shaw', '顶碗人', '澄梦Crystal'] },
];
const th = Object.fromEntries(thTeams.map((t) => [t.name, { name: t.name, players: t.players }]));

const tianhong1: Tournament = {
  id: 'tianhong-1',
  name: '第一届天虹杯',
  series: 'tianhong',
  edition: 1,
  mode: 'team',
  start: '2025-11-08',
  end: '2025-11-22',
  status: 'finished',
  tagline: '八支三人队的周末联赛：两轮小组赛后进入 BO3 淘汰赛，八组一路不败，决赛加时绝杀七组。',
  formatTags: ['三人组队', '小组赛 BO1', '淘汰赛 BO3'],
  teams: thTeams,
  notes: ['由于中途有人弃赛、有人临时来不了，并非全程按原定阵容比赛，存在人员变动。'],
  stages: [
    {
      kind: 'matches',
      title: '小组赛 · 第一轮',
      matches: [
        match(th['八组'], th['七组'], [[42, 20]]),
        match(th['二组'], th['四组'], [[17, 40]]),
        match(th['五组'], th['六组'], [[32, 44]]),
        match(th['一组'], th['三组'], [[42, 37]]),
      ],
    },
    {
      kind: 'matches',
      title: '小组赛 · 第二轮',
      matches: [
        match(th['八组'], th['三组'], [[42, 37]], {
          note: '原始记录中这场的比分与赛评和「一组 vs 三组」完全相同，疑为誊写时重复，比分待核实。',
        }),
        match(th['六组'], th['二组'], [[15, 15, 'b']], { note: '双方都有人来不了，改为 1v1 单挑。' }),
        match(th['一组'], th['七组'], [[29, 46]]),
        match(th['四组'], th['五组'], [[48, 33]]),
      ],
    },
    {
      kind: 'bracket',
      title: '淘汰赛',
      desc: '半决赛与决赛均为 BO3。',
      tracks: [
        {
          rounds: [
            {
              title: '半决赛',
              matches: [
                match(side('四组', 'hobaka', '75sp', 'Akizawa'), th['七组'], [[19, 22], [21, 7], [15, 20]], { bestOf: 3 }),
                match(th['八组'], th['二组'], [], {
                  bestOf: 3,
                  winner: 'a',
                  result: 'walkover',
                  note: '二组人员不齐，八组自动晋级决赛。',
                }),
              ],
            },
            {
              title: '决赛',
              matches: [match(th['七组'], th['八组'], [[27, 31], [32, 31, [2, 3]]], { bestOf: 3 })],
            },
          ],
        },
      ],
    },
  ],
  placements: [
    { rank: 1, label: '冠军', team: '八组', players: ['Shaw', '顶碗人', '澄梦Crystal'] },
    { rank: 2, label: '亚军', team: '七组', players: ['lese', 'gura', 'arisu'] },
    { rank: 3, label: '季军', team: '四组', players: ['hobaka', '75sp', 'Akizawa'] },
  ],
  awards: [
    { player: 'Shaw', award: 'MVP' },
    { player: '顶碗人', award: 'EVP' },
    { player: 'lese', award: 'EVP' },
    { player: 'hobaka', award: 'EVP' },
  ],
  reviews: [
    {
      title: '八组 vs 七组',
      score: '42 : 20',
      body: '周五开始的第一场比赛。一开局 Shaw 就接连拿下各种老动画题，对作品和标签难以想象地熟悉，锁定目标迅速而精准，一口气拿下近 20 分的分差。在 lese 选手网络条件差的情况下，gura 和 arisu 也拿下数题，在得分效率上甚至稍稍占据上风。但是随着赛程推进，越来越接近赛点，八组淮南皓月和澄梦Crystal 在后续的游戏等题目中仍脱颖而出，最后胜利。',
    },
    {
      title: '二组 vs 四组',
      score: '17 : 40',
      body: '二组在一些冲突中以人数劣势的情况开始了比赛，但是两队的 Seventen 和 hobaka 在开局的系统题中针锋相对，分数胶着，最后坚持到了队伍集齐。但是在中期的动画和游戏题中，四组整体排标签逼近答案的效率看上去更高，而虎纹鲲选手更首次展现了其惊艳的实力，尤其开局瞬秒十分炸裂。而 hobaka 更是状态火热，在中后程猜测过程都十分优秀的情况下，也几乎全程包揽动画与游戏等题，但是双方十分不擅长厕纸，在一些新动画题中粘稠了一阵子之后结束了比赛。',
    },
    {
      title: '五组 vs 六组',
      score: '32 : 44',
      body: '开局鲁迪乌斯便连续下分，但是在 galgame 上被安格断了节奏，之后在系统一众冷门动画题中双方都始终保持得分，而鲁迪总保持有更快的判断。在中期，地区、题材和形式丰富的题目中，得分可以说人人有份，新朋友也展示出十分的见识。比分十分接近。不过之后鲁迪连续得分带领队伍来到赛点，之后便因为场外原因无奈退出，加上御宅导师也退，只剩下新条茜 1v3，但是下一题他便终结赛点！',
    },
    {
      title: '一组 vs 三组',
      score: '42 : 37',
      body: '开局一题就都猜出作品展示了双方的实力，几个动画题几乎都在 8 步以内结束，甚至三组两次截胡对方已经猜出作品得分，再得 galgame 分之后双方在中期战平，所有选手全部发挥加入互秒大战，一直在动画题上互有胜负，又同时折戟管人题，在赛马娘题玩设备选手用完全队次数仍不敌后被一组率先拿到赛点，不过之后连续猜中作品但 choke 使得最后比分十分接近，可惜没有迎来第一个加时，一组结束了比赛。',
    },
    {
      title: '六组 vs 二组（1v1）',
      score: '15 : 15 · 二组胜',
      body: '国产剧情（两边都有人来不了，最后单挑）。',
    },
    {
      title: '一组 vs 七组',
      score: '29 : 46',
      body: '琪露诺老掉线，Ryo 妙手频出，概念神网好 lese 全刷了。',
    },
    {
      title: '四组 vs 五组',
      score: '48 : 33',
      body: 'ams 回归之战，五组劣势依旧好反应。现在我知道了，我出的题早就被 hobaka 都玩过了，现在就是难受。',
    },
  ],
};

export const tournaments2025: Tournament[] = [major1, major2, major3, msi1, lbc1, rookie1, tianhong1];
