// 选手名归一：原始记录里同一个人有多种写法，这里统一成一个展示名。
// key 为标准展示名，value 为出现过的其它写法（大小写不敏感，无需重复列出仅大小写不同的写法）。
const ALIASES: Record<string, string[]> = {
  Shaw: [],
  'V.': ['V'],
  "Shin'on": ['shinon'],
  SevenTen: ['710'],
  hobaka: [],
  lese: [],
  gura: [],
  arisu: [],
  sh1ro: [],
  shiki: ['遠野しき', 'shiki toono'],
  Akizawa: [],
  Ryo: [],
  JDG: ['北京JDG'],
  ams: ['爱梅斯'],
  WTDER: [],
  Yuk1: [],
  Asahi: [],
  rikka: [],
  qiu: [],
  xwwwx: [],
  bernkastel: ['贝卡丝忒'],
  鲁迪乌斯: ['鲁迪'],
  切尔茜: ['切尔茜总冠军'],
  玩设备: ['设备'],
  顶碗人: ['顶碗人12138'],
  澄梦Crystal: [],
  水映天虹: ['天虹'],
  非也非也: ['非也'],
  俺是一头猪: ['猪'],
  新条茜: ['新条茜1'],
  正义联盟DCAT: ['正义联盟'],
  Ishmael: ['is'],
  nassu: [],
  Godyoull: ['Godyull', 'Godyoll', 'Godyoull（网卡版）'],
  WolfsRevenge: ['wolfsrenvenge'],
  Wheatley: ['wheatly'],
  Eleseven: [],
  Lenaa: [],
  Ral: [],
  'Ave Mujica的Oblivionis本人': ['爱牛的神子', 'Oblivionis'],
  Yukiyra: [],
  EZ: [],
  Avi: [],
  luanma: [],
  MRzixi: [],
  sugarlovesalt: [],
  'Recalling the past': [],
  被带飞的托雷那桑: ['被带飞的托雷纳桑', '被带飞的拖累那桑'],
  'Jack frost': [],
  Octeven: [],
  愛城華戀: [],
};

/** 有头像的选手 → public/avatars 下的文件名 */
const AVATARS: Record<string, string> = {
  淮南皓月: 'huainanhaoyue',
  ams: 'ams',
  arisu: 'arisu',
  lese: 'lese',
  顶碗人: 'dingwanren',
  JDG: 'jdg',
  中华小当家: 'xiaodangjia',
  Ryo: 'ryo',
  切尔茜: 'chelsea',
  SevenTen: 'seventen',
  你去祭典了吧: 'jidian',
  Shaw: 'shaw',
  琪露诺: 'cirno',
  澄梦Crystal: 'chengmeng',
  安格: 'ange',
  "Shin'on": 'shinon',
  新条茜: 'akane',
  Akizawa: 'akizawa',
  hobaka: 'hobaka',
  云霄: 'yunxiao',
  姜姜大当家: 'jiangjiang',
  鲁迪乌斯: 'rudeus',
  '75sp': '75sp',
  素质人士: 'suzhi',
  'V.': 'v',
  shiki: 'shiki',
  gura: 'gura',
  玩设备: 'wanshebei',
  阿赵: 'azhao',
  吴织亚切: 'wuzhi',
  sh1ro: 'sh1ro',
};

const norm = (s: string) => s.trim().toLowerCase();

const lookup = new Map<string, string>();
for (const [canon, list] of Object.entries(ALIASES)) {
  lookup.set(norm(canon), canon);
  for (const alias of list) lookup.set(norm(alias), canon);
}

/** 把任意原始写法归一成标准展示名 */
export function resolvePlayer(raw: string): string {
  const key = norm(raw);
  const hit = lookup.get(key);
  if (hit) return hit;
  // 未登记的名字：以首次出现的写法为准，之后仅大小写不同的写法都归到它
  const name = raw.trim();
  lookup.set(key, name);
  return name;
}

/** 某位选手登记过的其它写法 */
export function aliasesOf(canon: string): string[] {
  return ALIASES[canon] ?? [];
}

/** 头像地址；没有头像时返回 undefined，由 Avatar 组件画首字占位 */
export function avatarOf(raw: string): string | undefined {
  const file = AVATARS[resolvePlayer(raw)];
  return file ? `${import.meta.env.BASE_URL}avatars/${file}.jpg` : undefined;
}

/** 选手详情页路径 */
export function playerPath(raw: string): string {
  return `/players/${encodeURIComponent(resolvePlayer(raw))}`;
}
