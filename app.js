const STORAGE_KEY = "sam5-prototype-save";
const SAVE_SLOT_PREFIX = `${STORAGE_KEY}-slot-`;
const SELECTED_SAVE_SLOT_KEY = `${STORAGE_KEY}-selected-slot`;
const SAVE_SLOT_COUNT = 5;
const PROGRESS_DURATION_MS = 1100;
const PROGRESS_CLEAR_MS = 900;
const AUTO_PROGRESS_DELAY_MS = 260;
const SCOUT_COST = 120;
const RECRUIT_BASE_COST = 160;
const MIN_CITY_COMMAND_LIMIT = 1;
const MAX_CITY_COMMAND_LIMIT = 4;
const CITY_IMAGE_BASE = "assets/cities";
const MAP_VIEWPORT_WIDTH_RATIO = 1.55;
const MAP_VIEWPORT_HEIGHT_RATIO = 1.7;
const MAP_ZOOM_MIN = 0.75;
const MAP_ZOOM_MAX = 1.6;
const MAP_ZOOM_STEP = 0.15;

function createHiddenOfficerPool() {
  const featuredOfficers = [
    { id: "sima-yi", name: "사마의", leadership: 94, war: 63, intelligence: 98, politics: 97, charm: 82, loyalty: 78 },
    { id: "pang-tong", name: "방통", leadership: 88, war: 42, intelligence: 97, politics: 86, charm: 74, loyalty: 82 },
    { id: "xu-shu", name: "서서", leadership: 82, war: 64, intelligence: 93, politics: 80, charm: 81, loyalty: 84 },
    { id: "wei-yan", name: "위연", leadership: 84, war: 92, intelligence: 69, politics: 46, charm: 62, loyalty: 76 },
    { id: "gan-ning", name: "감녕", leadership: 81, war: 94, intelligence: 68, politics: 43, charm: 75, loyalty: 74 },
    { id: "lu-su", name: "노숙", leadership: 78, war: 46, intelligence: 91, politics: 93, charm: 88, loyalty: 86 },
    { id: "fa-zheng", name: "법정", leadership: 80, war: 45, intelligence: 94, politics: 88, charm: 76, loyalty: 82 },
    { id: "deng-ai", name: "등애", leadership: 91, war: 87, intelligence: 89, politics: 73, charm: 70, loyalty: 79 },
    { id: "jiang-wei", name: "강유", leadership: 90, war: 89, intelligence: 90, politics: 76, charm: 83, loyalty: 85 },
    { id: "zhang-liao", name: "장료", leadership: 93, war: 92, intelligence: 78, politics: 58, charm: 82, loyalty: 80 },
  ];
  const surnames = ["왕", "장", "조", "진", "한", "위", "마", "황", "전", "손", "노", "정", "유", "곽", "하", "심", "등", "양", "고", "문", "사", "서", "범", "종", "허", "방", "임", "오", "채", "반"];
  const givenFirst = ["백", "중", "숙", "계", "문", "자", "공", "원", "덕", "현"];
  const givenSecond = ["안", "평", "윤", "량", "겸", "휘", "진", "승", "연", "의", "보", "경", "휴", "온", "상"];
  const generatedOfficers = Array.from({ length: 90 }, (_, index) => {
    const seed = index + 1;
    return {
      id: `wild-${String(seed).padStart(3, "0")}`,
      name: `${surnames[index % surnames.length]}${givenFirst[Math.floor(index / surnames.length) % givenFirst.length]}${givenSecond[(index * 7) % givenSecond.length]}`,
      leadership: 52 + ((seed * 17) % 43),
      war: 40 + ((seed * 23) % 56),
      intelligence: 42 + ((seed * 19) % 54),
      politics: 36 + ((seed * 29) % 58),
      charm: 45 + ((seed * 13) % 50),
      loyalty: 62 + ((seed * 11) % 28),
    };
  });
  return [...featuredOfficers, ...generatedOfficers];
}

const scenario = {
  year: 190,
  month: 1,
  factions: [
    { id: "cao", name: "조조", rulerId: "cao-cao", color: "#324a7a", gold: 820, food: 1150, portrait: { image: "assets/rulers/cao-cao.png", skin: "#d7a16f", hair: "#241c1a", beard: "short", hairStyle: "crown" } },
    { id: "liu", name: "유비", rulerId: "liu-bei", color: "#2e6f5e", gold: 560, food: 820, portrait: { image: "assets/rulers/liu-bei.png", skin: "#d8aa7d", hair: "#30231d", beard: "long", hairStyle: "crown" } },
    { id: "sun", name: "손권", rulerId: "sun-quan", color: "#b8860b", gold: 640, food: 940, portrait: { image: "assets/rulers/sun-quan.png", skin: "#d6a06e", hair: "#2b211b", beard: "short", hairStyle: "crown" } },
    { id: "yuan", name: "원소", rulerId: "yuan-shao", color: "#a93226", gold: 740, food: 1050, portrait: { image: "assets/rulers/yuan-shao.png", skin: "#dbad82", hair: "#211818", beard: "long", hairStyle: "crown" } },
    { id: "dong", name: "동탁", rulerId: "dong-zhuo", color: "#6d4c41", gold: 760, food: 960, portrait: { image: "assets/rulers/dong-zhuo.png", skin: "#c88f66", hair: "#1f1714", beard: "long", hairStyle: "helmet" } },
    { id: "ma", name: "마등", rulerId: "ma-teng", color: "#7a5c2e", gold: 520, food: 840, portrait: { image: "assets/rulers/ma-teng.png", skin: "#d0a074", hair: "#282018", beard: "short", hairStyle: "helmet" } },
    { id: "biao", name: "유표", rulerId: "liu-biao", color: "#6f7f35", gold: 600, food: 900, portrait: { image: "assets/rulers/liu-biao.png", skin: "#d9b188", hair: "#30251f", beard: "long", hairStyle: "crown" } },
    { id: "shi", name: "사섭", rulerId: "shi-xie", color: "#6a4c93", gold: 430, food: 760, portrait: { image: "assets/rulers/shi-xie.png", skin: "#d2a277", hair: "#231b18", beard: "none", hairStyle: "crown" } },
  ],
  cities: [
    {
      id: "xu",
      name: "허창",
      ownerFactionId: "cao",
      population: 520,
      development: 62,
      commerce: 68,
      order: 74,
      troops: 180,
      training: 64,
      x: 48,
      y: 42,
      adjacentCityIds: ["ye", "xia", "shou", "luoyang", "chenliu", "qiao", "runan"],
    },
    {
      id: "ye",
      name: "업",
      ownerFactionId: "yuan",
      population: 610,
      development: 58,
      commerce: 55,
      order: 61,
      troops: 220,
      training: 56,
      x: 42,
      y: 18,
      adjacentCityIds: ["xu", "bei", "luoyang", "nanpi", "pingyuan", "chenliu"],
    },
    {
      id: "bei",
      name: "북평",
      ownerFactionId: "yuan",
      population: 360,
      development: 45,
      commerce: 38,
      order: 59,
      troops: 130,
      training: 50,
      x: 70,
      y: 13,
      adjacentCityIds: ["ye", "xia", "nanpi", "pingyuan", "langye"],
    },
    {
      id: "xia",
      name: "하비",
      ownerFactionId: "cao",
      population: 460,
      development: 52,
      commerce: 61,
      order: 68,
      troops: 145,
      training: 58,
      x: 67,
      y: 45,
      adjacentCityIds: ["xu", "bei", "jianye", "langye"],
    },
    {
      id: "shou",
      name: "수춘",
      ownerFactionId: "liu",
      population: 420,
      development: 48,
      commerce: 44,
      order: 66,
      troops: 150,
      training: 60,
      x: 43,
      y: 62,
      adjacentCityIds: ["xu", "jing", "jianye", "xiangyang", "qiao", "runan", "xinye", "jiangxia"],
    },
    {
      id: "jing",
      name: "강릉",
      ownerFactionId: "liu",
      population: 500,
      development: 50,
      commerce: 47,
      order: 70,
      troops: 170,
      training: 62,
      x: 28,
      y: 74,
      adjacentCityIds: ["shou", "chengdu", "jianye", "xiangyang", "wuling", "ba", "jiangxia"],
    },
    {
      id: "chengdu",
      name: "성도",
      ownerFactionId: "liu",
      population: 570,
      development: 60,
      commerce: 52,
      order: 72,
      troops: 165,
      training: 57,
      x: 10,
      y: 58,
      adjacentCityIds: ["jing", "hanzhong", "ba"],
    },
    {
      id: "jianye",
      name: "건업",
      ownerFactionId: "sun",
      population: 540,
      development: 56,
      commerce: 65,
      order: 75,
      troops: 175,
      training: 63,
      x: 75,
      y: 72,
      adjacentCityIds: ["xia", "shou", "jing", "kuaiji", "yuzhang", "wujun"],
    },
    {
      id: "luoyang",
      name: "낙양",
      ownerFactionId: "dong",
      population: 650,
      development: 65,
      commerce: 70,
      order: 58,
      troops: 210,
      training: 54,
      x: 34,
      y: 39,
      adjacentCityIds: ["changan", "ye", "xu", "xiangyang", "hongnong", "xinye", "chenliu"],
    },
    {
      id: "changan",
      name: "장안",
      ownerFactionId: "dong",
      population: 620,
      development: 60,
      commerce: 55,
      order: 52,
      troops: 240,
      training: 52,
      x: 21,
      y: 38,
      adjacentCityIds: ["tianshui", "hanzhong", "luoyang", "hongnong", "anding"],
    },
    {
      id: "tianshui",
      name: "천수",
      ownerFactionId: "ma",
      population: 310,
      development: 42,
      commerce: 32,
      order: 64,
      troops: 125,
      training: 58,
      x: 9,
      y: 24,
      adjacentCityIds: ["changan", "hanzhong", "anding", "wuwei", "xiliang"],
    },
    {
      id: "hanzhong",
      name: "한중",
      ownerFactionId: "liu",
      population: 340,
      development: 48,
      commerce: 39,
      order: 67,
      troops: 135,
      training: 56,
      x: 15,
      y: 53,
      adjacentCityIds: ["changan", "tianshui", "chengdu", "xiangyang", "hongnong", "ba"],
    },
    {
      id: "xiangyang",
      name: "양양",
      ownerFactionId: "biao",
      population: 520,
      development: 55,
      commerce: 53,
      order: 72,
      troops: 165,
      training: 55,
      x: 32,
      y: 59,
      adjacentCityIds: ["luoyang", "shou", "jing", "hanzhong", "wuling", "xinye", "jiangxia"],
    },
    {
      id: "wuling",
      name: "무릉",
      ownerFactionId: "biao",
      population: 360,
      development: 44,
      commerce: 40,
      order: 66,
      troops: 105,
      training: 47,
      x: 29,
      y: 80,
      adjacentCityIds: ["jing", "xiangyang", "lingling", "changsha", "ba"],
    },
    {
      id: "lingling",
      name: "영릉",
      ownerFactionId: "biao",
      population: 330,
      development: 41,
      commerce: 37,
      order: 65,
      troops: 98,
      training: 45,
      x: 43,
      y: 87,
      adjacentCityIds: ["wuling", "jiaozhi", "changsha", "guiyang", "cangwu"],
    },
    {
      id: "kuaiji",
      name: "회계",
      ownerFactionId: "sun",
      population: 400,
      development: 49,
      commerce: 62,
      order: 73,
      troops: 120,
      training: 56,
      x: 88,
      y: 83,
      adjacentCityIds: ["jianye", "jiaozhi", "wujun", "luling"],
    },
    {
      id: "jiaozhi",
      name: "교지",
      ownerFactionId: "shi",
      population: 300,
      development: 38,
      commerce: 46,
      order: 70,
      troops: 90,
      training: 43,
      x: 61,
      y: 90,
      adjacentCityIds: ["lingling", "kuaiji", "cangwu", "nanhai", "luling"],
    },
    {
      id: "nanpi",
      name: "남피",
      ownerFactionId: "yuan",
      population: 430,
      development: 50,
      commerce: 44,
      order: 62,
      troops: 150,
      training: 52,
      x: 55,
      y: 14,
      image: "assets/cities/ye.png",
      adjacentCityIds: ["ye", "pingyuan", "bei"],
    },
    {
      id: "pingyuan",
      name: "평원",
      ownerFactionId: "yuan",
      population: 370,
      development: 44,
      commerce: 40,
      order: 60,
      troops: 118,
      training: 49,
      x: 58,
      y: 24,
      image: "assets/cities/bei.png",
      adjacentCityIds: ["nanpi", "ye", "bei"],
    },
    {
      id: "chenliu",
      name: "진류",
      ownerFactionId: "cao",
      population: 500,
      development: 57,
      commerce: 63,
      order: 70,
      troops: 160,
      training: 58,
      x: 54,
      y: 34,
      image: "assets/cities/xu.png",
      adjacentCityIds: ["xu", "ye", "luoyang", "langye", "qiao"],
    },
    {
      id: "qiao",
      name: "초",
      ownerFactionId: "cao",
      population: 390,
      development: 47,
      commerce: 49,
      order: 64,
      troops: 132,
      training: 54,
      x: 56,
      y: 52,
      image: "assets/cities/shou.png",
      adjacentCityIds: ["xu", "shou", "runan", "chenliu"],
    },
    {
      id: "runan",
      name: "여남",
      ownerFactionId: "cao",
      population: 440,
      development: 51,
      commerce: 48,
      order: 63,
      troops: 140,
      training: 52,
      x: 47,
      y: 55,
      image: "assets/cities/shou.png",
      adjacentCityIds: ["xu", "shou", "qiao", "xinye"],
    },
    {
      id: "langye",
      name: "낭야",
      ownerFactionId: "cao",
      population: 350,
      development: 42,
      commerce: 45,
      order: 61,
      troops: 115,
      training: 50,
      x: 73,
      y: 36,
      image: "assets/cities/xia.png",
      adjacentCityIds: ["xia", "bei", "chenliu"],
    },
    {
      id: "hongnong",
      name: "홍농",
      ownerFactionId: "dong",
      population: 340,
      development: 46,
      commerce: 42,
      order: 50,
      troops: 130,
      training: 48,
      x: 27,
      y: 43,
      image: "assets/cities/luoyang.png",
      adjacentCityIds: ["changan", "luoyang", "hanzhong"],
    },
    {
      id: "anding",
      name: "안정",
      ownerFactionId: "ma",
      population: 260,
      development: 36,
      commerce: 30,
      order: 59,
      troops: 104,
      training: 52,
      x: 16,
      y: 25,
      image: "assets/cities/tianshui.png",
      adjacentCityIds: ["tianshui", "changan", "wuwei", "xiliang"],
    },
    {
      id: "wuwei",
      name: "무위",
      ownerFactionId: "ma",
      population: 230,
      development: 32,
      commerce: 28,
      order: 57,
      troops: 96,
      training: 50,
      x: 5,
      y: 12,
      image: "assets/cities/tianshui.png",
      adjacentCityIds: ["anding", "tianshui"],
    },
    {
      id: "xiliang",
      name: "서량",
      ownerFactionId: "ma",
      population: 250,
      development: 34,
      commerce: 27,
      order: 61,
      troops: 110,
      training: 55,
      x: 2,
      y: 32,
      image: "assets/cities/tianshui.png",
      adjacentCityIds: ["tianshui", "anding"],
    },
    {
      id: "xinye",
      name: "신야",
      ownerFactionId: "biao",
      population: 330,
      development: 43,
      commerce: 41,
      order: 66,
      troops: 112,
      training: 50,
      x: 30,
      y: 51,
      image: "assets/cities/xiangyang.png",
      adjacentCityIds: ["xiangyang", "luoyang", "shou", "runan"],
    },
    {
      id: "jiangxia",
      name: "강하",
      ownerFactionId: "biao",
      population: 380,
      development: 47,
      commerce: 46,
      order: 68,
      troops: 120,
      training: 51,
      x: 48,
      y: 67,
      image: "assets/cities/jing.png",
      adjacentCityIds: ["shou", "xiangyang", "jing", "yuzhang", "changsha"],
    },
    {
      id: "changsha",
      name: "장사",
      ownerFactionId: "biao",
      population: 390,
      development: 45,
      commerce: 43,
      order: 67,
      troops: 116,
      training: 49,
      x: 38,
      y: 78,
      image: "assets/cities/wuling.png",
      adjacentCityIds: ["wuling", "lingling", "guiyang", "jiangxia", "yuzhang"],
    },
    {
      id: "guiyang",
      name: "계양",
      ownerFactionId: "biao",
      population: 300,
      development: 38,
      commerce: 35,
      order: 64,
      troops: 92,
      training: 44,
      x: 35,
      y: 91,
      image: "assets/cities/lingling.png",
      adjacentCityIds: ["changsha", "lingling", "cangwu"],
    },
    {
      id: "yuzhang",
      name: "예장",
      ownerFactionId: "sun",
      population: 410,
      development: 48,
      commerce: 56,
      order: 70,
      troops: 118,
      training: 52,
      x: 62,
      y: 74,
      image: "assets/cities/jianye.png",
      adjacentCityIds: ["jianye", "jiangxia", "changsha", "luling"],
    },
    {
      id: "luling",
      name: "여릉",
      ownerFactionId: "sun",
      population: 320,
      development: 41,
      commerce: 45,
      order: 68,
      troops: 96,
      training: 47,
      x: 66,
      y: 86,
      image: "assets/cities/kuaiji.png",
      adjacentCityIds: ["yuzhang", "kuaiji", "jiaozhi"],
    },
    {
      id: "wujun",
      name: "오군",
      ownerFactionId: "sun",
      population: 460,
      development: 53,
      commerce: 66,
      order: 74,
      troops: 128,
      training: 54,
      x: 84,
      y: 69,
      image: "assets/cities/kuaiji.png",
      adjacentCityIds: ["jianye", "kuaiji"],
    },
    {
      id: "cangwu",
      name: "창오",
      ownerFactionId: "shi",
      population: 270,
      development: 35,
      commerce: 38,
      order: 66,
      troops: 82,
      training: 41,
      x: 48,
      y: 96,
      image: "assets/cities/jiaozhi.png",
      adjacentCityIds: ["lingling", "guiyang", "jiaozhi", "nanhai"],
    },
    {
      id: "nanhai",
      name: "남해",
      ownerFactionId: "shi",
      population: 310,
      development: 39,
      commerce: 52,
      order: 69,
      troops: 88,
      training: 43,
      x: 58,
      y: 98,
      image: "assets/cities/jiaozhi.png",
      adjacentCityIds: ["jiaozhi", "cangwu"],
    },
    {
      id: "ba",
      name: "파군",
      ownerFactionId: "liu",
      population: 360,
      development: 44,
      commerce: 37,
      order: 68,
      troops: 112,
      training: 48,
      x: 15,
      y: 70,
      image: "assets/cities/chengdu.png",
      adjacentCityIds: ["chengdu", "hanzhong", "jing", "wuling"],
    },
  ],
  officers: [
    { id: "cao-cao", name: "조조", factionId: "cao", cityId: "xu", leadership: 96, war: 72, intelligence: 91, politics: 94, charm: 88, loyalty: 100 },
    { id: "xiahou-dun", name: "하후돈", factionId: "cao", cityId: "xia", leadership: 86, war: 90, intelligence: 62, politics: 54, charm: 70, loyalty: 92 },
    { id: "liu-bei", name: "유비", factionId: "liu", cityId: "shou", leadership: 78, war: 73, intelligence: 76, politics: 80, charm: 99, loyalty: 100 },
    { id: "guan-yu", name: "관우", factionId: "liu", cityId: "jing", leadership: 92, war: 97, intelligence: 76, politics: 64, charm: 93, loyalty: 96 },
    { id: "zhang-fei", name: "장비", factionId: "liu", cityId: "chengdu", leadership: 84, war: 98, intelligence: 42, politics: 36, charm: 70, loyalty: 95 },
    { id: "sun-quan", name: "손권", factionId: "sun", cityId: "jianye", leadership: 78, war: 67, intelligence: 82, politics: 89, charm: 86, loyalty: 100 },
    { id: "zhou-yu", name: "주유", factionId: "sun", cityId: "jianye", leadership: 95, war: 72, intelligence: 96, politics: 85, charm: 91, loyalty: 94 },
    { id: "yuan-shao", name: "원소", factionId: "yuan", cityId: "ye", leadership: 76, war: 69, intelligence: 70, politics: 74, charm: 82, loyalty: 100 },
    { id: "yan-liang", name: "안량", factionId: "yuan", cityId: "bei", leadership: 74, war: 91, intelligence: 41, politics: 33, charm: 58, loyalty: 86 },
    { id: "dong-zhuo", name: "동탁", factionId: "dong", cityId: "changan", leadership: 72, war: 80, intelligence: 62, politics: 49, charm: 38, loyalty: 100 },
    { id: "lu-bu", name: "여포", factionId: "dong", cityId: "luoyang", leadership: 88, war: 100, intelligence: 36, politics: 22, charm: 70, loyalty: 71 },
    { id: "ma-teng", name: "마등", factionId: "ma", cityId: "tianshui", leadership: 82, war: 84, intelligence: 63, politics: 58, charm: 76, loyalty: 100 },
    { id: "ma-chao", name: "마초", factionId: "ma", cityId: "tianshui", leadership: 86, war: 96, intelligence: 54, politics: 42, charm: 82, loyalty: 92 },
    { id: "zhuge-liang", name: "제갈량", factionId: "liu", cityId: "hanzhong", leadership: 92, war: 38, intelligence: 100, politics: 98, charm: 94, loyalty: 96 },
    { id: "liu-biao", name: "유표", factionId: "biao", cityId: "xiangyang", leadership: 64, war: 45, intelligence: 78, politics: 83, charm: 80, loyalty: 100 },
    { id: "huang-zhong", name: "황충", factionId: "biao", cityId: "wuling", leadership: 84, war: 93, intelligence: 66, politics: 52, charm: 74, loyalty: 88 },
    { id: "tai-shi-ci", name: "태사자", factionId: "sun", cityId: "kuaiji", leadership: 82, war: 92, intelligence: 67, politics: 55, charm: 80, loyalty: 91 },
    { id: "shi-xie", name: "사섭", factionId: "shi", cityId: "jiaozhi", leadership: 58, war: 42, intelligence: 80, politics: 86, charm: 84, loyalty: 100 },
    { id: "xing-dao-rong", name: "형도영", factionId: "biao", cityId: "lingling", leadership: 59, war: 78, intelligence: 34, politics: 28, charm: 48, loyalty: 83 },
    { id: "ju-shou", name: "저수", factionId: "yuan", cityId: "nanpi", leadership: 76, war: 45, intelligence: 91, politics: 88, charm: 72, loyalty: 90 },
    { id: "tian-feng", name: "전풍", factionId: "yuan", cityId: "pingyuan", leadership: 72, war: 39, intelligence: 92, politics: 86, charm: 70, loyalty: 88 },
    { id: "xun-yu", name: "순욱", factionId: "cao", cityId: "chenliu", leadership: 74, war: 32, intelligence: 96, politics: 98, charm: 89, loyalty: 94 },
    { id: "cao-ren", name: "조인", factionId: "cao", cityId: "qiao", leadership: 88, war: 86, intelligence: 69, politics: 60, charm: 74, loyalty: 92 },
    { id: "li-dian", name: "이전", factionId: "cao", cityId: "runan", leadership: 78, war: 77, intelligence: 72, politics: 66, charm: 71, loyalty: 88 },
    { id: "zang-ba", name: "장패", factionId: "cao", cityId: "langye", leadership: 80, war: 82, intelligence: 64, politics: 55, charm: 68, loyalty: 82 },
    { id: "li-jue", name: "이각", factionId: "dong", cityId: "hongnong", leadership: 70, war: 76, intelligence: 49, politics: 38, charm: 40, loyalty: 75 },
    { id: "han-sui", name: "한수", factionId: "ma", cityId: "anding", leadership: 79, war: 73, intelligence: 78, politics: 70, charm: 68, loyalty: 78 },
    { id: "pang-de", name: "방덕", factionId: "ma", cityId: "wuwei", leadership: 82, war: 92, intelligence: 61, politics: 42, charm: 72, loyalty: 86 },
    { id: "ma-dai", name: "마대", factionId: "ma", cityId: "xiliang", leadership: 77, war: 84, intelligence: 60, politics: 48, charm: 70, loyalty: 88 },
    { id: "wen-pin", name: "문빙", factionId: "biao", cityId: "xinye", leadership: 80, war: 78, intelligence: 70, politics: 66, charm: 72, loyalty: 86 },
    { id: "huang-zu", name: "황조", factionId: "biao", cityId: "jiangxia", leadership: 68, war: 72, intelligence: 52, politics: 58, charm: 54, loyalty: 78 },
    { id: "han-xuan", name: "한현", factionId: "biao", cityId: "changsha", leadership: 52, war: 42, intelligence: 50, politics: 60, charm: 45, loyalty: 76 },
    { id: "zhao-fan", name: "조범", factionId: "biao", cityId: "guiyang", leadership: 50, war: 38, intelligence: 55, politics: 62, charm: 52, loyalty: 74 },
    { id: "lu-meng", name: "여몽", factionId: "sun", cityId: "yuzhang", leadership: 90, war: 82, intelligence: 88, politics: 78, charm: 80, loyalty: 92 },
    { id: "ling-tong", name: "능통", factionId: "sun", cityId: "luling", leadership: 78, war: 86, intelligence: 61, politics: 48, charm: 72, loyalty: 88 },
    { id: "zhang-zhao", name: "장소", factionId: "sun", cityId: "wujun", leadership: 63, war: 24, intelligence: 88, politics: 95, charm: 82, loyalty: 90 },
    { id: "shi-wu", name: "사무", factionId: "shi", cityId: "cangwu", leadership: 55, war: 48, intelligence: 66, politics: 72, charm: 68, loyalty: 86 },
    { id: "shi-huang", name: "사황", factionId: "shi", cityId: "nanhai", leadership: 52, war: 44, intelligence: 64, politics: 70, charm: 66, loyalty: 84 },
    { id: "yan-yan", name: "엄안", factionId: "liu", cityId: "ba", leadership: 78, war: 83, intelligence: 65, politics: 58, charm: 76, loyalty: 82 },
  ],
  hiddenOfficers: createHiddenOfficerPool(),
};

