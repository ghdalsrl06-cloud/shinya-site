import type { Lang } from '../i18n/ui';

// SHINYA Studio: the outside links, and the home's copy in three languages —
// the opening, who makes this, the channels, and how to suggest something.
// SHINYA is 深夜, late night: the studio works after everyone is asleep, on
// the things its maker wanted to do at twenty and never did. The catalog the
// episodes come from lives in lib/catalog.ts.

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
  ko: ['SHINYA Studio', '深夜', '못 해본 것들', 'AI 드라마', '애니메이션', '밤 11시'],
  en: ['SHINYA Studio', '深夜', 'Things never done', 'AI drama', 'Animation', '11 pm'],
  ja: ['SHINYA Studio', '深夜', 'やり残したこと', 'AIドラマ', 'アニメ', '夜11時'],
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
    eyebrow: 'AI 드라마 · 애니메이션',
    loc: 'Late night · 23:00',
    line: ['모두 잠든 밤에, ', '스물의 숙제', '를 합니다.'],
    sub: '10대 20대에 하고 싶었던 것들을 밤마다 하나씩, AI 드라마·애니메이션·뮤직비디오로.',
    original: '에피소드 보기',
  },
  en: {
    eyebrow: 'AI dramas · animation',
    loc: 'Late night · 23:00',
    line: ['Late at night, ', 'the things I never got to do', ' at twenty.'],
    sub: 'The things I wanted in my teens and twenties, made one a night: AI dramas, animation, music videos.',
    original: 'See the episodes',
  },
  ja: {
    eyebrow: 'AIドラマ · アニメ',
    loc: 'Late night · 23:00',
    line: ['みんなが眠った夜に、', '二十歳のやり残し', 'をやります。'],
    sub: '10代20代にやりたかったことを、夜ごとひとつずつ、AIドラマ・アニメ・ミュージックビデオに。',
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
    sub: '모두 잠든 뒤의 밤 두어 시간이 작업실입니다.',
    paras: [
      'SHINYA Studio는 밤에 영상을 만드는 작은 스튜디오예요. 어느 날 밤 소파에 앉아 있는데, 10대 20대에 하고 싶었던 게 머릿속에 그대로 남아 있더라고요.',
      '그때 해보고 싶었던 것, 살아보고 싶었던 장면, 봤으면 했던 이야기들. 그걸 밤마다 하나씩 영상으로 만들기로 했습니다. 드라마도 되고, 애니메이션도 되고, 가끔은 뮤직비디오도 돼요.',
      '전부 AI로 만듭니다. 그래서 스무 살의 저도, 그때 못 가본 곳도 그대로 나옵니다. 잘 만든 영상은 아닐 수 있어요. 대신 매번 진짜 하고 싶었던 걸로 만듭니다.',
    ],
    facts: [
      ['이름', '深夜 · 일본어로 심야'],
      ['시간', '밤 11시 이후'],
      ['만드는 것', 'AI 드라마 · 애니메이션 · 뮤직비디오'],
      ['도구', 'AI 생성 · 직접 편집'],
      ['원칙', '진짜 하고 싶었던 것만'],
    ],
  },
  en: {
    title: 'Who makes this',
    sub: 'The couple of hours after everyone is asleep are the studio.',
    paras: [
      'SHINYA Studio is a small studio that makes videos at night. One night I sat on the sofa and realised everything I had wanted to do in my teens and twenties was still sitting there in my head.',
      'The things I wanted to try, the scenes I wanted to live, the stories I wished existed. I decided to make them, one a night, as videos: a drama, an animation, now and then a music video.',
      'All of it is made with AI, so the twenty-year-old me and the places I never got to appear as they were. They may not be polished. Each one is something I really wanted.',
    ],
    facts: [
      ['Name', '深夜 · "late night" in Japanese'],
      ['Hours', 'After 11 pm'],
      ['Makes', 'AI dramas · animation · music videos'],
      ['Tools', 'AI generation · my own editing'],
      ['Rule', 'Only what I really wanted'],
    ],
  },
  ja: {
    title: '誰が作っているか',
    sub: 'みんなが眠ったあとの二時間が作業部屋です。',
    paras: [
      'SHINYA Studio は、夜に映像を作る小さなスタジオです。ある夜ソファに座っていたら、10代20代にやりたかったことが頭の中にそのまま残っているのに気づきました。',
      'やってみたかったこと、生きてみたかった場面、あってほしかった物語。それを毎晩ひとつずつ映像にすることにしました。ドラマにもなるし、アニメにもなるし、ときどきミュージックビデオにも。',
      '全部AIで作ります。だから二十歳の自分も、行けなかった場所もそのまま出てきます。うまい映像ではないかもしれません。そのかわり毎回、本当にやりたかったことで作ります。',
    ],
    facts: [
      ['名前', '深夜（しんや）'],
      ['時間', '夜11時以降'],
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
      { key: 'studio', role: 'YouTube / 메인', name: 'SHINYA Studio', desc: '에피소드 · Shorts' },
      { key: 'music', role: 'YouTube / 음악', name: 'SHINYA 深夜', desc: '만든 음악 · 뮤직비디오' },
    ],
    subscribers: '구독자',
    stores: '음악은 스토어에서도',
  },
  en: {
    title: 'Channels',
    sub: 'One YouTube channel, and the music on its own.',
    cards: [
      { key: 'studio', role: 'YouTube / Main', name: 'SHINYA Studio', desc: 'Episodes · Shorts' },
      { key: 'music', role: 'YouTube / Music', name: 'SHINYA 深夜', desc: 'The music · music videos' },
    ],
    subscribers: 'subscribers',
    stores: 'The music, on the stores',
  },
  ja: {
    title: 'チャンネル',
    sub: 'YouTubeはひとつ、音楽は別に。',
    cards: [
      { key: 'studio', role: 'YouTube / メイン', name: 'SHINYA Studio', desc: 'エピソード · Shorts' },
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
    lede: '브랜드든 개인이든, 함께 만들어 보고 싶은 것이 있으면 제안해 주세요. 가능한 건 밤에 만들어 봅니다.',
    sendTitle: '제안할 때 함께 보내주세요',
    send: ['해보고 싶은 것 한 줄', '왜 그때 못 했는지', '레퍼런스 하나', '언제쯤이면 좋을지'],
    steps: [
      ['제안', '유튜브 채널 정보의 메일로 보내주세요. 며칠 안에 답합니다.'],
      ['정하기', '뭘, 언제, 어떻게 할지 짧게 맞춥니다.'],
      ['해보기', '밤에 만들어서 채널에 올립니다.'],
    ],
    contact: '제안하기',
    contactNote: '유튜브 채널 정보 → 메일',
  },
  en: {
    title: 'If there is something to try together',
    lede: 'A brand or one person: if there is something you want to see made, say so. What is possible gets made at night.',
    sendTitle: 'Send along with your message',
    send: ['The thing to try, in one line', 'Why it never happened back then', 'One reference', 'Roughly when'],
    steps: [
      ['Suggest', 'Through the e-mail on the YouTube channel. An answer within a few days.'],
      ['Settle', 'What, when and how, agreed in a few lines.'],
      ['Try', 'Made at night, and up on the channel.'],
    ],
    contact: 'Suggest something',
    contactNote: 'YouTube channel · About → e-mail',
  },
  ja: {
    title: '一緒に​やってみたいことがあれば', // a soft break after 一緒に
    lede: 'ブランドでも個人でも、一緒に作ってみたいことがあれば提案してください。できることは夜に作ります。',
    sendTitle: '提案の際に添えてください',
    send: ['やってみたいことを一行で', 'なぜあの頃できなかったか', 'リファレンスをひとつ', 'いつ頃がいいか'],
    steps: [
      ['提案', 'YouTubeチャンネル概要のメールへ。数日以内に返信します。'],
      ['決める', '何を、いつ、どうやるかを短く合わせます。'],
      ['やってみる', '夜に作り、チャンネルで公開します。'],
    ],
    contact: '提案する',
    contactNote: 'YouTubeチャンネル概要 → メール',
  },
};
