import type { Lang } from '../i18n/ui';

// 셋 재우고 — After Bedtime: the outside links, and the home's copy in three
// languages — the opening, who makes this, the channels, and how to suggest
// something. The catalog the episodes come from lives in lib/catalog.ts.

// The channels are linked by their YouTube ids, which never change; a handle
// can be renamed, and every link built on the old one then lands on a 404.
// `handle` is only the text shown until the catalog sync has read the current one.
const channel = (id: string, handle?: string) => ({ id, url: `https://www.youtube.com/channel/${id}`, handle });
export const CHANNELS = {
  studio: channel('UCgKQTLjejj9BqTM2U4uqnLQ', '@shinya_studio_kr'),
  music: channel('UCt3dNqlRzF_MeHKzNr7bywQ'),
};
export type ChannelKey = keyof typeof CHANNELS;

export const STORES = [
  { id: 'spotify', label: 'Spotify', url: 'https://open.spotify.com/artist/6pNKFavzsT5AhRLq8Aj9KH' },
  { id: 'apple', label: 'Apple Music', url: 'https://music.apple.com/kr/artist/shinya-%E6%B7%B1%E5%A4%9C/6800007121' },
  { id: 'ytmusic', label: 'YouTube Music', url: `https://music.youtube.com/channel/${CHANNELS.music.id}` },
];

// Where a suggestion starts: the e-mail on the channel's about page, which
// YouTube shows after a captcha.
export const COLLAB_URL = `${CHANNELS.studio.url}/about`;

// The band under the hero.
export const TICKER: Record<Lang, string[]> = {
  ko: ['After Bedtime', '아이 셋', '못 해본 것들', 'AI 드라마', '애니메이션', '밤 11시'],
  en: ['After Bedtime', 'Three kids', 'Things never done', 'AI drama', 'Animation', '11 pm'],
  ja: ['After Bedtime', '子ども三人', 'やり残したこと', 'AIドラマ', 'アニメ', '夜11時'],
};

export interface HeroCopy {
  eyebrow: string;
  loc: string;
  line: [string, string, string]; // before, the accented words, after
  sub: string;
  original: string;
}

export const HERO: Record<Lang, HeroCopy> = {
  ko: {
    eyebrow: '아이 셋 아빠의 취미 채널',
    loc: '23:00 · After bedtime',
    line: ['애들 셋 재우고, ', '스물의 숙제', '를 합니다.'],
    sub: '10대 20대에 하고 싶었던 것들을 애들 재우고 밤마다 하나씩, AI 드라마·애니메이션·뮤직비디오로.',
    original: '에피소드 보기',
  },
  en: {
    eyebrow: 'A dad of three, after hours',
    loc: '23:00 · After bedtime',
    line: ['Three kids asleep. Then ', 'the things I never got to do', ' at twenty.'],
    sub: 'The things I wanted in my teens and twenties, made one a night after bedtime: AI dramas, animation, music videos.',
    original: 'See the episodes',
  },
  ja: {
    eyebrow: '三児の父の趣味チャンネル',
    loc: '23:00 · After bedtime',
    line: ['子ども三人を寝かせてから、', '二十歳のやり残し', 'をやります。'],
    sub: '10代20代にやりたかったことを、子どもを寝かせてから夜ごとひとつずつ、AIドラマ・アニメ・ミュージックビデオに。',
    original: 'エピソードを見る',
  },
};

export interface AboutCopy {
  title: string;
  sub: string;
  paras: string[];
  facts: [string, string][];
}

export const ABOUT: Record<Lang, AboutCopy> = {
  ko: {
    title: '누가 만드나요',
    sub: '아이 셋 키우는 아빠. 애들 재우고 남는 밤 두어 시간이 작업실입니다.',
    paras: [
      '아이 셋 키우는 아빠예요. 어느 날 애들 재우고 소파에 앉아 있는데, 10대 20대에 하고 싶었던 게 머릿속에 그대로 남아 있더라고요.',
      '그때 해보고 싶었던 것, 살아보고 싶었던 장면, 봤으면 했던 이야기들. 그걸 밤마다 하나씩 영상으로 만들기로 했습니다. 드라마도 되고, 애니메이션도 되고, 가끔은 뮤직비디오도 돼요.',
      '전부 AI로 만듭니다. 그래서 스무 살의 저도, 그때 못 가본 곳도 그대로 나옵니다. 잘 만든 영상은 아닐 수 있어요. 대신 매번 진짜 하고 싶었던 걸로 만듭니다.',
    ],
    facts: [
      ['시간', '밤 11시 이후'],
      ['식구', '아이 셋'],
      ['만드는 것', 'AI 드라마 · 애니메이션 · 뮤직비디오'],
      ['도구', 'AI 생성 · 직접 편집'],
      ['원칙', '진짜 하고 싶었던 것만'],
    ],
  },
  en: {
    title: 'Who makes this',
    sub: 'A father of three. The two hours after bedtime are the studio.',
    paras: [
      'I am a father of three. One night, after the kids were asleep, I sat on the sofa and realised everything I had wanted to do in my teens and twenties was still sitting there in my head.',
      'The things I wanted to try, the scenes I wanted to live, the stories I wished existed. I decided to make them, one a night, as videos: a drama, an animation, now and then a music video.',
      'All of it is made with AI, so the twenty-year-old me and the places I never got to appear as they were. They may not be polished. Each one is something I really wanted.',
    ],
    facts: [
      ['Hours', 'After 11 pm'],
      ['Household', 'Three kids'],
      ['Makes', 'AI dramas · animation · music videos'],
      ['Tools', 'AI generation · my own editing'],
      ['Rule', 'Only what I really wanted'],
    ],
  },
  ja: {
    title: '誰が作っているか',
    sub: '三児の父。子どもを寝かせたあとの二時間が作業部屋です。',
    paras: [
      '三児の父です。ある夜、子どもを寝かせてソファに座っていたら、10代20代にやりたかったことが頭の中にそのまま残っているのに気づきました。',
      'やってみたかったこと、生きてみたかった場面、あってほしかった物語。それを毎晩ひとつずつ映像にすることにしました。ドラマにもなるし、アニメにもなるし、ときどきミュージックビデオにも。',
      '全部AIで作ります。だから二十歳の自分も、行けなかった場所もそのまま出てきます。うまい映像ではないかもしれません。そのかわり毎回、本当にやりたかったことで作ります。',
    ],
    facts: [
      ['時間', '夜11時以降'],
      ['家族', '子ども三人'],
      ['作るもの', 'AIドラマ · アニメ · ミュージックビデオ'],
      ['道具', 'AI生成 · 自分で編集'],
      ['原則', '本当にやりたかったことだけ'],
    ],
  },
};