const commands = [
  {
    id: "develop",
    name: "개발",
    text: "농업과 인구 기반 상승",
    run(city, faction) {
      if (!spend(faction, 70, 0)) return false;
      city.development = clamp(city.development + 7, 0, 100);
      city.population += 18;
      addLog(`${city.name}의 개발이 진행되어 개발도가 상승했습니다.`);
      return true;
    },
  },
  {
    id: "commerce",
    name: "상업",
    text: "금 수입 기반 상승",
    run(city, faction) {
      if (!spend(faction, 60, 0)) return false;
      city.commerce = clamp(city.commerce + 8, 0, 100);
      addLog(`${city.name}의 시장이 정비되어 상업이 상승했습니다.`);
      return true;
    },
  },
  {
    id: "order",
    name: "치안",
    text: "민심과 수비 안정",
    run(city, faction) {
      if (!spend(faction, 45, 0)) return false;
      city.order = clamp(city.order + 10, 0, 100);
      addLog(`${city.name}의 치안이 안정되었습니다.`);
      return true;
    },
  },
  {
    id: "recruit",
    name: "징병",
    text: "병력 증가, 군량 소비",
    run(city, faction) {
      if (!spend(faction, 55, 90)) return false;
      const gained = Math.max(24, Math.round(city.population * 0.08));
      city.troops += gained;
      city.population = Math.max(100, city.population - Math.round(gained * 0.35));
      city.order = clamp(city.order - 4, 0, 100);
      addLog(`${city.name}에서 ${gained} 병력을 징병했습니다.`);
      return true;
    },
  },
  {
    id: "train",
    name: "훈련",
    text: "전투력 상승",
    run(city, faction) {
      if (!spend(faction, 35, 45)) return false;
      city.training = clamp(city.training + 9, 0, 100);
      addLog(`${city.name}의 병사들이 훈련을 마쳤습니다.`);
      return true;
    },
  },
  {
    id: "search",
    name: "탐색",
    text: "금 또는 민심 보상",
    run(city) {
      const faction = getFaction(city.ownerFactionId);
      const charm = cityOfficers(city).reduce((best, officer) => Math.max(best, officer.charm), 45);
      const success = Math.random() * 100 < charm;
      if (success) {
        const gold = 55 + Math.floor(Math.random() * 65);
        faction.gold += gold;
        addLog(`${city.name} 주변 탐색에 성공해 금 ${gold}을 얻었습니다.`);
      } else {
        city.order = clamp(city.order + 3, 0, 100);
        addLog(`${city.name} 탐색에서 큰 수확은 없었지만 민심이 조금 올랐습니다.`);
      }
      return true;
    },
  },
];

const storyScenarioPresets = {
  "dong-zhuo": {
    title: "동탁의 전횡",
    year: 190,
    month: 1,
    factionId: "dong",
    selectedCityId: "luoyang",
    cityOwners: {
      luoyang: "dong",
      changan: "dong",
      hongnong: "dong",
      xu: "cao",
      shou: "liu",
      jianye: "sun",
      ye: "yuan",
      tianshui: "ma",
      xiangyang: "biao",
      jiaozhi: "shi",
    },
    log: "동탁의 전횡 시나리오가 시작되었습니다. 낙양을 장악한 동탁으로 천하를 제압하세요.",
  },
  warlords: {
    title: "군웅할거",
    year: 194,
    month: 1,
    factionId: "cao",
    selectedCityId: "xu",
    cityOwners: {
      xu: "cao",
      xia: "cao",
      chenliu: "cao",
      qiao: "cao",
      shou: "liu",
      jing: "liu",
      jianye: "sun",
      kuaiji: "sun",
      ye: "yuan",
      bei: "yuan",
      luoyang: "dong",
      changan: "dong",
    },
    log: "군웅할거 시나리오가 시작되었습니다. 조조로 중원의 기반을 다지고 세력을 넓히세요.",
  },
  guandu: {
    title: "관도대전",
    year: 200,
    month: 2,
    factionId: "cao",
    selectedCityId: "xu",
    cityOwners: {
      xu: "cao",
      xia: "cao",
      chenliu: "cao",
      qiao: "cao",
      runan: "cao",
      langye: "cao",
      luoyang: "cao",
      ye: "yuan",
      bei: "yuan",
      nanpi: "yuan",
      pingyuan: "yuan",
      shou: "liu",
      jing: "liu",
      jianye: "sun",
    },
    log: "관도대전 시나리오가 시작되었습니다. 조조로 원소와 북방 패권을 겨루세요.",
  },
  "red-cliffs": {
    title: "적벽대전",
    year: 208,
    month: 7,
    factionId: "sun",
    selectedCityId: "jianye",
    cityOwners: {
      xu: "cao",
      ye: "cao",
      bei: "cao",
      xia: "cao",
      luoyang: "cao",
      changan: "cao",
      chenliu: "cao",
      qiao: "cao",
      runan: "cao",
      langye: "cao",
      nanpi: "cao",
      pingyuan: "cao",
      shou: "cao",
      jing: "liu",
      hanzhong: "liu",
      chengdu: "liu",
      ba: "liu",
      jianye: "sun",
      kuaiji: "sun",
      yuzhang: "sun",
      luling: "sun",
      wujun: "sun",
    },
    log: "적벽대전 시나리오가 시작되었습니다. 손권으로 강동을 지키고 조조의 남하를 막으세요.",
  },
  "three-kingdoms": {
    title: "위·촉·오의 정립",
    year: 221,
    month: 4,
    factionId: "liu",
    selectedCityId: "chengdu",
    cityOwners: {
      xu: "cao",
      ye: "cao",
      bei: "cao",
      xia: "cao",
      luoyang: "cao",
      changan: "cao",
      chenliu: "cao",
      qiao: "cao",
      runan: "cao",
      langye: "cao",
      nanpi: "cao",
      pingyuan: "cao",
      hongnong: "cao",
      jianye: "sun",
      kuaiji: "sun",
      yuzhang: "sun",
      luling: "sun",
      wujun: "sun",
      chengdu: "liu",
      hanzhong: "liu",
      ba: "liu",
      jing: "liu",
      wuling: "liu",
      lingling: "liu",
    },
    log: "위·촉·오 정립 시나리오가 시작되었습니다. 유비로 촉한의 북벌과 통일을 준비하세요.",
  },
  unification: {
    title: "천하통일의 길",
    year: 263,
    month: 1,
    factionId: "cao",
    selectedCityId: "luoyang",
    cityOwners: {
      xu: "cao",
      ye: "cao",
      bei: "cao",
      xia: "cao",
      luoyang: "cao",
      changan: "cao",
      tianshui: "cao",
      hanzhong: "cao",
      chenliu: "cao",
      qiao: "cao",
      runan: "cao",
      langye: "cao",
      hongnong: "cao",
      anding: "cao",
      wuwei: "cao",
      xiliang: "cao",
      nanpi: "cao",
      pingyuan: "cao",
      chengdu: "liu",
      ba: "liu",
      jianye: "sun",
      kuaiji: "sun",
      yuzhang: "sun",
      luling: "sun",
      wujun: "sun",
    },
    log: "천하통일의 길 시나리오가 시작되었습니다. 조조 세력으로 남은 촉과 오를 압박해 통일을 이루세요.",
  },
};

let state = createInitialState();
let autoProgressActive = false;
let autoProgressTimer = null;
let autoDomesticActive = false;
let autoDomesticTimer = null;
let autoTrainActive = false;
let autoTrainTimer = null;
let autoWarActive = false;
let autoWarTimer = null;
let mapOffset = { x: 0, y: 0 };
let mapScale = 1;
let battleAnimationTimer = null;
let officerListCollapsed = false;
let cityControlsCollapsed = false;
let mapDrag = {
  active: false,
  pointerId: null,
  startX: 0,
  startY: 0,
  originX: 0,
  originY: 0,
};

