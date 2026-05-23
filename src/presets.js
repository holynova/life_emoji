export const EMOJI_PRESETS = [
  {
    category: '学业与职场',
    items: [
      { key: 'study', emoji: '📖', label: '入学/读书', defaultText: '上学' },
      { key: 'graduate', emoji: '🎓', label: '毕业/获得学位', defaultText: '毕业' },
      { key: 'job', emoji: '💼', label: '入职/第一份工作', defaultText: '社会人' },
      { key: 'tech', emoji: '💻', label: '获得电脑/写代码', defaultText: '打工' },
      { key: 'promote', emoji: '👔', label: '升职加薪', defaultText: '升职' },
    ]
  },
  {
    category: '家庭与伴侣',
    items: [
      { key: 'love', emoji: '❤️', label: '获得恋人/脱单', defaultText: '脱单' },
      { key: 'marriage', emoji: '💍', label: '获得配偶/结婚', defaultText: '结婚' },
      { key: 'baby', emoji: '👶', label: '获得宝宝/生娃', defaultText: '当爸妈' },
      { key: 'cat', emoji: '🐱', label: '拥有猫咪', defaultText: '铲屎官' },
      { key: 'dog', emoji: '🐶', label: '拥有狗狗', defaultText: '有狗啦' },
    ]
  },
  {
    category: '资产与大件',
    items: [
      { key: 'house', emoji: '🏠', label: '买房/获得首套房', defaultText: '买房' },
      { key: 'car', emoji: '🚗', label: '买车/获得首台车', defaultText: '买车' },
      { key: 'scooter', emoji: '🛵', label: '拥有小电驴', defaultText: '电驴代步' },
      { key: 'bike', emoji: '🚲', label: '拥有自行车', defaultText: '骑行生活' },
      { key: 'money', emoji: '💰', label: '获得大笔积蓄', defaultText: '暴富' },
    ]
  },
  {
    category: '生活与爱好',
    items: [
      { key: 'license', emoji: '🪪', label: '获得驾驶证', defaultText: '拿到驾照' },
      { key: 'travel', emoji: '✈️', label: '获得出国机会/护照', defaultText: '出国游' },
      { key: 'fitness', emoji: '🏃', label: '开始健身/减肥成功', defaultText: '自律' },
      { key: 'music', emoji: '🎸', label: '拥有吉他/学会乐器', defaultText: '学乐器' },
      { key: 'game', emoji: '🎮', label: '拥有游戏机/沉迷游戏', defaultText: '游戏宅' },
    ]
  }
];

export const THEMES = [
  {
    id: 'classic',
    name: '小红书原生白',
    bgType: 'solid',
    background: '#FFFFFF',
    text: '#111111',
    accent: '#FF2442', // RED brand color
    font: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    cardBg: 'rgba(255, 255, 255, 0.9)',
  },
  {
    id: 'journal',
    name: '治愈暖意手账',
    bgType: 'solid',
    background: '#FAF6EE',
    text: '#4A3E3D',
    accent: '#B87E78',
    font: 'Georgia, "Nimbus Roman No9 L", "Songti SC", "SimSun", serif',
    cardBg: 'rgba(250, 246, 238, 0.9)',
  },
  {
    id: 'dark',
    name: '极客荧光暗黑',
    bgType: 'solid',
    background: '#0F172A',
    text: '#38BDF8',
    accent: '#F43F5E',
    font: 'Courier New, Courier, "Fira Code", Monaco, monospace',
    cardBg: 'rgba(15, 23, 42, 0.95)',
  },
  {
    id: 'dopamine',
    name: '粉蓝多巴胺渐变',
    bgType: 'gradient',
    gradientColors: ['#FFDEE9', '#B5FFFC'], // Pink to Mint Blue
    text: '#3F4E75',
    accent: '#E76F51',
    font: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    cardBg: 'rgba(255, 255, 255, 0.8)',
  },
  {
    id: 'sunset',
    name: '落日晚霞渐变',
    bgType: 'gradient',
    gradientColors: ['#FAD961', '#F76B1C'], // Warm Yellow to Orange Red
    text: '#FFFFFF',
    accent: '#FAD961',
    font: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    cardBg: 'rgba(0, 0, 0, 0.4)',
    textShadow: '0 2px 4px rgba(0,0,0,0.2)'
  },
  {
    id: 'forest',
    name: '绿意森林渐变',
    bgType: 'gradient',
    gradientColors: ['#11998e', '#38ef7d'], // Teal to Lime Green
    text: '#FFFFFF',
    accent: '#FFEB3B',
    font: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    cardBg: 'rgba(0, 0, 0, 0.35)',
    textShadow: '0 2px 4px rgba(0,0,0,0.15)'
  }
];

export const GENDER_OPTIONS = [
  { value: 'female', label: '女生', emoji: '👧', adultEmoji: '👩' },
  { value: 'male', label: '男生', emoji: '👦', adultEmoji: '👨' }
];