export interface OwnedCopy {
  title: string;
  sub: string;
  // `name` is shown until the catalog sync has read the channel's own title
  cards: { key: ChannelKey; role: string; name: string; desc: string }[];
  subscribers: string;
  stores: string;
}

export const OWNED: Record<Lang, OwnedCopy> = {
  ko: {
    title: '채널',
    sub: '유튜브 하나, 음악은 따로.',
    cards: [
      { key: 'studio', role: 'YouTube / 메인', name: '셋 재우고', desc: '에피소드 · Shorts' },
      { key: 'music', role: 'YouTube / 음악', name: 'SHINYA 深夜', desc: '만든 음악 · 뮤직비디오' },
    ],
    subscribers: '구독자',
    stores: '음악은 스토어에서도',
  },
  en: {
    title: 'Channels',
    sub: 'One YouTube channel, and the music on its own.',
    cards: [
      { key: 'studio', role: 'YouTube / Main', name: 'After Bedtime', desc: 'Episodes · Shorts' },
      { key: 'music', role: 'YouTube / Music', name: 'SHINYA 深夜', desc: 'The music · music videos' },
    ],
    subscribers: 'subscribers',
    stores: 'The music, on the stores',
  },
  ja: {
    title: 'チャンネル',
    sub: 'YouTubeはひとつ、音楽は別に。',
    cards: [
      { key: 'studio', role: 'YouTube / メイン', name: '三人寝かせて', desc: 'エピソード · Shorts' },
      { key: 'music', role: 'YouTube / 音楽', name: 'SHINYA 深夜', desc: '作った音楽 · ミュージックビデオ' },
    ],
    subscribers: '登録者',
    stores: '音楽はストアでも',
  },
};

export interface CollabCopy {
  title: string;
  lede: string;
  sendTitle: string;
  send: string[];
  steps: [string, string][];
  contact: string;
  contactNote: string;
}

export const COLLAB: Record<Lang, CollabCopy> = {
  ko: {
    title: '같이 해보고 싶은 게 있다면',
    lede: '브랜드, 같은 처지의 아빠들, 친구들. 함께 해보고 싶은 것이 있으면 제안해 주세요. 가능한 건 애들 재우고 해봅니다.',
    sendTitle: '제안할 때 함께 보내주세요',
    send: ['해보고 싶은 것 한 줄', '왜 그때 못 했는지', '레퍼런스 하나', '언제쯤이면 좋을지'],
    steps: [
      ['제안', '유튜브 채널 정보의 메일로 보내주세요. 며칠 안에 답합니다.'],
      ['정하기', '뭘, 언제, 어떻게 할지 짧게 맞춥니다.'],
      ['해보기', '애들 재우고 만들어서 채널에 올립니다.'],
    ],
    contact: '제안하기',
    contactNote: '유튜브 채널 정보 → 메일',
  },
  en: {
    title: 'If there is something to try together',
    lede: 'Brands, fellow dads, friends. If there is something you want to see tried, say so. What is possible gets done after bedtime.',
    sendTitle: 'Send along with your message',
    send: ['The thing to try, in one line', 'Why it never happened back then', 'One reference', 'Roughly when'],
    steps: [
      ['Suggest', 'Through the e-mail on the YouTube channel. An answer within a few days.'],
      ['Settle', 'What, when and how, agreed in a few lines.'],
      ['Try', 'Made after bedtime, and up on the channel.'],
    ],
    contact: 'Suggest something',
    contactNote: 'YouTube channel · About → e-mail',
  },
  ja: {
    title: '一緒に​やってみたいことがあれば', // a soft break after 一緒に
    lede: 'ブランド、同じ立場の父たち、友人。やってみてほしいことがあれば提案してください。できることは子どもを寝かせてからやります。',
    sendTitle: '提案の際に添えてください',
    send: ['やってみたいことを一行で', 'なぜあの頃できなかったか', 'リファレンスをひとつ', 'いつ頃がいいか'],
    steps: [
      ['提案', 'YouTubeチャンネル概要のメールへ。数日以内に返信します。'],
      ['決める', '何を、いつ、どうやるかを短く合わせます。'],
      ['やってみる', '子どもを寝かせてから作り、チャンネルで公開します。'],
    ],
    contact: '提案する',
    contactNote: 'YouTubeチャンネル概要 → メール',
  },
};