const els = {
  dateLabel: document.querySelector("#dateLabel"),
  factionLabel: document.querySelector("#factionLabel"),
  fameLabel: document.querySelector("#fameLabel"),
  objectiveLabel: document.querySelector("#objectiveLabel"),
  setupPanel: document.querySelector("#setupPanel"),
  factionChoices: document.querySelector("#factionChoices"),
  rulerPanel: document.querySelector("#rulerPanel"),
  rulerFactionBadge: document.querySelector("#rulerFactionBadge"),
  rulerPortrait: document.querySelector("#rulerPortrait"),
  rulerPortraitImage: document.querySelector("#rulerPortraitImage"),
  rulerName: document.querySelector("#rulerName"),
  rulerSummary: document.querySelector("#rulerSummary"),
  mapCanvas: document.querySelector("#mapCanvas"),
  mapViewport: document.querySelector("#mapViewport"),
  mapZoomOutButton: document.querySelector("#mapZoomOutButton"),
  mapZoomInButton: document.querySelector("#mapZoomInButton"),
  mapZoomLabel: document.querySelector("#mapZoomLabel"),
  resetMapButton: document.querySelector("#resetMapButton"),
  cityLayer: document.querySelector("#cityLayer"),
  battleLayer: document.querySelector("#battleLayer"),
  routeLines: document.querySelector("#routeLines"),
  cityName: document.querySelector("#cityName"),
  ownerBadge: document.querySelector("#ownerBadge"),
  cityVisual: document.querySelector("#cityVisual"),
  cityStats: document.querySelector("#cityStats"),
  cityControlsSummary: document.querySelector("#cityControlsSummary"),
  toggleCityControlsButton: document.querySelector("#toggleCityControlsButton"),
  commandPanel: document.querySelector("#commandPanel"),
  cityManagementPanel: document.querySelector("#cityManagementPanel"),
  cityNameInput: document.querySelector("#cityNameInput"),
  goldInput: document.querySelector("#goldInput"),
  foodInput: document.querySelector("#foodInput"),
  troopsInput: document.querySelector("#troopsInput"),
  applyResourceButton: document.querySelector("#applyResourceButton"),
  totalTroopsInput: document.querySelector("#totalTroopsInput"),
  distributeTotalTroopsButton: document.querySelector("#distributeTotalTroopsButton"),
  troopDistributionInfo: document.querySelector("#troopDistributionInfo"),
  rewardOfficer: document.querySelector("#rewardOfficer"),
  rewardAmount: document.querySelector("#rewardAmount"),
  rewardInfo: document.querySelector("#rewardInfo"),
  rewardButton: document.querySelector("#rewardButton"),
  rewardAllButton: document.querySelector("#rewardAllButton"),
  troopAssignInfo: document.querySelector("#troopAssignInfo"),
  troopOfficer: document.querySelector("#troopOfficer"),
  troopAmount: document.querySelector("#troopAmount"),
  assignTroopsButton: document.querySelector("#assignTroopsButton"),
  autoAssignTroopsButton: document.querySelector("#autoAssignTroopsButton"),
  officerMoveInfo: document.querySelector("#officerMoveInfo"),
  moveOfficer: document.querySelector("#moveOfficer"),
  moveTargetCity: document.querySelector("#moveTargetCity"),
  moveOfficerButton: document.querySelector("#moveOfficerButton"),
  balanceOfficersButton: document.querySelector("#balanceOfficersButton"),
  scoutInfo: document.querySelector("#scoutInfo"),
  scoutButton: document.querySelector("#scoutButton"),
  recruitInfo: document.querySelector("#recruitInfo"),
  recruitOfficer: document.querySelector("#recruitOfficer"),
  recruitButton: document.querySelector("#recruitButton"),
  officerListPanel: document.querySelector("#officerListPanel"),
  toggleOfficerListButton: document.querySelector("#toggleOfficerListButton"),
  officerListSummary: document.querySelector("#officerListSummary"),
  officerList: document.querySelector("#officerList"),
  commandQuota: document.querySelector("#commandQuota"),
  commandButtons: document.querySelector("#commandButtons"),
  attackTarget: document.querySelector("#attackTarget"),
  attackButton: document.querySelector("#attackButton"),
  progressPanel: document.querySelector("#progressPanel"),
  progressTitle: document.querySelector("#progressTitle"),
  progressPercent: document.querySelector("#progressPercent"),
  progressFill: document.querySelector("#progressFill"),
  progressText: document.querySelector("#progressText"),
  eventLog: document.querySelector("#eventLog"),
  endTurnButton: document.querySelector("#endTurnButton"),
  autoProgressButton: document.querySelector("#autoProgressButton"),
  autoDomesticButton: document.querySelector("#autoDomesticButton"),
  autoTrainButton: document.querySelector("#autoTrainButton"),
  autoWarButton: document.querySelector("#autoWarButton"),
  storyButton: document.querySelector("#storyButton"),
  saveSlot: document.querySelector("#saveSlot"),
  saveButton: document.querySelector("#saveButton"),
  loadButton: document.querySelector("#loadButton"),
  saveStatus: document.querySelector("#saveStatus"),
  newGameButton: document.querySelector("#newGameButton"),
  victoryModal: document.querySelector("#victoryModal"),
  victoryTitle: document.querySelector("#victoryTitle"),
  victoryMessage: document.querySelector("#victoryMessage"),
  victoryStats: document.querySelector("#victoryStats"),
  victoryCloseButton: document.querySelector("#victoryCloseButton"),
  victoryNewGameButton: document.querySelector("#victoryNewGameButton"),
  storyModal: document.querySelector("#storyModal"),
  storyCloseButton: document.querySelector("#storyCloseButton"),
};

function createInitialState() {
  const savedState = readSavedGameState();
  if (savedState) {
    return savedState;
  }

  return createScenarioState();
}

function createScenarioState(preset = {}) {
  const cities = withCityImages(structuredClone(scenario.cities));
  if (preset.cityOwners) {
    cities.forEach((city) => {
      if (preset.cityOwners[city.id]) {
        city.ownerFactionId = preset.cityOwners[city.id];
      }
    });
  }

  return {
    year: preset.year ?? scenario.year,
    month: preset.month ?? scenario.month,
    selectedFactionId: preset.factionId ?? null,
    selectedCityId: preset.selectedCityId ?? "shou",
    actedCityIds: [],
    cityActionCounts: {},
    isGameOver: false,
    factions: structuredClone(scenario.factions),
    cities,
    officers: withOfficerTroops(structuredClone(scenario.officers)),
    hiddenOfficers: structuredClone(scenario.hiddenOfficers),
    progress: createIdleProgress(),
    battleAnimation: null,
    victoryPopupDismissed: false,
    log: [preset.log ?? "새 시나리오가 시작되었습니다. 플레이할 세력을 선택하세요."],
  };
}

