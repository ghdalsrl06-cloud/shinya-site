import type { Lang } from '../i18n/ui';

// SHINYA Studio: the outside links, and the home's copy in three languages —
// the hero, who SHINYA is, the channels, and how a collaboration runs. The
// catalog the series come from lives in lib/catalog.ts.

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

// Where a collaboration starts: the business e-mail on the studio channel's
// about page, which YouTube shows after a captcha.
export const COLLAB_URL = `${CHANNELS.studio.url}/about`;

// The band under the hero; the same words in every language.
export const TICKER = ['Original Series', 'Shorts', 'AI Filmmaking', 'Original Music', '深夜', '夜はまだ長い'];

export interface HeroCopy {
  eyebrow: string;
  line: [string, string, string]; // before, the accented words, after
  sub: string;
  original: string;
}

export const HERO: Record<Lang, HeroCopy> = {
  ko: {
    eyebrow: 'AI 오리지널 시리즈 스튜디오',
    line: ['AI로 생성하고, ', '사람이 연출', '합니다.'],
    sub: 'Original series made after midnight, in Tokyo.',
    original: 'ORIGINAL 보기',
  },
  en: {
    eyebrow: 'AI original series studio',
    line: ['Generated with AI, ', 'directed by people', '.'],
    sub: '深夜 — original series made after midnight, in Tokyo.',
    original: 'See ORIGINAL',
  },
  ja: {
    eyebrow: 'AIオリジナルシリーズスタジオ',
    line: ['AIで生成し、', '人が演出', 'します。'],
    sub: 'Original series made after midnight, in Tokyo.',
    original: 'ORIGINALを見る',
  },
};

export interface AboutCopy {
  title: string;
  sub: string;
  paras: string[];
  facts: [string, string][];
  caption: string;
}

