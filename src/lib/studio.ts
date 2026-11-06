import type { Lang } from '../i18n/ui';

// 셋 재우고 — After Bedtime: the outside links, and the home's copy in three
// languages — the opening, who makes this, the channels, and how to suggest
// something. The catalog the episodes come from lives in lib/catalog.ts.

export const CHANNELS = {
  music: { url: 'https://www.youtube.com/@shinyatokyo', handle: '@shinyatokyo' },
  studio: { url: 'https://www.youtube.com/@shinyatokyostudio', handle: '@shinyatokyostudio' },
};
export type ChannelKey = keyof typeof CHANNELS;

export const STORES = [
  { id: 'spotify', label: 'Spotify', url: 'https://open.spotify.com/artist/6pNKFavzsT5AhRLq8Aj9KH' },
  { id: 'apple', label: 'Apple Music', url: 'https://music.apple.com/kr/artist/shinya-%E6%B7%B1%E5%A4%9C/6800007121' },
  { id: 'ytmusic', label: 'YouTube Music', url: 'https://music.youtube.com/@shinyatokyo' },
];

// Where a suggestion starts: the e-mail on the channel's about page, which
// YouTube shows after a captcha.
export const COLLAB_URL = `${CHANNELS.studio.url}/about`;

// The band under the hero.
export const TICKER: Record<Lang, string[]> = {
  ko: ['After Bedtime', '아이 셋', '서른 앞', '못 해본 것들', 'Shorts', '밤 11시'],
  en: ['After Bedtime', 'Three kids', 'Almost thirty', 'Things never done', 'Shorts', '11 pm'],
  ja: ['After Bedtime', '子ども三人', '三十の手前', 'やり残したこと', 'Shorts', '夜11時'],
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
    sub: '10대와 20대에 해보고 싶었던 것들을, 아이들이 잠든 뒤에 하나씩.',
    original: '에피소드 보기',
  },
  en: {
    eyebrow: 'A dad of three, after hours',
    loc: '23:00 · After bedtime',
    line: ['Three kids asleep. Then ', 'the things I never got to do', ' at twenty.'],
    sub: 'One unfinished wish from my teens and twenties at a time, after bedtime.',
    original: 'See the episodes',
  },
  ja: {
    eyebrow: '三児の父の趣味チャンネル',
    loc: '23:00 · After bedtime',
    line: ['子ども三人を寝かせてから、', '二十歳のやり残し', 'をやります。'],
    sub: '10代と20代にやりたかったことを、子どもが寝たあとにひとつずつ。',
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
    sub: '서른을 앞둔 세 아이 아빠. 애들을 재우고 남는 밤 두어 시간이 작업실입니다.',
    paras: [
      '셋 재우고는 세 아이 아빠의 취미 채널입니다. 10대와 20대에 해보고 싶었지만 못 해본 것들을, 아이들이 잠든 뒤의 두어 시간 동안 영상으로 하나씩 해봅니다.',
      '밴드, 여행, 게임, 못 써 본 편지 같은 것들. 지금 할 수 있는 건 직접 하고, 그 시절로 돌아가야 하는 장면은 AI로 생성해서 연출합니다.',
      '완성보다 시도가 먼저인 채널입니다. 새 에피소드는 유튜브에 먼저 올라옵니다.',
    ],
    facts: [
      ['시간', '밤 11시 이후'],
      ['나이', '서른 앞'],
      ['식구', '아이 셋'],
      ['도구', '직접 촬영 · AI 생성'],
      ['원칙', '완성보다 시도'],
    ],
  },
  en: {
    title: 'Who makes this',
    sub: 'A dad of three, nearly thirty. The two hours after bedtime are the studio.',
    paras: [
      'After Bedtime is the hobby channel of a father of three. The things I wanted to do in my teens and twenties and never did, I do one at a time, on video, in the couple of hours after the kids are asleep.',
      'A band, a trip, a game, a letter never sent. What I can still do, I do myself; the scenes that need that younger me are generated with AI and directed.',
      'Trying comes before finishing here. New episodes land on YouTube first.',
    ],
    facts: [
      ['Hours', 'After 11 pm'],
      ['Age', 'Almost thirty'],
      ['Household', 'Three kids'],
      ['Tools', 'A camera · AI generation'],
      ['Rule', 'Try before you polish'],
    ],
  },
  ja: {
    title: '誰が作っているか',
    sub: '三十を前にした三児の父。子どもを寝かせたあとの二時間が作業部屋です。',
    paras: [
      '「三人寝かせて」は三児の父の趣味チャンネルです。10代と20代にやりたくてできなかったことを、子どもが眠ったあとの二時間ほどで、動画にしてひとつずつやってみます。',
      'バンド、旅、ゲーム、出せなかった手紙。いまできることは自分でやり、あの頃に戻る必要がある場面はAIで生成して演出します。',
      '完成より挑戦が先のチャンネルです。新しいエピソードはYouTubeに先に上がります。',
    ],
    facts: [
      ['時間', '夜11時以降'],
      ['年齢', '三十の手前'],
      ['家族', '子ども三人'],
      ['道具', '撮影 · AI生成'],
      ['原則', '完成より挑戦'],
    ],
  },
};

export interface OwnedCopy {
  title: string;
  sub: string;
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
      { key: 'music', role: 'YouTube / 음악', name: 'SHINYA', desc: '만든 음악 · 뮤직비디오' },
    ],
    subscribers: '구독자',
    stores: '음악은 스토어에서도',
  },
  en: {
    title: 'Channels',
    sub: 'One YouTube channel, and the music on its own.',
    cards: [
      { key: 'studio', role: 'YouTube / Main', name: 'After Bedtime', desc: 'Episodes · Shorts' },
      { key: 'music', role: 'YouTube / Music', name: 'SHINYA', desc: 'The music · music videos' },
    ],
    subscribers: 'subscribers',
    stores: 'The music, on the stores',
  },
  ja: {
    title: 'チャンネル',
    sub: 'YouTubeはひとつ、音楽は別に。',
    cards: [
      { key: 'studio', role: 'YouTube / メイン', name: '三人寝かせて', desc: 'エピソード · Shorts' },
      { key: 'music', role: 'YouTube / 音楽', name: 'SHINYA', desc: '作った音楽 · ミュージックビデオ' },
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
      ['해보기', '애들 재우고 찍고, 편집해서 올립니다.'],
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
      ['Try', 'Shot after bedtime, edited, and up on the channel.'],
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
      ['やってみる', '子どもを寝かせてから撮り、編集して公開します。'],
    ],
    contact: '提案する',
    contactNote: 'YouTubeチャンネル概要 → メール',
  },
};