function readSavedGameRecord(slot = getSelectedSaveSlot()) {
  const saved = localStorage.getItem(getSaveSlotKey(slot)) ?? (slot === 1 ? localStorage.getItem(STORAGE_KEY) : null);
  if (!saved) return null;
  try {
    const parsed = JSON.parse(saved);
    if (parsed?.state) {
      return {
        savedAt: parsed.savedAt ?? null,
        state: parsed.state,
      };
    }
    return {
      savedAt: null,
      state: parsed,
    };
  } catch {
    localStorage.removeItem(getSaveSlotKey(slot));
    if (slot === 1) localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

function readSavedGameState(slot = getSelectedSaveSlot()) {
  const record = readSavedGameRecord(slot);
  return record ? normalizeState(record.state) : null;
}

function hasSavedGame(slot = getSelectedSaveSlot()) {
  return Boolean(readSavedGameRecord(slot));
}

function getSaveSlotKey(slot) {
  return `${SAVE_SLOT_PREFIX}${slot}`;
}

function getSelectedSaveSlot() {
  const elementValue = Number.parseInt(document.querySelector("#saveSlot")?.value, 10);
  if (Number.isInteger(elementValue) && elementValue >= 1 && elementValue <= SAVE_SLOT_COUNT) {
    return elementValue;
  }
  const storedValue = Number.parseInt(localStorage.getItem(SELECTED_SAVE_SLOT_KEY), 10);
  if (Number.isInteger(storedValue) && storedValue >= 1 && storedValue <= SAVE_SLOT_COUNT) {
    return storedValue;
  }
  return 1;
}

function normalizeState(nextState) {
  const cityActionCounts = { ...(nextState.cityActionCounts ?? {}) };
  if (!nextState.cityActionCounts && Array.isArray(nextState.actedCityIds)) {
    nextState.actedCityIds.forEach((cityId) => {
      cityActionCounts[cityId] = 1;
    });
  }
  const officers = withScenarioOfficers(Array.isArray(nextState.officers) ? nextState.officers : structuredClone(scenario.officers));

  return {
    ...nextState,
    actedCityIds: Array.isArray(nextState.actedCityIds) ? nextState.actedCityIds : [],
    cityActionCounts,
    cities: withScenarioCities(Array.isArray(nextState.cities) ? nextState.cities : structuredClone(scenario.cities)),
    officers,
    hiddenOfficers: withHiddenOfficerPool(Array.isArray(nextState.hiddenOfficers) ? nextState.hiddenOfficers : [], officers),
    progress: createIdleProgress(),
    battleAnimation: null,
    victoryPopupDismissed: Boolean(nextState.victoryPopupDismissed),
  };
}

function withScenarioCities(cities) {
  const savedById = new Map(cities.map((city) => [city.id, city]));
  const scenarioCityIds = new Set(scenario.cities.map((city) => city.id));
  const mergedCities = scenario.cities.map((scenarioCity) => {
    const savedCity = savedById.get(scenarioCity.id);
    return {
      ...scenarioCity,
      ...(savedCity ?? {}),
      image: savedCity?.image ?? scenarioCity.image ?? getDefaultCityImage(scenarioCity.id),
      adjacentCityIds: [...scenarioCity.adjacentCityIds],
    };
  });
  const customCities = cities.filter((city) => !scenarioCityIds.has(city.id));
  return withCityImages([...mergedCities, ...customCities]);
}

function withScenarioOfficers(officers) {
  const officerById = new Map(officers.map((officer) => [officer.id, officer]));
  scenario.officers.forEach((scenarioOfficer) => {
    if (!officerById.has(scenarioOfficer.id)) {
      officerById.set(scenarioOfficer.id, structuredClone(scenarioOfficer));
    }
  });
  return withOfficerTroops(Array.from(officerById.values()));
}

function withCityImages(cities) {
  return cities.map((city) => ({
    ...city,
    image: city.image ?? getDefaultCityImage(city.id),
  }));
}

function withHiddenOfficerPool(hiddenOfficers, officers) {
  const usedOfficerIds = new Set(officers.map((officer) => officer.id));
  const hiddenById = new Map(hiddenOfficers.filter((officer) => !usedOfficerIds.has(officer.id)).map((officer) => [officer.id, officer]));
  createHiddenOfficerPool().forEach((officer) => {
    if (!usedOfficerIds.has(officer.id) && !hiddenById.has(officer.id)) {
      hiddenById.set(officer.id, officer);
    }
  });
  return Array.from(hiddenById.values());
}

function withOfficerTroops(officers) {
  return officers.map((officer) => ({
    ...officer,
    troops: Number.isFinite(officer.troops) ? officer.troops : 0,
  }));
}

function createIdleProgress() {
  return {
    active: false,
    title: "명령 대기",
    message: "명령을 선택하면 진행 상황이 표시됩니다.",
    percent: 0,
  };
}

function render() {
  const playerFaction = getPlayerFaction();
  const selectedCity = getCity(state.selectedCityId) ?? state.cities[0];
  const owner = selectedCity ? getFaction(selectedCity.ownerFactionId) : null;
  const busy = isProcessing();

  syncVictoryState(playerFaction);

  els.dateLabel.textContent = `${state.year}년 ${state.month}월`;
  els.factionLabel.textContent = playerFaction ? `플레이어: ${playerFaction.name}` : "세력 선택 중";
  els.fameLabel.textContent = playerFaction
    ? `명성 ${getFactionFame(playerFaction.id)} / 도시당 명령 ${getFactionCommandLimit(playerFaction.id)}회`
    : "명성 -";
  els.objectiveLabel.textContent = state.isGameOver ? getGameOverText() : "목표: 모든 도시 통일";
  els.setupPanel.classList.toggle("hidden", Boolean(playerFaction));
  renderSaveSlots();
  els.endTurnButton.disabled = !playerFaction || state.isGameOver || busy;
  els.autoProgressButton.textContent = autoProgressActive ? "자동 중지" : "자동 진행";
  els.autoProgressButton.disabled = (!playerFaction || state.isGameOver) && !autoProgressActive;
  els.autoDomesticButton.textContent = autoDomesticActive ? "내정 중지" : "자동 내정";
  els.autoDomesticButton.disabled = (!playerFaction || state.isGameOver) && !autoDomesticActive;
  els.autoTrainButton.textContent = autoTrainActive ? "훈련 중지" : "자동 훈련";
  els.autoTrainButton.disabled = (!playerFaction || state.isGameOver) && !autoTrainActive;
  els.autoWarButton.textContent = autoWarActive ? "전쟁 중지" : "자동 전쟁";
  els.autoWarButton.disabled = (!playerFaction || state.isGameOver) && !autoWarActive;
  els.saveButton.disabled = !playerFaction || busy;
  els.loadButton.disabled = !hasSavedGame() || busy;
  els.newGameButton.disabled = busy;

  renderFactionChoices();
  renderRulerPanel(playerFaction);
  renderRoutes();
  renderCities();
  renderBattleAnimation();
  applyMapOffset();
  renderCityPanel(selectedCity, owner);
  renderCityControlsToggle(selectedCity, owner);
  renderCommands(selectedCity);
  renderProgress();
  renderSaveStatus();
  renderVictoryModal(playerFaction);
  renderLog();
}

function syncVictoryState(playerFaction) {
  if (!playerFaction || state.isGameOver) return;
  const ownsAllCities = state.cities.length > 0 && state.cities.every((city) => city.ownerFactionId === playerFaction.id);
  if (!ownsAllCities) return;

  state.isGameOver = true;
  state.victoryPopupDismissed = false;
  addLog(`${playerFaction.name} 세력이 천하를 통일했습니다. 승리입니다.`);
}

function renderVictoryModal(playerFaction) {
  const ownsAllCities = Boolean(playerFaction) && state.cities.every((city) => city.ownerFactionId === playerFaction.id);
  const shouldShow = Boolean(state.isGameOver && ownsAllCities && !state.victoryPopupDismissed);

  els.victoryModal.classList.toggle("hidden", !shouldShow);
  if (!shouldShow || !playerFaction) return;

  const ruler = state.officers.find((officer) => officer.id === playerFaction.rulerId);
  els.victoryTitle.textContent = `${playerFaction.name} 천하통일`;
  els.victoryMessage.textContent = `${ruler?.name ?? playerFaction.name}의 깃발 아래 모든 도시가 하나가 되었습니다.`;
  els.victoryStats.innerHTML = [
    ["도시", state.cities.length],
    ["장수", state.officers.filter((officer) => officer.factionId === playerFaction.id).length],
    ["연월", `${state.year}년 ${state.month}월`],
  ]
    .map(([label, value]) => `<div><span>${label}</span><strong>${value}</strong></div>`)
    .join("");
}

function openStoryModal() {
  els.storyModal.classList.remove("hidden");
}

function closeStoryModal() {
  els.storyModal.classList.add("hidden");
}

function startStoryScenario(storyId) {
  if (isProcessing()) return;
  const preset = storyScenarioPresets[storyId];
  if (!preset) return;
  stopAllAutomation();
  state = createScenarioState(preset);
  closeStoryModal();
  addLog(`${preset.title} 이야기를 선택했습니다. 지도와 군주 구성이 적용되었습니다.`);
  render();
  resetMapPosition();
}

function toggleOfficerList() {
  officerListCollapsed = !officerListCollapsed;
  render();
}

function toggleCityControls() {
  cityControlsCollapsed = !cityControlsCollapsed;
  render();
}

function renderFactionChoices() {
  els.factionChoices.innerHTML = "";
  state.factions.forEach((faction) => {
    const cityCount = state.cities.filter((city) => city.ownerFactionId === faction.id).length;
    const fame = getFactionFame(faction.id);
    const commandLimit = getFactionCommandLimit(faction.id);
    const button = document.createElement("button");
    button.className = "choice-button";
    button.type = "button";
    button.disabled = isProcessing();
    button.innerHTML = `<strong>${faction.name}</strong><span>도시 ${cityCount} / 명성 ${fame} / 명령 ${commandLimit}회<br>금 ${faction.gold} / 군량 ${faction.food}</span>`;
    button.style.borderColor = faction.color;
    button.addEventListener("click", () => chooseFaction(faction.id));
    els.factionChoices.append(button);
  });
}

function renderRulerPanel(playerFaction) {
  if (!playerFaction) {
    els.rulerFactionBadge.textContent = "-";
    els.rulerFactionBadge.style.borderColor = "";
    els.rulerFactionBadge.style.color = "";
    els.rulerName.textContent = "군주 선택 전";
    els.rulerSummary.textContent = "세력을 선택하면 군주의 얼굴이 표시됩니다.";
    applyPortraitStyle(null);
    return;
  }

  const ruler = state.officers.find((officer) => officer.id === playerFaction.rulerId);
  const cityCount = state.cities.filter((city) => city.ownerFactionId === playerFaction.id).length;
  const fame = getFactionFame(playerFaction.id);
  els.rulerFactionBadge.textContent = playerFaction.name;
  els.rulerFactionBadge.style.borderColor = playerFaction.color;
  els.rulerFactionBadge.style.color = playerFaction.color;
  els.rulerName.textContent = ruler ? ruler.name : playerFaction.name;
  els.rulerSummary.textContent = `보유 도시 ${cityCount} · 명성 ${fame} · 도시당 명령 ${getFactionCommandLimit(playerFaction.id)}회`;
  applyPortraitStyle(playerFaction);
}

function applyPortraitStyle(faction) {
  const portrait = faction?.portrait ?? {};
  els.rulerPortrait.style.setProperty("--ruler-color", faction?.color ?? "#2e6f5e");
  els.rulerPortrait.style.setProperty("--skin", portrait.skin ?? "#d9a979");
  els.rulerPortrait.style.setProperty("--hair", portrait.hair ?? "#2e241f");
  els.rulerPortrait.style.setProperty("--robe", faction?.color ?? "#2e6f5e");
  els.rulerPortrait.dataset.beard = portrait.beard ?? "short";
  els.rulerPortrait.dataset.hair = portrait.hairStyle ?? "crown";
  els.rulerPortraitImage.src = portrait.image ?? "";
  els.rulerPortraitImage.alt = faction ? `${faction.name} 군주 초상` : "";
}

function renderRoutes() {
  const rendered = new Set();
  const segments = [];
  state.cities.forEach((city) => {
    city.adjacentCityIds.forEach((targetId) => {
      const key = [city.id, targetId].sort().join("-");
      if (rendered.has(key)) return;
      rendered.add(key);
      const target = getCity(targetId);
      segments.push(`M ${city.x} ${city.y} L ${target.x} ${target.y}`);
    });
  });
  els.routeLines.setAttribute("d", segments.join(" "));
}

function renderCities() {
  const playerFaction = getPlayerFaction();
  els.cityLayer.innerHTML = "";
  state.cities.forEach((city) => {
    const faction = getFaction(city.ownerFactionId);
    const button = document.createElement("button");
    const isPlayerCity = playerFaction && city.ownerFactionId === playerFaction.id;
    const actionStatus = getCityActionStatus(city, playerFaction);
    const battleClass =
      state.battleAnimation?.fromCityId === city.id ? "battle-source" : state.battleAnimation?.toCityId === city.id ? "battle-target" : "";
    button.className = `city-node ${city.id === state.selectedCityId ? "selected" : ""} ${isPlayerCity ? "player-city" : "enemy-city"} ${actionStatus.className} ${battleClass}`;
    button.type = "button";
    button.disabled = isProcessing();
    button.style.left = `calc(${city.x}% - 58px)`;
    button.style.top = `calc(${city.y}% - 62px)`;
    button.style.borderColor = faction.color;
    button.innerHTML = `
      <img class="city-node-image" src="${escapeAttribute(getCityImage(city))}" alt="" loading="lazy" />
      <span class="city-name">${city.name}</span>
      <span class="city-meta">${faction.name}<br>장수 ${cityOfficers(city).length} / 병력 ${city.troops} / 훈련 ${city.training}</span>
      ${actionStatus.label ? `<span class="city-action-badge">${actionStatus.label}</span>` : ""}
    `;
    button.addEventListener("click", () => {
      state.selectedCityId = city.id;
      render();
    });
    els.cityLayer.append(button);
  });
}

function renderBattleAnimation() {
  const battle = state.battleAnimation;
  if (!battle?.active) {
    els.battleLayer.innerHTML = "";
    return;
  }
  const fromCity = getCity(battle.fromCityId);
  const toCity = getCity(battle.toCityId);
  if (!fromCity || !toCity) {
    els.battleLayer.innerHTML = "";
    return;
  }
  const angle = Math.atan2(toCity.y - fromCity.y, toCity.x - fromCity.x) * (180 / Math.PI);
  const midpointX = (fromCity.x + toCity.x) / 2;
  const midpointY = (fromCity.y + toCity.y) / 2;
  const attackTroops = getBattleTroops(fromCity);
  const defendTroops = getBattleTroops(toCity);
  els.battleLayer.innerHTML = `
    <div class="battle-haze" style="left:${midpointX}%; top:${midpointY}%;"></div>
    <div class="battle-line" style="left:${fromCity.x}%; top:${fromCity.y}%; width:${getBattleLineLength(fromCity, toCity)}%; transform:rotate(${angle}deg);"></div>
    <div class="battle-trail trail-one" style="--from-x:${fromCity.x}%; --from-y:${fromCity.y}%; --to-x:${toCity.x}%; --to-y:${toCity.y}%;"></div>
    <div class="battle-trail trail-two" style="--from-x:${fromCity.x}%; --from-y:${fromCity.y}%; --to-x:${toCity.x}%; --to-y:${toCity.y}%;"></div>
    <div class="battle-army attacking" style="--from-x:${fromCity.x}%; --from-y:${fromCity.y}%; --to-x:${toCity.x}%; --to-y:${toCity.y}%;">
      <span>⚔</span>
    </div>
    <div class="battle-army defending" style="left:${toCity.x}%; top:${toCity.y}%;">방</div>
    <div class="battle-slash slash-one" style="left:${toCity.x}%; top:${toCity.y}%;"></div>
    <div class="battle-slash slash-two" style="left:${toCity.x}%; top:${toCity.y}%;"></div>
    <div class="battle-spark spark-one" style="left:${toCity.x}%; top:${toCity.y}%;"></div>
    <div class="battle-spark spark-two" style="left:${toCity.x}%; top:${toCity.y}%;"></div>
    <div class="battle-spark spark-three" style="left:${toCity.x}%; top:${toCity.y}%;"></div>
    <div class="battle-smoke smoke-one" style="left:${toCity.x}%; top:${toCity.y}%;"></div>
    <div class="battle-smoke smoke-two" style="left:${toCity.x}%; top:${toCity.y}%;"></div>
    <div class="battle-smoke smoke-three" style="left:${toCity.x}%; top:${toCity.y}%;"></div>
    <div class="battle-impact" style="left:${toCity.x}%; top:${toCity.y}%;">격돌</div>
    <div class="battle-banner" style="left:${(fromCity.x + toCity.x) / 2}%; top:${(fromCity.y + toCity.y) / 2}%;">
      ${fromCity.name} → ${toCity.name}
      <span>공격 ${attackTroops} vs 방어 ${defendTroops}</span>
    </div>
    <div class="battle-status-card" style="left:${midpointX}%; top:${midpointY}%;">
      <strong>전투 중</strong>
      <span>${fromCity.name} 병력 ${attackTroops}</span>
      <span>${toCity.name} 병력 ${defendTroops}</span>
    </div>
  `;
}

function getBattleLineLength(fromCity, toCity) {
  const dx = toCity.x - fromCity.x;
  const dy = toCity.y - fromCity.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function startBattleAnimation(fromCity, toCity) {
  state.battleAnimation = {
    active: true,
    fromCityId: fromCity.id,
    toCityId: toCity.id,
  };
  if (battleAnimationTimer) {
    window.clearTimeout(battleAnimationTimer);
  }
  battleAnimationTimer = window.setTimeout(clearBattleAnimation, PROGRESS_DURATION_MS + PROGRESS_CLEAR_MS + 250);
}

function clearBattleAnimation() {
  if (battleAnimationTimer) {
    window.clearTimeout(battleAnimationTimer);
    battleAnimationTimer = null;
  }
  if (!state.battleAnimation?.active) return;
  state.battleAnimation = null;
  renderBattleAnimation();
}

function getCityActionStatus(city, playerFaction) {
  if (!playerFaction || city.ownerFactionId !== playerFaction.id) {
    return { className: "", label: "" };
  }
  const usedCount = getCityActionCount(city.id);
  const limit = getCityCommandLimit(city.id);
  if (usedCount >= limit) {
    return { className: "action-complete", label: "완료" };
  }
  if (usedCount > 0) {
    return { className: "action-partial", label: `${usedCount}/${limit}` };
  }
  return { className: "action-ready", label: `${limit}회` };
}

function applyMapOffset() {
  const clampedOffset = clampMapOffset(mapOffset.x, mapOffset.y);
  mapOffset = clampedOffset;
  els.mapViewport.style.transform = `translate3d(${Math.round(mapOffset.x)}px, ${Math.round(mapOffset.y)}px, 0) scale(${mapScale})`;
  renderMapZoomControls();
}

function clampMapOffset(x, y) {
  const canvasRect = getElementRect(els.mapCanvas, 1000, 800);
  const viewportSize = getMapViewportSize(canvasRect);
  const centeredX = Math.round((canvasRect.width - viewportSize.width) / 2);
  const centeredY = Math.round((canvasRect.height - viewportSize.height) / 2);
  const minX = Math.min(0, canvasRect.width - viewportSize.width);
  const minY = Math.min(0, canvasRect.height - viewportSize.height);
  return {
    x: viewportSize.width <= canvasRect.width ? centeredX : clamp(x, minX, 0),
    y: viewportSize.height <= canvasRect.height ? centeredY : clamp(y, minY, 0),
  };
}

function resetMapPosition() {
  const canvasRect = getElementRect(els.mapCanvas, 1000, 800);
  const viewportSize = getMapViewportSize(canvasRect);
  mapOffset = {
    x: Math.round((canvasRect.width - viewportSize.width) / 2),
    y: Math.round((canvasRect.height - viewportSize.height) / 2),
  };
  applyMapOffset();
}

function getMapViewportSize(canvasRect = getElementRect(els.mapCanvas, 1000, 800)) {
  return {
    width: canvasRect.width * MAP_VIEWPORT_WIDTH_RATIO * mapScale,
    height: canvasRect.height * MAP_VIEWPORT_HEIGHT_RATIO * mapScale,
  };
}

function changeMapZoom(direction) {
  setMapZoom(mapScale + direction * MAP_ZOOM_STEP);
}

function setMapZoom(nextScale) {
  const previousScale = mapScale;
  const clampedScale = Math.round(clamp(nextScale, MAP_ZOOM_MIN, MAP_ZOOM_MAX) * 100) / 100;
  if (clampedScale === previousScale) {
    renderMapZoomControls();
    return;
  }

  const canvasRect = getElementRect(els.mapCanvas, 1000, 800);
  const centerX = canvasRect.width / 2;
  const centerY = canvasRect.height / 2;
  const focusX = (centerX - mapOffset.x) / previousScale;
  const focusY = (centerY - mapOffset.y) / previousScale;

  mapScale = clampedScale;
  mapOffset = {
    x: centerX - focusX * mapScale,
    y: centerY - focusY * mapScale,
  };
  applyMapOffset();
}

function renderMapZoomControls() {
  els.mapZoomLabel.textContent = `${Math.round(mapScale * 100)}%`;
  els.mapZoomOutButton.disabled = mapScale <= MAP_ZOOM_MIN;
  els.mapZoomInButton.disabled = mapScale >= MAP_ZOOM_MAX;
}

function getElementRect(element, fallbackWidth, fallbackHeight) {
  if (typeof element.getBoundingClientRect === "function") {
    const rect = element.getBoundingClientRect();
    if (rect.width && rect.height) return rect;
  }
  return {
    width: fallbackWidth,
    height: fallbackHeight,
  };
}

function startMapDrag(event) {
  if (event.target.closest(".city-node, button, select, input, label")) return;
  mapDrag = {
    active: true,
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    originX: mapOffset.x,
    originY: mapOffset.y,
  };
  els.mapCanvas.classList.add("dragging");
  if (typeof els.mapCanvas.setPointerCapture === "function") {
    els.mapCanvas.setPointerCapture(event.pointerId);
  }
}

function moveMapDrag(event) {
  if (!mapDrag.active || event.pointerId !== mapDrag.pointerId) return;
  mapOffset = clampMapOffset(mapDrag.originX + event.clientX - mapDrag.startX, mapDrag.originY + event.clientY - mapDrag.startY);
  applyMapOffset();
}

function endMapDrag(event) {
  if (!mapDrag.active || event.pointerId !== mapDrag.pointerId) return;
  mapDrag.active = false;
  mapDrag.pointerId = null;
  els.mapCanvas.classList.remove("dragging");
  if (typeof els.mapCanvas.hasPointerCapture === "function" && els.mapCanvas.hasPointerCapture(event.pointerId)) {
    els.mapCanvas.releasePointerCapture(event.pointerId);
  }
}

function renderCityPanel(city, owner) {
  if (!city || !owner) return;
  const faction = getFaction(city.ownerFactionId);
  const disabled = isProcessing() ? "disabled" : "";
  els.cityName.innerHTML = `<input id="cityTitleInput" class="city-title-input" type="text" maxlength="16" value="${escapeAttribute(city.name)}" ${disabled} />`;
  els.ownerBadge.textContent = owner.name;
  els.ownerBadge.style.borderColor = owner.color;
  els.ownerBadge.style.color = owner.color;
  els.cityVisual.innerHTML = `
    <img src="${escapeAttribute(getCityImage(city))}" alt="${escapeAttribute(city.name)} 성 이미지" />
    <div>
      <strong>${city.name}</strong>
      <span>${owner.name} 세력의 거점</span>
    </div>
  `;
  els.cityStats.innerHTML = getCityStatFields(city, faction)
    .map((field) => renderCityStatInput(field, disabled))
    .join("");
  const officers = cityOfficers(city);
  renderResourceEditor(city, faction);
  renderRewardPanel(city, officers);
  renderTroopAssignPanel(city, officers);
  renderOfficerMovePanel(city, officers);
  renderScoutPanel(city, officers);
  renderRecruitPanel(city, officers);
  renderOfficerList(officers);
}

function renderCityControlsToggle(city, owner) {
  if (!city || !owner) return;
  els.commandPanel.classList.toggle("hidden", cityControlsCollapsed);
  els.cityManagementPanel.classList.toggle("hidden", cityControlsCollapsed);
  els.toggleCityControlsButton.textContent = cityControlsCollapsed ? "펼치기" : "접기";
  els.toggleCityControlsButton.setAttribute("aria-expanded", String(!cityControlsCollapsed));
  els.cityControlsSummary.textContent = cityControlsCollapsed
    ? `${city.name}의 명령과 관리 기능이 접혀 있습니다.`
    : `${city.name} · ${owner.name} 세력의 명령과 관리 기능을 표시 중입니다.`;
}

function renderOfficerList(officers) {
  els.officerListPanel.classList.toggle("collapsed", officerListCollapsed);
  els.toggleOfficerListButton.textContent = officerListCollapsed ? "펼치기" : "접기";
  els.toggleOfficerListButton.setAttribute("aria-expanded", String(!officerListCollapsed));
  els.officerListSummary.textContent = officers.length
    ? `현재 성 소속 장수 ${officers.length}명 · ${officerListCollapsed ? "상세 정보가 접혀 있습니다." : "능력치, 충성도, 병력을 바로 수정할 수 있습니다."}`
    : "현재 성에 소속 장수가 없습니다.";
  els.officerList.innerHTML = officers.length
    ? officers.map(renderOfficerCard).join("")
    : `<p class="empty">소속 장수가 없습니다.</p>`;
}

function getCityStatFields(city, faction) {
  return [
    { field: "gold", label: "금", value: faction.gold, step: 10 },
    { field: "food", label: "군량", value: faction.food, step: 10 },
    { field: "population", label: "인구", value: city.population, step: 1 },
    { field: "troops", label: "병력", value: city.troops, step: 10 },
    { field: "officers", label: "장수", value: cityOfficers(city).length, readOnly: true },
    { field: "development", label: "개발", value: city.development, step: 1, max: 100 },
    { field: "commerce", label: "상업", value: city.commerce, step: 1, max: 100 },
    { field: "order", label: "치안", value: city.order, step: 1, max: 100 },
    { field: "training", label: "훈련", value: city.training, step: 1, max: 100 },
  ];
}

function renderCityStatInput({ field, label, value, step, max }, disabled) {
  if (field === "officers") {
    return `<div class="stat"><span>${label}</span><strong>${value}</strong></div>`;
  }
  const maxAttribute = Number.isFinite(max) ? `max="${max}"` : "";
  return `
    <label class="stat stat-edit">
      <span>${label}</span>
      <input class="stat-input" data-city-stat-field="${field}" type="number" min="0" ${maxAttribute} step="${step}" value="${value}" ${disabled} />
    </label>
  `;
}

function renderResourceEditor(city, faction) {
  const disabled = isProcessing();
  const playerFaction = getPlayerFaction();
  const playerCities = playerFaction ? getFactionCities(playerFaction.id) : [];
  const totalTroops = playerCities.reduce((sum, item) => sum + item.troops, 0);
  if (document.activeElement !== els.cityNameInput) els.cityNameInput.value = city.name;
  if (document.activeElement !== els.goldInput) els.goldInput.value = faction.gold;
  if (document.activeElement !== els.foodInput) els.foodInput.value = faction.food;
  if (document.activeElement !== els.troopsInput) els.troopsInput.value = city.troops;
  if (document.activeElement !== els.totalTroopsInput) els.totalTroopsInput.value = totalTroops;
  els.cityNameInput.disabled = disabled;
  els.goldInput.disabled = disabled;
  els.foodInput.disabled = disabled;
  els.troopsInput.disabled = disabled;
  els.applyResourceButton.disabled = disabled;
  els.totalTroopsInput.disabled = disabled || !playerFaction || state.isGameOver;
  els.distributeTotalTroopsButton.disabled = disabled || !playerFaction || playerCities.length === 0 || state.isGameOver;
  els.troopDistributionInfo.textContent = playerFaction
    ? `${playerFaction.name} 보유 성 ${playerCities.length}곳에 현재 총병력 ${totalTroops}명을 나누어 배치합니다.`
    : "세력을 선택하면 보유 성 전체에 병력을 나눌 수 있습니다.";
}

function renderRewardPanel(city, officers) {
  const playerFaction = getPlayerFaction();
  const previousOfficerId = els.rewardOfficer.value;
  const canReward = playerFaction && city.ownerFactionId === playerFaction.id && officers.length > 0 && !state.isGameOver && !isProcessing();
  els.rewardOfficer.innerHTML = officers.length
    ? officers.map((officer) => `<option value="${officer.id}">${officer.name} / 충성 ${officer.loyalty}</option>`).join("")
    : `<option value="">포상할 장수 없음</option>`;
  if (officers.some((officer) => officer.id === previousOfficerId)) {
    els.rewardOfficer.value = previousOfficerId;
  }
  if (!els.rewardAmount.value) {
    els.rewardAmount.value = 100;
  }
  const amount = readPositiveInteger(els.rewardAmount.value, 100);
  const rewardableCount = officers.filter((officer) => officer.loyalty < 100).length;
  const allCost = amount * rewardableCount;
  const ownerText = playerFaction && city.ownerFactionId === playerFaction.id ? `전체 포상 대상 ${rewardableCount}명 · 필요 금 ${allCost}` : "플레이어 도시에서만 포상할 수 있습니다.";
  els.rewardInfo.textContent = `${ownerText} · 보유 금 ${getFaction(city.ownerFactionId).gold}`;
  els.rewardOfficer.disabled = !canReward;
  els.rewardAmount.disabled = !canReward;
  els.rewardButton.disabled = !canReward;
  els.rewardAllButton.disabled = !canReward || rewardableCount === 0;
}

function renderTroopAssignPanel(city, officers) {
  const playerFaction = getPlayerFaction();
  const previousOfficerId = els.troopOfficer.value;
  const assignedTroops = getAssignedTroops(city);
  const remainingTroops = Math.max(0, city.troops - assignedTroops);
  const canAssign = playerFaction && city.ownerFactionId === playerFaction.id && officers.length > 0 && !state.isGameOver && !isProcessing();
  els.troopOfficer.innerHTML = officers.length
    ? officers.map((officer) => `<option value="${officer.id}">${officer.name} / 담당 ${officer.troops ?? 0}</option>`).join("")
    : `<option value="">배분할 장수 없음</option>`;
  if (officers.some((officer) => officer.id === previousOfficerId)) {
    els.troopOfficer.value = previousOfficerId;
  }

  const selectedOfficer = officers.find((officer) => officer.id === els.troopOfficer.value) ?? officers[0];
  if (document.activeElement !== els.troopAmount) {
    els.troopAmount.value = selectedOfficer ? selectedOfficer.troops ?? 0 : 0;
  }

  const ownerText = playerFaction && city.ownerFactionId === playerFaction.id ? "배분 가능" : "플레이어 도시에서만 배분할 수 있습니다.";
  els.troopAssignInfo.textContent = `도시 총병력 ${city.troops} · 배분 ${assignedTroops} · 남은 병력 ${remainingTroops} · ${ownerText}`;
  els.troopOfficer.disabled = !canAssign;
  els.troopAmount.disabled = !canAssign;
  els.assignTroopsButton.disabled = !canAssign;
  els.autoAssignTroopsButton.disabled = !canAssign;
}

function renderOfficerMovePanel(city, officers) {
  const playerFaction = getPlayerFaction();
  const previousOfficerId = els.moveOfficer.value;
  const previousTargetId = els.moveTargetCity.value;
  const playerCities = playerFaction ? getFactionCities(playerFaction.id) : [];
  const playerOfficers = playerFaction ? getFactionOfficers(playerFaction.id) : [];
  const targetCities = playerFaction
    ? playerCities.filter((item) => item.id !== city.id)
    : [];
  const canMove =
    playerFaction &&
    city.ownerFactionId === playerFaction.id &&
    officers.length > 0 &&
    targetCities.length > 0 &&
    !state.isGameOver &&
    !isProcessing();
  const canBalance = playerFaction && playerCities.length > 0 && playerOfficers.length > 0 && !state.isGameOver && !isProcessing();

  els.moveOfficer.innerHTML = officers.length
    ? officers.map((officer) => `<option value="${officer.id}">${officer.name} / 병 ${officer.troops ?? 0}</option>`).join("")
    : `<option value="">이동할 장수 없음</option>`;
  if (officers.some((officer) => officer.id === previousOfficerId)) {
    els.moveOfficer.value = previousOfficerId;
  }

  els.moveTargetCity.innerHTML = targetCities.length
    ? targetCities.map((targetCity) => `<option value="${targetCity.id}">${targetCity.name}</option>`).join("")
    : `<option value="">이동 가능 도시 없음</option>`;
  if (targetCities.some((targetCity) => targetCity.id === previousTargetId)) {
    els.moveTargetCity.value = previousTargetId;
  }

  const ownerText =
    playerFaction && city.ownerFactionId === playerFaction.id
      ? `이동 가능 도시 ${targetCities.length}곳`
      : "플레이어 도시에서만 이동할 수 있습니다.";
  const balanceText = playerFaction ? `전체 배치: 장수 ${playerOfficers.length}명 / 보유 성 ${playerCities.length}곳` : "";
  els.officerMoveInfo.textContent = `${ownerText} · ${balanceText} · 이동 시 담당 병력은 0으로 초기화됩니다.`;
  els.moveOfficer.disabled = !canMove;
  els.moveTargetCity.disabled = !canMove;
  els.moveOfficerButton.disabled = !canMove;
  els.balanceOfficersButton.disabled = !canBalance;
}

function renderScoutPanel(city, officers) {
  const playerFaction = getPlayerFaction();
  const faction = getFaction(city.ownerFactionId);
  const hasHiddenOfficers = state.hiddenOfficers.length > 0;
  const canScout = playerFaction && city.ownerFactionId === playerFaction.id && hasHiddenOfficers && !state.isGameOver && !isProcessing();
  const bestCharm = officers.reduce((best, officer) => Math.max(best, officer.charm), 45);
  const chance = getScoutChance(bestCharm);
  const remainingText = hasHiddenOfficers ? `남은 재야 장수 ${state.hiddenOfficers.length}명` : "더 이상 찾을 재야 장수가 없습니다.";
  const ownerText = playerFaction && city.ownerFactionId === playerFaction.id ? `성공률 약 ${chance}%` : "플레이어 도시에서만 탐색할 수 있습니다.";
  els.scoutInfo.textContent = `비용 금 ${SCOUT_COST} · ${remainingText} · ${ownerText} · 보유 금 ${faction.gold}`;
  els.scoutButton.disabled = !canScout;
}

function renderRecruitPanel(city, officers) {
  const playerFaction = getPlayerFaction();
  const previousOfficerId = els.recruitOfficer.value;
  const targets = getRecruitableOfficers(playerFaction);
  const canRecruit = playerFaction && city.ownerFactionId === playerFaction.id && targets.length > 0 && !state.isGameOver && !isProcessing();
  els.recruitOfficer.innerHTML = targets.length
    ? targets
        .map((officer) => {
          const faction = getFaction(officer.factionId);
          const officerCity = getCity(officer.cityId);
          return `<option value="${officer.id}">${officer.name} / ${faction.name} / ${officerCity?.name ?? "소재 불명"} / 충성 ${officer.loyalty}</option>`;
        })
        .join("")
    : `<option value="">등용할 타 세력 장수 없음</option>`;
  if (targets.some((officer) => officer.id === previousOfficerId)) {
    els.recruitOfficer.value = previousOfficerId;
  }

  const selectedOfficer = targets.find((officer) => officer.id === els.recruitOfficer.value) ?? targets[0];
  if (selectedOfficer && playerFaction) {
    const cost = getRecruitCost(selectedOfficer);
    const chance = getRecruitChance(selectedOfficer, officers);
    const faction = getFaction(selectedOfficer.factionId);
    els.recruitInfo.textContent = `대상 ${selectedOfficer.name}(${faction.name}) · 비용 금 ${cost} · 성공률 약 ${chance}% · 보유 금 ${playerFaction.gold}`;
  } else {
    const ownerText = playerFaction && city.ownerFactionId === playerFaction.id ? "등용할 타 세력 장수가 없습니다." : "플레이어 도시에서만 등용할 수 있습니다.";
    els.recruitInfo.textContent = ownerText;
  }
  els.recruitOfficer.disabled = !canRecruit;
  els.recruitButton.disabled = !canRecruit;
}

function renderOfficerCard(officer) {
  const disabled = isProcessing() ? "disabled" : "";
  const fields = [
    ["leadership", "통", officer.leadership],
    ["war", "무", officer.war],
    ["intelligence", "지", officer.intelligence],
    ["politics", "정", officer.politics],
    ["charm", "매", officer.charm],
    ["loyalty", "충", officer.loyalty],
    ["troops", "병", officer.troops ?? 0, ""],
  ];

  return `
    <article class="officer-card officer-edit-card" data-officer-id="${officer.id}">
      <div class="officer-card-header">
        <strong>${officer.name}</strong>
        <button class="ghost-button officer-apply-button" type="button" data-officer-action="apply" data-officer-id="${officer.id}" ${disabled}>수정</button>
      </div>
      <div class="officer-edit-grid">
        ${fields
          .map(
            ([field, label, value, max = 'max="100"']) => `
              <label>
                ${label}
                <input id="officer-${officer.id}-${field}" data-officer-input="${officer.id}:${field}" type="number" min="0" ${max} step="1" value="${value}" ${disabled} />
              </label>
            `,
          )
          .join("")}
      </div>
    </article>
  `;
}

function renderCommands(city) {
  const playerFaction = getPlayerFaction();
  const canAct = playerFaction && city.ownerFactionId === playerFaction.id && canCityAct(city.id) && !state.isGameOver && !isProcessing();
  renderCommandQuota(city, playerFaction);
  els.commandButtons.innerHTML = "";

  commands.forEach((command) => {
    const button = document.createElement("button");
    button.className = "command-button";
    button.type = "button";
    button.disabled = !canAct;
    button.innerHTML = `<strong>${command.name}</strong><span>${command.text}</span>`;
    button.addEventListener("click", () => executeCommand(command.id));
    els.commandButtons.append(button);
  });

  const attackTargets = getAttackTargets(city);
  els.attackTarget.innerHTML = attackTargets.length
    ? attackTargets.map((target) => `<option value="${target.id}">${target.name} (${getFaction(target.ownerFactionId).name})</option>`).join("")
    : `<option value="">공격 가능 도시 없음</option>`;
  els.attackTarget.disabled = isProcessing();
  els.attackButton.disabled = !canAct || attackTargets.length === 0;
}

function renderCommandQuota(city, playerFaction) {
  if (!playerFaction) {
    els.commandQuota.innerHTML = `세력을 선택하면 명령 가능 횟수가 표시됩니다.`;
    return;
  }

  const playerCityIds = state.cities.filter((item) => item.ownerFactionId === playerFaction.id).map((item) => item.id);
  const fame = getFactionFame(playerFaction.id);
  const commandLimit = getFactionCommandLimit(playerFaction.id);
  const usedCount = playerCityIds.reduce((sum, cityId) => sum + getCityActionCount(cityId), 0);
  const totalCount = playerCityIds.length * commandLimit;
  const remainingCount = Math.max(0, totalCount - usedCount);
  const selectedUsedCount = getCityActionCount(city.id);
  const selectedStatus =
    city.ownerFactionId !== playerFaction.id
      ? `${city.name}은 다른 세력의 도시입니다.`
      : selectedUsedCount >= commandLimit
        ? `${city.name}은 이번 달 명령 ${commandLimit}회를 모두 사용했습니다.`
        : `${city.name}에서 ${commandLimit - selectedUsedCount}회 더 명령할 수 있습니다.`;

  els.commandQuota.innerHTML = `
    이번 달 명령 ${remainingCount}/${totalCount}회 남음
    <span>명성 ${fame} · 도시 1곳당 월 ${commandLimit}회 · 사용 ${usedCount}회 · 선택 도시 ${selectedUsedCount}/${commandLimit}회 사용 · ${selectedStatus}</span>
  `;
}

function renderProgress() {
  const progress = state.progress ?? createIdleProgress();
  els.progressTitle.textContent = progress.title;
  els.progressText.textContent = progress.message;
  els.progressPercent.textContent = `${progress.percent}%`;
  els.progressFill.style.width = `${progress.percent}%`;
  els.progressPanel.classList.toggle("active", progress.active);
}

function renderSaveSlots() {
  const selectedSlot = getSelectedSaveSlot();
  const options = [];
  for (let slot = 1; slot <= SAVE_SLOT_COUNT; slot += 1) {
    const record = readSavedGameRecord(slot);
    const label = record ? `슬롯 ${slot} · ${getSaveRecordLabel(record)}` : `슬롯 ${slot} · 비어 있음`;
    options.push(`<option value="${slot}">${label}</option>`);
  }
  els.saveSlot.innerHTML = options.join("");
  els.saveSlot.value = String(selectedSlot);
  els.saveSlot.disabled = isProcessing();
}

function renderSaveStatus() {
  const record = readSavedGameRecord();
  if (!record) {
    els.saveStatus.textContent = `슬롯 ${getSelectedSaveSlot()}: 저장 데이터 없음`;
    return;
  }
  els.saveStatus.textContent = `슬롯 ${getSelectedSaveSlot()}: ${getSaveRecordLabel(record)}`;
}

function getSaveRecordLabel(record) {
  const saveState = record.state ?? {};
  const faction = Array.isArray(saveState.factions) ? saveState.factions.find((item) => item.id === saveState.selectedFactionId) : null;
  const dateText = saveState.year && saveState.month ? `${saveState.year}년 ${saveState.month}월` : "날짜 미정";
  const factionText = faction ? faction.name : "세력 미선택";
  const savedText = record.savedAt ? formatSavedAt(record.savedAt) : "저장 시각 없음";
  return `${dateText} · ${factionText} · ${savedText}`;
}

function renderLog() {
  els.eventLog.innerHTML = state.log
    .slice(-12)
    .reverse()
    .map((item) => `<li>${item}</li>`)
    .join("");
}

function chooseFaction(factionId) {
  if (isProcessing()) return;
  state.selectedFactionId = factionId;
  const firstCity = state.cities.find((city) => city.ownerFactionId === factionId);
  state.selectedCityId = firstCity?.id ?? state.cities[0].id;
  addLog(`${getFaction(factionId).name} 세력으로 플레이를 시작했습니다.`);
  render();
}

function executeCommand(commandId) {
  if (isProcessing()) return;
  const city = getCity(state.selectedCityId);
  const faction = getPlayerFaction();
  const command = commands.find((item) => item.id === commandId);
  if (!city || !faction || !command) return;
  if (city.ownerFactionId !== faction.id) {
    addLog("다른 세력의 도시는 명령할 수 없습니다.");
    render();
    return;
  }
  if (!canCityAct(city.id)) {
    addLog(`${city.name}은 이번 달 명령 ${getCityCommandLimit(city.id)}회를 모두 사용했습니다.`);
    render();
    return;
  }

  runProgress({
    title: `${city.name} ${command.name} 진행`,
    steps: [
      `${city.name}에서 ${command.name} 명령을 접수했습니다.`,
      `담당 장수와 실행 인원을 배치하고 있습니다.`,
      `${command.name} 명령을 실행하는 중입니다.`,
      `결과를 정리하고 보고합니다.`,
    ],
    onComplete() {
      const completed = command.run(city, faction);
      if (completed) {
        markCityAction(city.id);
        checkGameOver();
      }
      return completed;
    },
  });
}

function attackSelectedTarget() {
  if (isProcessing()) return;
  const fromCity = getCity(state.selectedCityId);
  const toCity = getCity(els.attackTarget.value);
  const faction = getPlayerFaction();
  if (!fromCity || !toCity || !faction || fromCity.ownerFactionId !== faction.id) return;
  if (!canCityAct(fromCity.id)) {
    addLog(`${fromCity.name}은 이번 달 명령 ${getCityCommandLimit(fromCity.id)}회를 모두 사용했습니다.`);
    render();
    return;
  }
  runBattleProgress(fromCity, toCity);
}

function runBattleProgress(fromCity, toCity) {
  startBattleAnimation(fromCity, toCity);
  runProgress({
    title: `${fromCity.name} 출진`,
    steps: [
      `${fromCity.name}에서 출진 명령을 내렸습니다.`,
      `${toCity.name} 방면으로 군량과 병력을 점검합니다.`,
      `${toCity.name} 전장에서 교전이 시작되었습니다.`,
      `전투 결과를 보고합니다.`,
    ],
    onComplete() {
      resolveBattle(fromCity, toCity, true);
      markCityAction(fromCity.id);
      checkGameOver();
      return true;
    },
  });
}

function endTurn() {
  if (!getPlayerFaction() || state.isGameOver || isProcessing()) return;
  runProgress({
    title: "월말 처리 진행",
    steps: [
      "각 도시의 수입을 계산하고 있습니다.",
      "다른 세력의 명령을 처리하고 있습니다.",
      "전황과 사건 기록을 정리하고 있습니다.",
      "다음 달로 넘어갑니다.",
    ],
    onComplete() {
      collectIncome();
      runAiTurn();
      advanceDate();
      state.actedCityIds = [];
      state.cityActionCounts = {};
      checkGameOver();
      return true;
    },
  });
}

function toggleAutoProgress() {
  if (autoProgressActive) {
    stopAutoProgress("자동 진행을 중지했습니다.");
    return;
  }
  const playerFaction = getPlayerFaction();
  if (!playerFaction || state.isGameOver) return;
  if (autoWarActive) {
    stopAutoWar("자동 전쟁을 중지하고 자동 진행을 시작합니다.");
  }
  if (autoTrainActive) {
    stopAutoTrain("자동 훈련을 중지하고 자동 진행을 시작합니다.");
  }
  if (autoDomesticActive) {
    stopAutoDomestic("자동 내정을 중지하고 자동 진행을 시작합니다.");
  }
  autoProgressActive = true;
  addLog("자동 진행을 시작했습니다. 모든 보유 성의 개발, 상업, 치안, 훈련을 100으로 만든 뒤 가까운 적 성을 공격합니다.");
  render();
  scheduleAutoProgressStep(120);
}

function stopAutoProgress(message) {
  autoProgressActive = false;
  if (autoProgressTimer) {
    window.clearTimeout(autoProgressTimer);
    autoProgressTimer = null;
  }
  if (message) addLog(message);
  render();
}

function scheduleAutoProgressStep(delay = AUTO_PROGRESS_DELAY_MS) {
  if (!autoProgressActive) return;
  if (autoProgressTimer) window.clearTimeout(autoProgressTimer);
  autoProgressTimer = window.setTimeout(runAutoProgressStep, delay);
}

function runAutoProgressStep() {
  autoProgressTimer = null;
  if (!autoProgressActive) return;
  const playerFaction = getPlayerFaction();
  if (!playerFaction || state.isGameOver) {
    stopAutoProgress();
    return;
  }
  if (isProcessing()) {
    scheduleAutoProgressStep();
    return;
  }

  const playerCities = getFactionCities(playerFaction.id);
  const domesticPlan = getAutoProgressDomesticPlan(playerCities, playerFaction);
  if (domesticPlan) {
    state.selectedCityId = domesticPlan.city.id;
    render();
    executeCommand(domesticPlan.command.id);
    return;
  }

  if (!isAutoProgressReadyForWar(playerCities)) {
    endTurn();
    return;
  }

  if (!playerCities.some((city) => canCityAct(city.id))) {
    endTurn();
    return;
  }

  const battlePlan = getAutoProgressBattlePlan(playerCities);
  if (!battlePlan) {
    stopAutoProgress("자동 진행할 인접 적 성이 없습니다. 모든 성을 점령했거나 공격 경로가 없습니다.");
    return;
  }

  state.selectedCityId = battlePlan.fromCity.id;
  render();
  runBattleProgress(battlePlan.fromCity, battlePlan.toCity);
}

function getAutoProgressCommand(city, faction) {
  const candidates = [
    { id: "develop", value: city.development, canUse: () => city.development < 100 && canAfford(faction, 70, 0) },
    { id: "commerce", value: city.commerce, canUse: () => city.commerce < 100 && canAfford(faction, 60, 0) },
    { id: "order", value: city.order, canUse: () => city.order < 100 && canAfford(faction, 45, 0) },
    { id: "train", value: city.training, canUse: () => city.training < 100 && canAfford(faction, 35, 45) },
  ]
    .filter((item) => item.canUse())
    .sort((a, b) => a.value - b.value);
  const selected = candidates[0];
  return selected ? commands.find((command) => command.id === selected.id) : null;
}

function getAutoProgressDomesticPlan(cities, faction) {
  return cities
    .filter((city) => canCityAct(city.id))
    .map((city) => ({ city, command: getAutoProgressCommand(city, faction) }))
    .find((plan) => plan.command) ?? null;
}

function isAutoProgressReadyForWar(cities) {
  return cities.every((city) => city.development >= 100 && city.commerce >= 100 && city.order >= 100 && city.training >= 100);
}

function getAutoProgressBattlePlan(cities) {
  const plans = [];
  cities
    .filter((city) => canCityAct(city.id))
    .forEach((fromCity) => {
      getAttackTargets(fromCity).forEach((toCity) => {
        plans.push({
          fromCity,
          toCity,
          distance: getCityDistance(fromCity, toCity),
        });
      });
    });
  return plans.sort((a, b) => a.distance - b.distance)[0] ?? null;
}

function getCityDistance(fromCity, toCity) {
  const dx = toCity.x - fromCity.x;
  const dy = toCity.y - fromCity.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function canAfford(faction, gold, food) {
  return faction.gold >= gold && faction.food >= food;
}

function toggleAutoDomestic() {
  if (autoDomesticActive) {
    stopAutoDomestic("자동 내정을 중지했습니다.");
    return;
  }
  const playerFaction = getPlayerFaction();
  if (!playerFaction || state.isGameOver) return;
  if (autoProgressActive) {
    stopAutoProgress("자동 진행을 중지하고 자동 내정을 시작합니다.");
  }
  if (autoTrainActive) {
    stopAutoTrain("자동 훈련을 중지하고 자동 내정을 시작합니다.");
  }
  if (autoWarActive) {
    stopAutoWar("자동 전쟁을 중지하고 자동 내정을 시작합니다.");
  }
  autoDomesticActive = true;
  addLog("자동 내정을 시작했습니다. 개발, 상업, 치안 명령만 자동으로 수행합니다.");
  render();
  scheduleAutoDomesticStep(120);
}

function stopAutoDomestic(message) {
  autoDomesticActive = false;
  if (autoDomesticTimer) {
    window.clearTimeout(autoDomesticTimer);
    autoDomesticTimer = null;
  }
  if (message) addLog(message);
  render();
}

function scheduleAutoDomesticStep(delay = AUTO_PROGRESS_DELAY_MS) {
  if (!autoDomesticActive) return;
  if (autoDomesticTimer) window.clearTimeout(autoDomesticTimer);
  autoDomesticTimer = window.setTimeout(runAutoDomesticStep, delay);
}

function runAutoDomesticStep() {
  autoDomesticTimer = null;
  if (!autoDomesticActive) return;
  const playerFaction = getPlayerFaction();
  if (!playerFaction || state.isGameOver) {
    stopAutoDomestic();
    return;
  }
  if (isProcessing()) {
    scheduleAutoDomesticStep();
    return;
  }

  const playerCities = getFactionCities(playerFaction.id);
  const needsDomestic = playerCities.some((city) => city.development < 100 || city.commerce < 100 || city.order < 100);
  if (!needsDomestic) {
    stopAutoDomestic("모든 보유 성의 개발, 상업, 치안이 최대치입니다. 자동 내정을 중지했습니다.");
    return;
  }
  if (!canUseAnyDomesticCommand(playerCities, playerFaction)) {
    stopAutoDomestic("자동 내정에 필요한 자원이 부족합니다. 개발/상업/치안 명령을 수행할 수 없습니다.");
    return;
  }

  const plan = getAutoDomesticPlan(playerCities, playerFaction);
  if (!plan) {
    endTurn();
    return;
  }

  state.selectedCityId = plan.city.id;
  render();
  executeCommand(plan.command.id);
}

function getAutoDomesticPlan(cities, faction) {
  return cities
    .filter((city) => canCityAct(city.id))
    .map((city) => ({ city, command: getAutoDomesticCommand(city, faction) }))
    .find((plan) => plan.command) ?? null;
}

function getAutoDomesticCommand(city, faction) {
  const candidates = [
    { id: "develop", value: city.development, canUse: () => city.development < 100 && canAfford(faction, 70, 0) },
    { id: "commerce", value: city.commerce, canUse: () => city.commerce < 100 && canAfford(faction, 60, 0) },
    { id: "order", value: city.order, canUse: () => city.order < 100 && canAfford(faction, 45, 0) },
  ]
    .filter((item) => item.canUse())
    .sort((a, b) => a.value - b.value);
  const selected = candidates[0];
  return selected ? commands.find((command) => command.id === selected.id) : null;
}

function canUseAnyDomesticCommand(cities, faction) {
  return cities.some((city) => getAutoDomesticCommand(city, faction));
}

function toggleAutoTrain() {
  if (autoTrainActive) {
    stopAutoTrain("자동 훈련을 중지했습니다.");
    return;
  }
  const playerFaction = getPlayerFaction();
  if (!playerFaction || state.isGameOver) return;
  if (autoProgressActive) {
    stopAutoProgress("자동 진행을 중지하고 자동 훈련을 시작합니다.");
  }
  if (autoDomesticActive) {
    stopAutoDomestic("자동 내정을 중지하고 자동 훈련을 시작합니다.");
  }
  if (autoWarActive) {
    stopAutoWar("자동 전쟁을 중지하고 자동 훈련을 시작합니다.");
  }
  autoTrainActive = true;
  addLog("자동 훈련을 시작했습니다. 보유 성의 병사 훈련을 자동으로 수행합니다.");
  render();
  scheduleAutoTrainStep(120);
}

function stopAutoTrain(message) {
  autoTrainActive = false;
  if (autoTrainTimer) {
    window.clearTimeout(autoTrainTimer);
    autoTrainTimer = null;
  }
  if (message) addLog(message);
  render();
}

function scheduleAutoTrainStep(delay = AUTO_PROGRESS_DELAY_MS) {
  if (!autoTrainActive) return;
  if (autoTrainTimer) window.clearTimeout(autoTrainTimer);
  autoTrainTimer = window.setTimeout(runAutoTrainStep, delay);
}

function runAutoTrainStep() {
  autoTrainTimer = null;
  if (!autoTrainActive) return;
  const playerFaction = getPlayerFaction();
  if (!playerFaction || state.isGameOver) {
    stopAutoTrain();
    return;
  }
  if (isProcessing()) {
    scheduleAutoTrainStep();
    return;
  }

  const playerCities = getFactionCities(playerFaction.id);
  const hasUntrainedCity = playerCities.some((city) => city.training < 100);
  if (!hasUntrainedCity) {
    stopAutoTrain("모든 보유 성의 훈련이 최대치입니다. 자동 훈련을 중지했습니다.");
    return;
  }

  const nextCity = playerCities.find((city) => city.training < 100 && canCityAct(city.id));
  if (!nextCity) {
    endTurn();
    return;
  }

  if (!canAfford(playerFaction, 35, 45)) {
    stopAutoTrain(`자동 훈련에 필요한 자원이 부족합니다. 필요: 금 35, 군량 45`);
    return;
  }

  state.selectedCityId = nextCity.id;
  render();
  executeCommand("train");
}

function toggleAutoWar() {
  if (autoWarActive) {
    stopAutoWar("자동 전쟁을 중지했습니다.");
    return;
  }
  const playerFaction = getPlayerFaction();
  if (!playerFaction || state.isGameOver) return;
  if (autoProgressActive) {
    stopAutoProgress("자동 진행을 중지하고 자동 전쟁을 시작합니다.");
  }
  if (autoDomesticActive) {
    stopAutoDomestic("자동 내정을 중지하고 자동 전쟁을 시작합니다.");
  }
  if (autoTrainActive) {
    stopAutoTrain("자동 훈련을 중지하고 자동 전쟁을 시작합니다.");
  }
  autoWarActive = true;
  addLog("자동 전쟁을 시작했습니다. 인접 적 도시 중 가장 유리한 전투를 자동으로 선택합니다.");
  render();
  scheduleAutoWarStep(120);
}

function stopAutoWar(message) {
  autoWarActive = false;
  if (autoWarTimer) {
    window.clearTimeout(autoWarTimer);
    autoWarTimer = null;
  }
  if (message) addLog(message);
  render();
}

function scheduleAutoWarStep(delay = AUTO_PROGRESS_DELAY_MS) {
  if (!autoWarActive) return;
  if (autoWarTimer) window.clearTimeout(autoWarTimer);
  autoWarTimer = window.setTimeout(runAutoWarStep, delay);
}

function runAutoWarStep() {
  autoWarTimer = null;
  if (!autoWarActive) return;
  const playerFaction = getPlayerFaction();
  if (!playerFaction || state.isGameOver) {
    stopAutoWar();
    return;
  }
  if (isProcessing()) {
    scheduleAutoWarStep();
    return;
  }

  const hasActionCity = state.cities.some((city) => city.ownerFactionId === playerFaction.id && canCityAct(city.id));
  if (!hasActionCity) {
    endTurn();
    return;
  }

  const plan = getAutoWarPlan(playerFaction);
  if (!plan) {
    stopAutoWar("자동 전쟁 대상이 없습니다. 인접한 적 도시가 없거나 명령 가능한 공격 도시가 없습니다.");
    return;
  }

  state.selectedCityId = plan.fromCity.id;
  render();
  runBattleProgress(plan.fromCity, plan.toCity);
}

function getAutoWarPlan(playerFaction) {
  const plans = [];
  state.cities
    .filter((city) => city.ownerFactionId === playerFaction.id && canCityAct(city.id))
    .forEach((fromCity) => {
      getAttackTargets(fromCity).forEach((toCity) => {
        plans.push({
          fromCity,
          toCity,
          score: getAutoWarScore(fromCity, toCity),
        });
      });
    });
  return plans.sort((a, b) => b.score - a.score)[0] ?? null;
}

function getAutoWarScore(fromCity, toCity) {
  const attackTroops = getBattleTroops(fromCity);
  const defendTroops = Math.max(1, getBattleTroops(toCity));
  const attackOfficerPower = getBattleOfficerPower(fromCity, 120);
  const defendOfficerPower = getBattleOfficerPower(toCity, 110);
  const attackEstimate = attackTroops * (0.75 + fromCity.training / 100) * (attackOfficerPower / 150);
  const defendEstimate = defendTroops * (0.85 + toCity.training / 100) * (toCity.order / 90) * (defendOfficerPower / 150);
  return attackEstimate / Math.max(1, defendEstimate);
}

function runProgress({ title, steps, onComplete }) {
  const progressSteps = steps.length ? steps : ["명령을 준비합니다.", "명령을 실행합니다.", "결과를 보고합니다."];
  const stepDelay = Math.floor(PROGRESS_DURATION_MS / progressSteps.length);
  state.progress = {
    active: true,
    title,
    message: progressSteps[0],
    percent: 5,
  };
  render();

  progressSteps.forEach((step, index) => {
    window.setTimeout(() => {
      if (!state.progress.active) return;
      state.progress.message = step;
      state.progress.percent = Math.min(94, Math.round(((index + 1) / progressSteps.length) * 92));
      renderProgress();
    }, stepDelay * index);
  });

  window.setTimeout(() => {
    const completed = onComplete();
    state.progress = {
      active: false,
      title: completed ? "완료" : "진행 실패",
      message: completed ? "명령이 완료되어 결과가 반영되었습니다." : "명령을 완료하지 못했습니다. 사건 기록을 확인하세요.",
      percent: 100,
    };
    render();
    if (autoProgressActive) {
      scheduleAutoProgressStep(PROGRESS_CLEAR_MS + AUTO_PROGRESS_DELAY_MS);
    }
    if (autoDomesticActive) {
      scheduleAutoDomesticStep(PROGRESS_CLEAR_MS + AUTO_PROGRESS_DELAY_MS);
    }
    if (autoTrainActive) {
      scheduleAutoTrainStep(PROGRESS_CLEAR_MS + AUTO_PROGRESS_DELAY_MS);
    }
    if (autoWarActive) {
      scheduleAutoWarStep(PROGRESS_CLEAR_MS + AUTO_PROGRESS_DELAY_MS);
    }

    window.setTimeout(() => {
      if (state.progress.active) return;
      state.progress = createIdleProgress();
      renderProgress();
    }, PROGRESS_CLEAR_MS);
  }, PROGRESS_DURATION_MS);
}

function isProcessing() {
  return Boolean(state.progress?.active);
}

function collectIncome() {
  state.cities.forEach((city) => {
    const faction = getFaction(city.ownerFactionId);
    faction.gold += Math.round(city.commerce * 0.9 + city.order * 0.25);
    faction.food += Math.round(city.development * 1.2 + city.population * 0.08);
  });
  addLog("각 세력이 도시 수입을 거두었습니다.");
}

function runAiTurn() {
  state.factions
    .filter((faction) => faction.id !== state.selectedFactionId)
    .forEach((faction) => {
      const cities = state.cities.filter((city) => city.ownerFactionId === faction.id);
      cities.forEach((city) => runAiCityTurn(city, faction));
    });
}

function runAiCityTurn(city, faction) {
  const possibleTargets = getAttackTargets(city).filter((target) => target.ownerFactionId !== faction.id);
  const weakTarget = possibleTargets.find((target) => city.troops > target.troops * 1.35 && city.training >= target.training - 8);
  if (weakTarget && Math.random() < 0.44) {
    resolveBattle(city, weakTarget, false);
    return;
  }

  const choice = Math.random();
  if (choice < 0.28 && spend(faction, 35, 35, false)) {
    city.training = clamp(city.training + 5, 0, 100);
    addLog(`${withSubject(faction.name)} ${city.name}의 병사를 훈련했습니다.`);
  } else if (choice < 0.56 && spend(faction, 45, 0, false)) {
    city.development = clamp(city.development + 4, 0, 100);
    city.commerce = clamp(city.commerce + 3, 0, 100);
    addLog(`${withSubject(faction.name)} ${city.name}의 내정을 정비했습니다.`);
  } else if (spend(faction, 30, 55, false)) {
    const gained = 18 + Math.floor(Math.random() * 20);
    city.troops += gained;
    city.order = clamp(city.order - 2, 0, 100);
    addLog(`${withSubject(faction.name)} ${city.name}에서 병력을 모았습니다.`);
  }
}

function resolveBattle(fromCity, toCity, isPlayerAttack) {
  const attacker = getFaction(fromCity.ownerFactionId);
  const defender = getFaction(toCity.ownerFactionId);
  const attackTroops = getBattleTroops(fromCity);
  const defendTroops = getBattleTroops(toCity);
  const attackOfficerPower = getBattleOfficerPower(fromCity, 120);
  const defendOfficerPower = getBattleOfficerPower(toCity, 110);
  const attackPower = attackTroops * (0.75 + fromCity.training / 100) * (attackOfficerPower / 150) * randomRange(0.82, 1.18);
  const defendPower = defendTroops * (0.85 + toCity.training / 100) * (toCity.order / 90) * (defendOfficerPower / 150) * randomRange(0.82, 1.18);

  if (attackPower > defendPower) {
    const survivorRate = clamp(0.5 + (attackPower - defendPower) / Math.max(attackPower, 1) * 0.25, 0.32, 0.72);
    const remaining = Math.max(1, Math.round(attackTroops * survivorRate));
    const attackerLoss = Math.max(0, attackTroops - remaining);
    fromCity.troops = Math.max(25, fromCity.troops - attackerLoss);
    reduceOfficerTroops(fromCity, attackerLoss);
    toCity.ownerFactionId = attacker.id;
    toCity.troops = remaining;
    toCity.training = clamp(Math.round((toCity.training + fromCity.training) / 2) - 4, 20, 100);
    toCity.order = clamp(toCity.order - 10, 15, 100);
    moveOfficersAfterConquest(toCity, attacker.id);
    clampOfficerTroopsForCity(fromCity);
    clampOfficerTroopsForCity(toCity);
    addLog(`${withSubject(attacker.name)} ${defender.name}의 ${toCity.name}을 점령했습니다.`);
    if (isPlayerAttack) state.selectedCityId = toCity.id;
  } else {
    const lost = Math.round(attackTroops * randomRange(0.28, 0.46));
    const defenderLost = Math.round(defendTroops * randomRange(0.12, 0.28));
    fromCity.troops = Math.max(20, fromCity.troops - lost);
    toCity.troops = Math.max(20, toCity.troops - defenderLost);
    toCity.order = clamp(toCity.order - 3, 0, 100);
    reduceOfficerTroops(fromCity, lost);
    reduceOfficerTroops(toCity, defenderLost);
    clampOfficerTroopsForCity(fromCity);
    clampOfficerTroopsForCity(toCity);
    addLog(`${attacker.name}의 ${toCity.name} 공격이 실패했습니다.`);
  }
}

function moveOfficersAfterConquest(city, newFactionId) {
  const oldOfficers = state.officers.filter((officer) => officer.cityId === city.id && officer.factionId !== newFactionId);
  oldOfficers.forEach((officer) => {
    officer.factionId = newFactionId;
    officer.troops = 0;
    officer.loyalty = clamp(Math.round(officer.loyalty * 0.58), 30, 82);
  });

  const nearestOfficer = state.officers.find((officer) => officer.factionId === newFactionId);
  if (nearestOfficer && !state.officers.some((officer) => officer.cityId === city.id && officer.factionId === newFactionId)) {
    nearestOfficer.cityId = city.id;
  }
}

function advanceDate() {
  state.month += 1;
  if (state.month > 12) {
    state.month = 1;
    state.year += 1;
  }
}

function checkGameOver() {
  const aliveFactionIds = new Set(state.cities.map((city) => city.ownerFactionId));
  const playerFaction = getPlayerFaction();
  if (!playerFaction) return;
  if (!aliveFactionIds.has(playerFaction.id)) {
    state.isGameOver = true;
    addLog(`${playerFaction.name} 세력이 멸망했습니다. 패배입니다.`);
    return;
  }
  if (aliveFactionIds.size === 1 && aliveFactionIds.has(playerFaction.id)) {
    state.isGameOver = true;
    state.victoryPopupDismissed = false;
    addLog(`${playerFaction.name} 세력이 천하를 통일했습니다. 승리입니다.`);
  }
}

function getGameOverText() {
  const playerFaction = getPlayerFaction();
  if (!playerFaction) return "게임 종료";
  const ownsAll = state.cities.every((city) => city.ownerFactionId === playerFaction.id);
  return ownsAll ? "승리: 천하 통일" : "패배: 세력 멸망";
}

function spend(faction, gold, food, showWarning = true) {
  if (faction.gold < gold || faction.food < food) {
    if (showWarning) addLog(`${faction.name}의 자원이 부족합니다. 필요: 금 ${gold}, 군량 ${food}`);
    return false;
  }
  faction.gold -= gold;
  faction.food -= food;
  return true;
}

function getAttackTargets(city) {
  const playerFaction = getPlayerFaction();
  return city.adjacentCityIds
    .map(getCity)
    .filter(Boolean)
    .filter((target) => target.ownerFactionId !== city.ownerFactionId)
    .filter((target) => !playerFaction || city.ownerFactionId !== playerFaction.id || target.ownerFactionId !== playerFaction.id);
}

function cityOfficers(city) {
  return state.officers.filter((officer) => officer.cityId === city.id && officer.factionId === city.ownerFactionId);
}

function getRecruitableOfficers(playerFaction) {
  if (!playerFaction) return [];
  return state.officers
    .filter((officer) => officer.factionId !== playerFaction.id)
    .filter((officer) => !isRulerOfficer(officer))
    .sort((a, b) => getRecruitCost(a) - getRecruitCost(b));
}

function isRulerOfficer(officer) {
  return state.factions.some((faction) => faction.rulerId === officer.id);
}

function getOfficerTalent(officer) {
  return Math.round((officer.leadership + officer.war + officer.intelligence + officer.politics + officer.charm) / 5);
}

function getRecruitCost(officer) {
  return RECRUIT_BASE_COST + officer.loyalty * 3 + getOfficerTalent(officer);
}

function getRecruitChance(officer, localOfficers) {
  const bestCharm = localOfficers.reduce((best, item) => Math.max(best, item.charm), 45);
  return clamp(Math.round(30 + (100 - officer.loyalty) * 0.55 + bestCharm * 0.25), 12, 85);
}

function getCityActionCount(cityId) {
  return state.cityActionCounts?.[cityId] ?? 0;
}

function canCityAct(cityId) {
  return getCityActionCount(cityId) < getCityCommandLimit(cityId);
}

function markCityAction(cityId) {
  if (!state.cityActionCounts) state.cityActionCounts = {};
  state.cityActionCounts[cityId] = Math.min(getCityActionCount(cityId) + 1, getCityCommandLimit(cityId));
  if (!state.actedCityIds.includes(cityId)) {
    state.actedCityIds.push(cityId);
  }
}

function getCityCommandLimit(cityId) {
  const city = getCity(cityId);
  return city ? getFactionCommandLimit(city.ownerFactionId) : MIN_CITY_COMMAND_LIMIT;
}

function getFactionCommandLimit(factionId) {
  const fame = getFactionFame(factionId);
  if (fame >= 90) return MAX_CITY_COMMAND_LIMIT;
  if (fame >= 60) return 3;
  if (fame >= 30) return 2;
  return MIN_CITY_COMMAND_LIMIT;
}

function getFactionFame(factionId) {
  const cityCount = state.cities.filter((city) => city.ownerFactionId === factionId).length;
  return clamp(cityCount * 10, 0, 100);
}

function getAssignedTroops(city) {
  return cityOfficers(city).reduce((sum, officer) => sum + (officer.troops ?? 0), 0);
}

function getBattleTroops(city) {
  const assignedTroops = getAssignedTroops(city);
  return assignedTroops > 0 ? assignedTroops : city.troops;
}

function getBattleOfficerPower(city, fallback) {
  const officers = cityOfficers(city);
  if (!officers.length) return fallback;
  const assignedTroops = getAssignedTroops(city);
  if (assignedTroops <= 0) {
    return officers.reduce((best, officer) => Math.max(best, officer.leadership + officer.war), fallback);
  }

  const weightedPower = officers.reduce((sum, officer) => {
    const officerTroops = officer.troops ?? 0;
    return sum + (officer.leadership + officer.war) * (officerTroops / assignedTroops);
  }, 0);
  return Math.max(fallback, weightedPower);
}

function reduceOfficerTroops(city, loss) {
  const assignedTroops = getAssignedTroops(city);
  if (assignedTroops <= 0 || loss <= 0) return;

  const officers = cityOfficers(city).filter((officer) => (officer.troops ?? 0) > 0);
  const targetLoss = Math.min(loss, assignedTroops);
  let appliedLoss = 0;
  officers.forEach((officer) => {
    const currentTroops = officer.troops ?? 0;
    const reduction = Math.min(currentTroops, Math.floor((currentTroops / assignedTroops) * targetLoss));
    officer.troops = currentTroops - reduction;
    appliedLoss += reduction;
  });

  let remainder = targetLoss - appliedLoss;
  officers.forEach((officer) => {
    if (remainder <= 0 || officer.troops <= 0) return;
    officer.troops -= 1;
    remainder -= 1;
  });
}

function clampOfficerTroopsForCity(city) {
  let overflow = getAssignedTroops(city) - city.troops;
  if (overflow <= 0) return;
  const officers = cityOfficers(city).slice().reverse();
  officers.forEach((officer) => {
    if (overflow <= 0) return;
    const currentTroops = officer.troops ?? 0;
    const reduction = Math.min(currentTroops, overflow);
    officer.troops = currentTroops - reduction;
    overflow -= reduction;
  });
}

function getCity(cityId) {
  return state.cities.find((city) => city.id === cityId);
}

function getDefaultCityImage(cityId) {
  return `${CITY_IMAGE_BASE}/${cityId}.png`;
}

function getCityImage(city) {
  return city.image || getDefaultCityImage(city.id);
}

function getFaction(factionId) {
  return state.factions.find((faction) => faction.id === factionId);
}

function getPlayerFaction() {
  return state.selectedFactionId ? getFaction(state.selectedFactionId) : null;
}

function getFactionCities(factionId) {
  return state.cities.filter((city) => city.ownerFactionId === factionId);
}

function getFactionOfficers(factionId) {
  return state.officers.filter((officer) => officer.factionId === factionId);
}

function addLog(message) {
  state.log.push(`${state.year}년 ${state.month}월: ${message}`);
}

function withSubject(name) {
  return `${name}${hasFinalConsonant(name) ? "이" : "가"}`;
}

function withObject(name) {
  return `${name}${hasFinalConsonant(name) ? "을" : "를"}`;
}

function hasFinalConsonant(text) {
  const lastCode = text.charCodeAt(text.length - 1);
  if (lastCode < 0xac00 || lastCode > 0xd7a3) return false;
  return (lastCode - 0xac00) % 28 !== 0;
}

function randomRange(min, max) {
  return min + Math.random() * (max - min);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function saveGame() {
  if (isProcessing()) return;
  const slot = getSelectedSaveSlot();
  addLog(`슬롯 ${slot}에 현재 진행 상황을 저장했습니다.`);
  localStorage.setItem(
    getSaveSlotKey(slot),
    JSON.stringify({
      savedAt: new Date().toISOString(),
      state: makeSaveState(),
    }),
  );
  render();
}

function loadGame() {
  if (isProcessing()) return;
  const slot = getSelectedSaveSlot();
  const loadedState = readSavedGameState(slot);
  if (!loadedState) {
    addLog(`슬롯 ${slot}에 불러올 저장 데이터가 없습니다.`);
    render();
    return;
  }
  state = loadedState;
  localStorage.setItem(SELECTED_SAVE_SLOT_KEY, String(slot));
  addLog(`슬롯 ${slot}의 저장 데이터를 불러왔습니다.`);
  render();
}

function makeSaveState() {
  return {
    ...state,
    progress: createIdleProgress(),
  };
}

function formatSavedAt(savedAt) {
  const date = new Date(savedAt);
  if (Number.isNaN(date.getTime())) return "알 수 없음";
  return date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function applyResourceEdit() {
  if (isProcessing()) return;
  const city = getCity(state.selectedCityId);
  if (!city) return;
  const faction = getFaction(city.ownerFactionId);
  const previousName = city.name;
  const nextName = (els.cityNameInput.value || "").trim().slice(0, 16) || city.name;
  const nextGold = readNonNegativeInteger(els.goldInput.value, faction.gold);
  const nextFood = readNonNegativeInteger(els.foodInput.value, faction.food);
  const nextTroops = readNonNegativeInteger(els.troopsInput.value, city.troops);

  city.name = nextName;
  faction.gold = nextGold;
  faction.food = nextFood;
  city.troops = nextTroops;
  clampOfficerTroopsForCity(city);
  const nameText = previousName === city.name ? `${city.name}의` : `${previousName}의 이름을 ${city.name}(으)로 변경하고`;
  addLog(`${nameText} 도시 정보를 수정했습니다. 금 ${nextGold}, 군량 ${nextFood}, 병력 ${nextTroops}`);
  render();
}

function distributeTotalTroops() {
  if (isProcessing()) return;
  const playerFaction = getPlayerFaction();
  if (!playerFaction || state.isGameOver) return;

  const playerCities = getFactionCities(playerFaction.id);
  if (!playerCities.length) return;

  const currentTotalTroops = playerCities.reduce((sum, city) => sum + city.troops, 0);
  const totalTroops = readNonNegativeInteger(els.totalTroopsInput.value, currentTotalTroops);
  const baseTroops = Math.floor(totalTroops / playerCities.length);
  let remainder = totalTroops % playerCities.length;

  playerCities.forEach((city) => {
    city.troops = baseTroops + (remainder > 0 ? 1 : 0);
    remainder -= 1;
    clampOfficerTroopsForCity(city);
  });

  addLog(`${playerFaction.name}의 전체 병력 ${totalTroops}명을 보유 성 ${playerCities.length}곳에 균등 배분했습니다.`);
  render();
}

function applyCityNameInlineEdit(value) {
  if (isProcessing()) return;
  const city = getCity(state.selectedCityId);
  if (!city) return;
  const previousName = city.name;
  const nextName = (value || "").trim().slice(0, 16) || previousName;
  if (previousName === nextName) {
    render();
    return;
  }

  city.name = nextName;
  addLog(`${previousName}의 이름을 ${city.name}(으)로 변경했습니다.`);
  render();
}

function applyCityStatInlineEdit(field, value) {
  if (isProcessing()) return;
  const city = getCity(state.selectedCityId);
  if (!city) return;
  const faction = getFaction(city.ownerFactionId);
  const targets = {
    gold: { object: faction, key: "gold", label: "금", fallback: faction.gold },
    food: { object: faction, key: "food", label: "군량", fallback: faction.food },
    population: { object: city, key: "population", label: "인구", fallback: city.population },
    troops: { object: city, key: "troops", label: "병력", fallback: city.troops },
    development: { object: city, key: "development", label: "개발", fallback: city.development, max: 100 },
    commerce: { object: city, key: "commerce", label: "상업", fallback: city.commerce, max: 100 },
    order: { object: city, key: "order", label: "치안", fallback: city.order, max: 100 },
    training: { object: city, key: "training", label: "훈련", fallback: city.training, max: 100 },
  };
  const target = targets[field];
  if (!target) return;

  const nextValue = Number.isFinite(target.max)
    ? readBoundedInteger(value, target.fallback, 0, target.max)
    : readNonNegativeInteger(value, target.fallback);
  const previousValue = target.object[target.key];
  target.object[target.key] = nextValue;
  if (field === "troops") {
    clampOfficerTroopsForCity(city);
  }
  if (previousValue !== nextValue) {
    addLog(`${city.name}의 ${target.label}을 ${previousValue}에서 ${nextValue}(으)로 수정했습니다.`);
  }
  render();
}

function applyOfficerEdit(officerId) {
  if (isProcessing()) return;
  const city = getCity(state.selectedCityId);
  const officer = state.officers.find((item) => item.id === officerId);
  if (!city || !officer || officer.cityId !== city.id) return;

  const nextStats = {
    leadership: readBoundedInteger(readOfficerInput(officer.id, "leadership"), officer.leadership, 1, 100),
    war: readBoundedInteger(readOfficerInput(officer.id, "war"), officer.war, 1, 100),
    intelligence: readBoundedInteger(readOfficerInput(officer.id, "intelligence"), officer.intelligence, 1, 100),
    politics: readBoundedInteger(readOfficerInput(officer.id, "politics"), officer.politics, 1, 100),
    charm: readBoundedInteger(readOfficerInput(officer.id, "charm"), officer.charm, 1, 100),
    loyalty: readBoundedInteger(readOfficerInput(officer.id, "loyalty"), officer.loyalty, 0, 100),
    troops: readNonNegativeInteger(readOfficerInput(officer.id, "troops"), officer.troops ?? 0),
  };
  const otherAssigned = cityOfficers(city)
    .filter((item) => item.id !== officer.id)
    .reduce((sum, item) => sum + (item.troops ?? 0), 0);
  if (otherAssigned + nextStats.troops > city.troops) {
    const maxAssignable = Math.max(0, city.troops - otherAssigned);
    addLog(`${city.name}의 남은 병력이 부족합니다. ${officer.name}에게는 최대 ${maxAssignable}까지 배분할 수 있습니다.`);
    render();
    const troopInput = getOfficerInput(officer.id, "troops");
    if (troopInput) troopInput.value = maxAssignable;
    return;
  }

  Object.assign(officer, nextStats);
  addLog(
    `${officer.name}의 능력치를 수정했습니다. 통 ${officer.leadership}, 무 ${officer.war}, 지 ${officer.intelligence}, 정 ${officer.politics}, 매 ${officer.charm}, 충성 ${officer.loyalty}, 병력 ${officer.troops ?? 0}`,
  );
  render();
}

function assignTroopsToOfficer() {
  if (isProcessing()) return;
  const city = getCity(state.selectedCityId);
  const playerFaction = getPlayerFaction();
  const officer = state.officers.find((item) => item.id === els.troopOfficer.value);
  if (!city || !playerFaction || !officer) return;
  if (city.ownerFactionId !== playerFaction.id || officer.factionId !== playerFaction.id || officer.cityId !== city.id) {
    addLog("병력 배분은 플레이어 도시의 소속 장수에게만 할 수 있습니다.");
    render();
    return;
  }

  const nextTroops = readNonNegativeInteger(els.troopAmount.value, officer.troops ?? 0);
  const otherAssigned = cityOfficers(city)
    .filter((item) => item.id !== officer.id)
    .reduce((sum, item) => sum + (item.troops ?? 0), 0);
  if (otherAssigned + nextTroops > city.troops) {
    const maxAssignable = Math.max(0, city.troops - otherAssigned);
    addLog(`${city.name}의 남은 병력이 부족합니다. ${officer.name}에게는 최대 ${maxAssignable}까지 배분할 수 있습니다.`);
    render();
    els.troopAmount.value = maxAssignable;
    return;
  }

  const before = officer.troops ?? 0;
  officer.troops = nextTroops;
  addLog(`${officer.name}의 담당 병력을 ${before}에서 ${nextTroops}으로 조정했습니다.`);
  render();
}

function autoAssignTroops() {
  if (isProcessing()) return;
  const city = getCity(state.selectedCityId);
  const playerFaction = getPlayerFaction();
  if (!city || !playerFaction) return;
  const officers = cityOfficers(city);
  if (city.ownerFactionId !== playerFaction.id) {
    addLog("병력 자동 배분은 플레이어 도시에서만 할 수 있습니다.");
    render();
    return;
  }
  if (officers.length === 0) {
    addLog(`${city.name}에는 병력을 배분할 장수가 없습니다.`);
    render();
    return;
  }

  const baseTroops = Math.floor(city.troops / officers.length);
  let remainder = city.troops % officers.length;
  officers.forEach((officer) => {
    officer.troops = baseTroops + (remainder > 0 ? 1 : 0);
    if (remainder > 0) remainder -= 1;
  });

  const summary = officers.map((officer) => `${officer.name} ${officer.troops}`).join(", ");
  addLog(`${city.name}의 병력 ${city.troops}을 장수 ${officers.length}명에게 자동 배분했습니다. ${summary}`);
  render();
}

function moveOfficerToCity() {
  if (isProcessing()) return;
  const fromCity = getCity(state.selectedCityId);
  const toCity = getCity(els.moveTargetCity.value);
  const playerFaction = getPlayerFaction();
  const officer = state.officers.find((item) => item.id === els.moveOfficer.value);
  if (!fromCity || !toCity || !playerFaction || !officer) return;
  if (fromCity.ownerFactionId !== playerFaction.id || toCity.ownerFactionId !== playerFaction.id) {
    addLog("장수 이동은 플레이어가 소유한 도시 사이에서만 할 수 있습니다.");
    render();
    return;
  }
  if (officer.factionId !== playerFaction.id || officer.cityId !== fromCity.id) {
    addLog("선택한 장수는 현재 도시 소속이 아닙니다.");
    render();
    return;
  }
  if (fromCity.id === toCity.id) {
    addLog("같은 도시로는 이동할 수 없습니다.");
    render();
    return;
  }

  const releasedTroops = officer.troops ?? 0;
  officer.cityId = toCity.id;
  officer.troops = 0;
  addLog(`${withObject(officer.name)} ${fromCity.name}에서 ${toCity.name}으로 이동시켰습니다. 담당 병력 ${releasedTroops}은 ${fromCity.name}에 남았습니다.`);
  render();
}

function balanceOfficersAcrossCities() {
  if (isProcessing()) return;
  const playerFaction = getPlayerFaction();
  if (!playerFaction || state.isGameOver) return;

  const playerCities = getFactionCities(playerFaction.id);
  const playerOfficers = getFactionOfficers(playerFaction.id);
  if (!playerCities.length || !playerOfficers.length) return;

  playerOfficers.forEach((officer, index) => {
    const targetCity = playerCities[index % playerCities.length];
    officer.cityId = targetCity.id;
    officer.troops = 0;
  });

  playerCities.forEach(clampOfficerTroopsForCity);
  const summary = playerCities.map((city) => `${city.name} ${cityOfficers(city).length}명`).join(", ");
  addLog(`${playerFaction.name} 소속 장수 ${playerOfficers.length}명을 보유 성 ${playerCities.length}곳에 균등 배치했습니다. ${summary}`);
  render();
}

function rewardOfficer() {
  if (isProcessing()) return;
  const city = getCity(state.selectedCityId);
  const playerFaction = getPlayerFaction();
  const officer = state.officers.find((item) => item.id === els.rewardOfficer.value);
  if (!city || !playerFaction || !officer) return;
  if (city.ownerFactionId !== playerFaction.id || officer.factionId !== playerFaction.id || officer.cityId !== city.id) {
    addLog("포상은 플레이어 도시의 소속 장수에게만 줄 수 있습니다.");
    render();
    return;
  }
  if (officer.loyalty >= 100) {
    addLog(`${officer.name}의 충성도는 이미 100입니다.`);
    render();
    return;
  }

  const amount = readPositiveInteger(els.rewardAmount.value, 100);
  const faction = getFaction(playerFaction.id);
  if (!spend(faction, amount, 0)) {
    render();
    return;
  }

  const before = officer.loyalty;
  const gain = Math.max(1, Math.ceil(amount / 10));
  officer.loyalty = clamp(officer.loyalty + gain, 0, 100);
  addLog(`${officer.name}에게 금 ${amount}을 포상해 충성도가 ${before}에서 ${officer.loyalty}로 올랐습니다.`);
  render();
}

function rewardAllOfficers() {
  if (isProcessing()) return;
  const city = getCity(state.selectedCityId);
  const playerFaction = getPlayerFaction();
  if (!city || !playerFaction) return;
  const officers = cityOfficers(city);
  if (city.ownerFactionId !== playerFaction.id || officers.length === 0) {
    addLog("전체 포상은 플레이어 도시의 소속 장수에게만 줄 수 있습니다.");
    render();
    return;
  }

  const amount = readPositiveInteger(els.rewardAmount.value, 100);
  const rewardTargets = officers.filter((officer) => officer.loyalty < 100);
  if (rewardTargets.length === 0) {
    addLog(`${city.name}의 모든 장수 충성도가 이미 100입니다.`);
    render();
    return;
  }

  const totalCost = amount * rewardTargets.length;
  const faction = getFaction(playerFaction.id);
  if (!spend(faction, totalCost, 0)) {
    render();
    return;
  }

  const gain = Math.max(1, Math.ceil(amount / 10));
  const summary = rewardTargets
    .map((officer) => {
      const before = officer.loyalty;
      officer.loyalty = clamp(officer.loyalty + gain, 0, 100);
      return `${officer.name} ${before}->${officer.loyalty}`;
    })
    .join(", ");
  addLog(`${city.name}의 장수 ${rewardTargets.length}명에게 금 ${totalCost}을 전체 포상했습니다. ${summary}`);
  render();
}

function recruitForeignOfficer() {
  if (isProcessing()) return;
  const city = getCity(state.selectedCityId);
  const playerFaction = getPlayerFaction();
  const officer = state.officers.find((item) => item.id === els.recruitOfficer.value);
  if (!city || !playerFaction || !officer) return;
  if (city.ownerFactionId !== playerFaction.id) {
    addLog("타 세력 장수 등용은 플레이어가 소유한 도시에서만 할 수 있습니다.");
    render();
    return;
  }
  if (officer.factionId === playerFaction.id || isRulerOfficer(officer)) {
    addLog("선택한 장수는 등용 대상이 아닙니다.");
    render();
    return;
  }

  const fromFaction = getFaction(officer.factionId);
  const fromCity = getCity(officer.cityId);
  const cost = getRecruitCost(officer);
  const chance = getRecruitChance(officer, cityOfficers(city));
  if (!spend(playerFaction, cost, 0)) {
    render();
    return;
  }

  if (Math.random() * 100 >= chance) {
    const loyaltyLoss = Math.max(1, Math.floor((100 - officer.loyalty) / 12));
    officer.loyalty = clamp(officer.loyalty - loyaltyLoss, 25, 100);
    addLog(`${city.name}에서 ${fromFaction.name}의 ${officer.name} 등용을 시도했지만 실패했습니다. 충성도가 흔들려 ${officer.loyalty}가 되었습니다.`);
    render();
    return;
  }

  const releasedTroops = officer.troops ?? 0;
  officer.factionId = playerFaction.id;
  officer.cityId = city.id;
  officer.troops = 0;
  officer.loyalty = clamp(65 + Math.floor((100 - officer.loyalty) / 3), 55, 95);
  if (fromCity) clampOfficerTroopsForCity(fromCity);
  addLog(`${fromFaction.name}의 ${officer.name}을 ${city.name}으로 등용했습니다. 담당 병력 ${releasedTroops}은 원래 도시 ${fromCity?.name ?? "소재지"}에 남았습니다.`);
  render();
}

function scoutOfficer() {
  if (isProcessing()) return;
  const city = getCity(state.selectedCityId);
  const playerFaction = getPlayerFaction();
  if (!city || !playerFaction) return;
  if (city.ownerFactionId !== playerFaction.id) {
    addLog("인재 탐색은 플레이어가 소유한 도시에서만 할 수 있습니다.");
    render();
    return;
  }
  if (state.hiddenOfficers.length === 0) {
    addLog("더 이상 찾을 재야 장수가 없습니다.");
    render();
    return;
  }

  const faction = getFaction(playerFaction.id);
  if (!spend(faction, SCOUT_COST, 0)) {
    render();
    return;
  }

  const bestCharm = cityOfficers(city).reduce((best, officer) => Math.max(best, officer.charm), 45);
  const chance = getScoutChance(bestCharm);
  if (Math.random() * 100 >= chance) {
    addLog(`${city.name}에서 인재를 탐색했지만 성과가 없었습니다.`);
    render();
    return;
  }

  const foundIndex = Math.floor(Math.random() * state.hiddenOfficers.length);
  const foundOfficer = state.hiddenOfficers.splice(foundIndex, 1)[0];
  const recruitedOfficer = {
    ...foundOfficer,
    factionId: playerFaction.id,
    cityId: city.id,
    troops: 0,
    loyalty: clamp(foundOfficer.loyalty, 40, 100),
  };
  state.officers.push(recruitedOfficer);
  addLog(`${city.name}에서 ${withObject(recruitedOfficer.name)} 찾아 ${playerFaction.name} 세력에 등용했습니다.`);
  render();
}

function getScoutChance(bestCharm) {
  return clamp(Math.round(35 + bestCharm * 0.55), 45, 88);
}

function escapeAttribute(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function readNonNegativeInteger(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) return fallback;
  return Math.max(0, parsed);
}

function readBoundedInteger(value, fallback, min, max) {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) return fallback;
  return clamp(parsed, min, max);
}

function getOfficerInput(officerId, field) {
  return document.querySelector(`#officer-${officerId}-${field}`);
}

function readOfficerInput(officerId, field) {
  const input = getOfficerInput(officerId, field);
  return input ? input.value : "";
}

function readPositiveInteger(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) return fallback;
  return Math.max(1, parsed);
}

function stopAllAutomation() {
  if (autoProgressActive) {
    stopAutoProgress();
  }
  if (autoDomesticActive) {
    stopAutoDomestic();
  }
  if (autoTrainActive) {
    stopAutoTrain();
  }
  if (autoWarActive) {
    stopAutoWar();
  }
}

function newGame() {
  if (isProcessing()) return;
  stopAllAutomation();
  state = createScenarioState();
  render();
}

els.endTurnButton.addEventListener("click", endTurn);
els.autoProgressButton.addEventListener("click", toggleAutoProgress);
els.autoDomesticButton.addEventListener("click", toggleAutoDomestic);
els.autoTrainButton.addEventListener("click", toggleAutoTrain);
els.autoWarButton.addEventListener("click", toggleAutoWar);
els.attackButton.addEventListener("click", attackSelectedTarget);
els.mapCanvas.addEventListener("pointerdown", startMapDrag);
els.mapCanvas.addEventListener("pointermove", moveMapDrag);
els.mapCanvas.addEventListener("pointerup", endMapDrag);
els.mapCanvas.addEventListener("pointercancel", endMapDrag);
els.mapZoomOutButton.addEventListener("click", () => changeMapZoom(-1));
els.mapZoomInButton.addEventListener("click", () => changeMapZoom(1));
els.resetMapButton.addEventListener("click", resetMapPosition);
if (typeof window.addEventListener === "function") {
  window.addEventListener("resize", applyMapOffset);
}
els.saveSlot.addEventListener("change", () => {
  localStorage.setItem(SELECTED_SAVE_SLOT_KEY, els.saveSlot.value);
  render();
});
els.saveButton.addEventListener("click", saveGame);
els.loadButton.addEventListener("click", loadGame);
els.applyResourceButton.addEventListener("click", applyResourceEdit);
els.distributeTotalTroopsButton.addEventListener("click", distributeTotalTroops);
els.cityName.addEventListener("change", (event) => {
  if (event.target.id !== "cityTitleInput") return;
  applyCityNameInlineEdit(event.target.value);
});
els.cityName.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" || event.target.id !== "cityTitleInput") return;
  applyCityNameInlineEdit(event.target.value);
  event.target.blur();
});
els.cityStats.addEventListener("change", (event) => {
  const input = event.target.closest("[data-city-stat-field]");
  if (!input) return;
  applyCityStatInlineEdit(input.dataset.cityStatField, input.value);
});
els.cityStats.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") return;
  const input = event.target.closest("[data-city-stat-field]");
  if (!input) return;
  applyCityStatInlineEdit(input.dataset.cityStatField, input.value);
  input.blur();
});
els.officerList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-officer-action='apply']");
  if (!button) return;
  applyOfficerEdit(button.dataset.officerId);
});
els.toggleCityControlsButton.addEventListener("click", toggleCityControls);
els.toggleOfficerListButton.addEventListener("click", toggleOfficerList);
els.assignTroopsButton.addEventListener("click", assignTroopsToOfficer);
els.autoAssignTroopsButton.addEventListener("click", autoAssignTroops);
els.moveOfficerButton.addEventListener("click", moveOfficerToCity);
els.balanceOfficersButton.addEventListener("click", balanceOfficersAcrossCities);
els.troopOfficer.addEventListener("change", () => {
  const officer = state.officers.find((item) => item.id === els.troopOfficer.value);
  els.troopAmount.value = officer ? officer.troops ?? 0 : 0;
});
els.rewardButton.addEventListener("click", rewardOfficer);
els.rewardAllButton.addEventListener("click", rewardAllOfficers);
els.rewardAmount.addEventListener("input", () => {
  const city = getCity(state.selectedCityId);
  if (!city) return;
  renderRewardPanel(city, cityOfficers(city));
});
els.scoutButton.addEventListener("click", scoutOfficer);
els.recruitOfficer.addEventListener("change", () => {
  const city = getCity(state.selectedCityId);
  if (!city) return;
  renderRecruitPanel(city, cityOfficers(city));
});
els.recruitButton.addEventListener("click", recruitForeignOfficer);
els.storyButton.addEventListener("click", openStoryModal);
els.storyCloseButton.addEventListener("click", closeStoryModal);
els.storyModal.addEventListener("click", (event) => {
  const button = event.target.closest("[data-story-id]");
  if (button) {
    startStoryScenario(button.dataset.storyId);
    return;
  }
  if (event.target === els.storyModal) closeStoryModal();
});
els.newGameButton.addEventListener("click", newGame);
els.victoryCloseButton.addEventListener("click", () => {
  state.victoryPopupDismissed = true;
  render();
});
els.victoryNewGameButton.addEventListener("click", newGame);

render();
resetMapPosition();