export const ABOUT: Record<Lang, AboutCopy> = {
  ko: {
    title: 'Who is SHINYA',
    sub: '깊은 밤의 도쿄에서, AI로 생성하고 사람이 연출하는 스튜디오.',
    paras: [
      'SHINYA Studio는 AI로 생성하고 사람이 연출하는 오리지널 시리즈 스튜디오입니다. 이야기를 쓰고, 캐릭터를 세우고, 생성과 편집을 거쳐 한 편을 완성하기까지 한 팀이 처음부터 끝까지 맡습니다.',
      '深夜(SHINYA, 일본어로 "심야")는 스튜디오의 얼굴입니다. 깊은 밤의 도쿄에서 태어난 AI 캐릭터로, 앞으로 나올 모든 시리즈의 기준이 되는 캐릭터입니다.',
      '새 시리즈는 유튜브 스튜디오 채널에 먼저 올라오고, 음악은 음악 채널과 스토어에서 들을 수 있습니다.',
    ],
    facts: [
      ['Base', 'Tokyo · Seoul'],
      ['Field', 'AI 오리지널 시리즈 · 음악'],
      ['Face', '深夜 — AI 캐릭터'],
      ['Tools', 'Seedance · Higgsfield · Suno · ElevenLabs'],
      ['Motto', '夜はまだ長い — 밤은 아직 길다'],
    ],
    caption: '밤을 새우는 사람 — 夜更かしの住人',
  },
  en: {
    title: 'Who is SHINYA',
    sub: 'A studio in Tokyo after midnight: AI generates, people direct.',
    paras: [
      'SHINYA Studio is an original-series studio where AI generates and people direct. Writing the story, building the characters, generating and editing until an episode stands — one team, start to finish.',
      '深夜 (SHINYA, "late night" in Japanese) is the studio\'s face: an AI character born in Tokyo after midnight, and the reference every series to come is measured against.',
      'New series land first on the YouTube studio channel; the music lives on the music channel and the stores.',
    ],
    facts: [
      ['Base', 'Tokyo · Seoul'],
      ['Field', 'AI original series · music'],
      ['Face', '深夜 — AI character'],
      ['Tools', 'Seedance · Higgsfield · Suno · ElevenLabs'],
      ['Motto', '夜はまだ長い — the night is still long'],
    ],
    caption: 'The one who stays up — 夜更かしの住人',
  },
  ja: {
    title: 'Who is SHINYA',
    sub: '深夜の東京で、AIが生成し人が演出するスタジオ。',
    paras: [
      'SHINYA Studio は、AIが生成し、人が演出するオリジナルシリーズのスタジオです。物語を書き、キャラクターを立て、生成と編集を経て一話を仕上げるまで、一つのチームが最初から最後まで担います。',
      '深夜（SHINYA）はスタジオの顔です。深夜の東京で生まれたAIキャラクターで、これから生まれるすべてのシリーズの基準になるキャラクターです。',
      '新しいシリーズは YouTube のスタジオチャンネルに先に上がり、音楽は音楽チャンネルとストアで聴けます。',
    ],
    facts: [
      ['Base', '東京 · ソウル'],
      ['Field', 'AIオリジナルシリーズ · 音楽'],
      ['Face', '深夜 — AIキャラクター'],
      ['Tools', 'Seedance · Higgsfield · Suno · ElevenLabs'],
      ['Motto', '夜はまだ長い'],
    ],
    caption: '夜更かしの住人',
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
    title: 'Owned Media',
    sub: '두 개의 채널 — 시리즈와 음악.',
    cards: [
      { key: 'studio', role: 'YouTube / Studio', name: 'SHINYA STUDIO', desc: '오리지널 시리즈 · Shorts · 트레일러' },
      { key: 'music', role: 'YouTube / Music', name: 'SHINYA', desc: '오리지널 음악 · 뮤직비디오' },
    ],
    subscribers: '구독자',
    stores: '음악은 스토어에서도',
  },
  en: {
    title: 'Owned Media',
    sub: 'Two channels — the series and the music.',
    cards: [
      { key: 'studio', role: 'YouTube / Studio', name: 'SHINYA STUDIO', desc: 'Original series · Shorts · trailers' },
      { key: 'music', role: 'YouTube / Music', name: 'SHINYA', desc: 'Original music · music videos' },
    ],
    subscribers: 'subscribers',
    stores: 'The music, on the stores',
  },
  ja: {
    title: 'Owned Media',
    sub: '二つのチャンネル — シリーズと音楽。',
    cards: [
      { key: 'studio', role: 'YouTube / Studio', name: 'SHINYA STUDIO', desc: 'オリジナルシリーズ · Shorts · トレーラー' },
      { key: 'music', role: 'YouTube / Music', name: 'SHINYA', desc: 'オリジナル音楽 · ミュージックビデオ' },
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
    title: '함께 만들 이야기가 있다면',
    lede: '브랜드·게임·아티스트와의 협업, 뮤직비디오·숏드라마·트레일러 제작 의뢰를 받습니다. 기획부터 납품까지 한 팀이 맡고, 결과물은 전부 오리지널입니다.',
    sendTitle: '문의할 때 함께 보내주세요',
    send: ['무엇을 위한 영상인지 — 브랜드, 게임, 곡, 채널', '길이와 형식 — 가로·세로, 몇 분', '레퍼런스 한두 개', '희망 일정'],
    steps: [
      ['문의', '유튜브 채널 정보의 비즈니스 메일로 보내주세요. 하루 안에 답합니다.'],
      ['기획·견적', '이야기 한 장과 컷 시트, 일정과 비용을 먼저 글로 맞춥니다.'],
      ['제작·납품', '생성과 편집을 거쳐 2K 영상, 음원, 썸네일로 전달합니다.'],
    ],
    contact: '협업 문의',
    contactNote: '유튜브 채널 정보 → 비즈니스 메일',
  },
  en: {
    title: 'If there is a story to make together',
    lede: 'Collaborations with brands, games and artists, and commissions for music videos, short dramas and trailers. One team from the brief to delivery, and everything delivered is original.',
    sendTitle: 'Send along with your message',
    send: ['What the video is for — a brand, a game, a song, a channel', 'Length and format — landscape or vertical, how many minutes', 'One or two references', 'The timeline you have in mind'],
    steps: [
      ['Get in touch', 'Through the business e-mail on the studio channel. We answer within a day.'],
      ['Plan and quote', 'A one-page story and a cut sheet, with schedule and cost, agreed in writing first.'],
      ['Make and deliver', 'Generation, then editing, delivered as 2K video, master audio and thumbnails.'],
    ],
    contact: 'Collaborate',
    contactNote: 'YouTube channel · About → business e-mail',
  },
  ja: {
    title: '一緒に作る\u200B物語があるなら', // a soft break before 物語
    lede: 'ブランド・ゲーム・アーティストとのコラボ、ミュージックビデオ・ショートドラマ・トレーラーの制作依頼を受けています。企画から納品まで一つのチームで、成果物はすべてオリジナルです。',
    sendTitle: 'お問い合わせの際に添えてください',
    send: ['何のための映像か — ブランド、ゲーム、曲、チャンネル', '長さと形式 — 横型・縦型、何分', 'リファレンスを一つか二つ', '希望のスケジュール'],
    steps: [
      ['お問い合わせ', 'スタジオチャンネルの概要にあるビジネスメールへ。一日以内に返信します。'],
      ['企画・見積もり', '物語一枚とカットシート、日程と費用を先に文章で合わせます。'],
      ['制作・納品', '生成と編集を経て、2K映像・音源・サムネイルでお届けします。'],
    ],
    contact: 'コラボのご相談',
    contactNote: 'YouTubeチャンネル概要 → ビジネスメール',
  },
};
