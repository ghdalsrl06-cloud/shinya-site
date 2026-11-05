import type { Lang } from '../i18n/ui';

// SHINYA Studio — a content studio that generates with AI and directs by
// hand. The home sells four services on the strength of the videos already
// made; this module holds those videos, the outside links, and the copy in
// three languages.

export const CHANNELS = {
  music: { url: 'https://www.youtube.com/@shinyatokyo', handle: '@shinyatokyo' },
  studio: { url: 'https://www.youtube.com/@shinyatokyostudio', handle: '@shinyatokyostudio' },
};

export const STORES = [
  { id: 'spotify', label: 'Spotify', url: 'https://open.spotify.com/artist/6pNKFavzsT5AhRLq8Aj9KH' },
  { id: 'apple', label: 'Apple Music', url: 'https://music.apple.com/kr/artist/shinya-%E6%B7%B1%E5%A4%9C/6800007121' },
  { id: 'ytmusic', label: 'YouTube Music', url: 'https://music.youtube.com/@shinyatokyo' },
];

export type WorkType = 'mv' | 'drama' | 'trailer';

// Every video the studio has published, newest first on the page. A video
// with `art` carries its own frame in /public; the rest use the YouTube
// thumbnail. `vertical` marks a Short, which opens under /shorts/ and gets a
// pillarboxed thumbnail.
export interface StudioVideo {
  id: string;
  type: WorkType;
  series?: Record<Lang, string>;
  title: Record<Lang, string>;
  sub?: Record<Lang, string>;
  episode?: string;
  duration: string;
  date: string; // YYYY-MM-DD, KST
  vertical?: boolean;
  art?: { src: string; width: number };
  note: Record<Lang, string>;
}

export const VIDEOS: StudioVideo[] = [
  {
    id: 'zJZXD00Ne18',
    type: 'mv',
    title: { ko: '今夜も開演', en: '今夜も開演', ja: '今夜も開演' },
    sub: { ko: '첫 풀 뮤직비디오', en: 'First full music video', ja: '初のフルミュージックビデオ' },
    duration: '2:40',
    date: '2026-09-12',
    art: { src: 'images/series/tonight-the-curtain-rises.jpg', width: 1280 },
    note: { ko: '20세그먼트 · 2K · 립싱크 없이 연출로', en: '20 segments · 2K · direction instead of lip-sync', ja: '20セグメント · 2K · リップシンクなしの演出' },
  },
  {
    id: 'jF4bKE5bP1c',
    type: 'drama',
    series: { ko: '남편이 나를 AI로 교체했다', en: 'My Husband Replaced Me with an AI', ja: '夫が私をAIに差し替えた' },
    title: { ko: '2화 「리셋」', en: 'EP.02 "Reset"', ja: '第2話「リセット」' },
    episode: 'EP.02',
    duration: '2:58',
    date: '2026-10-10',
    vertical: true,
    note: { ko: '2026 비글루 숏드라마 페스티벌 출품작', en: '2026 Vigloo Short Drama Festival entry', ja: '2026 Vigloo ショートドラマフェスティバル出品作' },
  },
  {
    id: '3if1sg_D5is',
    type: 'trailer',
    title: { ko: '최후의 전투', en: 'The Last Battle', ja: '最後の戦い' },
    sub: { ko: 'AI 시네마틱 트레일러', en: 'AI cinematic trailer', ja: 'AIシネマティックトレーラー' },
    duration: '0:58',
    date: '2026-10-09',
    note: { ko: '다크 판타지 · 가상의 게임 트레일러', en: 'Dark fantasy · trailer for a game that does not exist', ja: 'ダークファンタジー · 架空のゲームトレーラー' },
  },
  {
    id: 'smEt8hgr2HQ',
    type: 'drama',
    series: { ko: '남편이 나를 AI로 교체했다', en: 'My Husband Replaced Me with an AI', ja: '夫が私をAIに差し替えた' },
    title: { ko: '1화', en: 'EP.01', ja: '第1話' },
    episode: 'EP.01',
    duration: '2:57',
    date: '2026-09-29',
    vertical: true,
    note: { ko: '2026 비글루 숏드라마 페스티벌 출품작', en: '2026 Vigloo Short Drama Festival entry', ja: '2026 Vigloo ショートドラマフェスティバル出品作' },
  },
];

export const ytThumb = (id: string, q: 'maxresdefault' | 'hqdefault' = 'maxresdefault') => `https://i.ytimg.com/vi/${id}/${q}.jpg`;
export const ytUrl = (v: StudioVideo) => (v.vertical ? `https://www.youtube.com/shorts/${v.id}` : `https://www.youtube.com/watch?v=${v.id}`);
export const videoName = (v: StudioVideo, lang: Lang) => v.series?.[lang] ?? v.title[lang];

// Category labels on tiles and in the ticker stay in English across locales.
export const WORK_LABEL: Record<WorkType, string> = {
  mv: 'MUSIC VIDEO',
  drama: 'SHORT DRAMA',
  trailer: 'TRAILER',
};

interface Service {
  type: WorkType | 'music';
  k: string;
  title: string;
  desc: string;
  refName: string;
  ref: string;
}

interface Copy {
  title: string;
  description: string;
  hero: { eyebrow: string; h1: [string, string, string]; lede: string; works: string; channel: string; tools: [string, string][] };
  services: { kicker: string; title: string; sub: string; items: Service[] };
  works: { kicker: string; title: string; sub: string; all: string; filter: Record<WorkType, string>; more: { studio: string; music: string } };
  process: { kicker: string; title: string; sub: string; steps: { name: string; desc: string; note: string }[] };
  ip: { kicker: string; title: string; lede: string; about: string; tag: string };
  cta: { kicker: string; title: string; sub: string; music: string; studio: string };
}

export const COPY: Record<Lang, Copy> = {
  ko: {
    title: 'SHINYA Studio — AI 뮤직비디오 · 숏드라마 · 트레일러 · 음원 제작 | 深夜',
    description: 'AI로 생성하고 사람이 연출하는 콘텐츠 스튜디오. 자체 캐릭터 深夜로 뮤직비디오·숏드라마·시네마틱 트레일러를 만든 파이프라인으로 영상과 음원을 제작합니다.',
    hero: {
      eyebrow: 'AI 콘텐츠 제작 스튜디오',
      h1: ['밤에 만드는', '음악과 ', '영상'],
      lede: 'AI로 생성하고, 사람이 연출합니다. 자체 캐릭터 深夜로 뮤직비디오, 숏드라마, 시네마틱 트레일러까지 직접 만들어 본 파이프라인을 의뢰 작업에 그대로 씁니다.',
      works: '작품 보기',
      channel: '스튜디오 채널',
      tools: [['Seedance 2.5', '영상 생성'], ['Higgsfield', '이미지'], ['Suno', '음악'], ['ElevenLabs', '내레이션']],
    },
    services: {
      kicker: 'Services',
      title: '네 가지를 만듭니다',
      sub: '기획부터 납품까지 한 팀이 합니다.',
      items: [
        { type: 'mv', k: 'MUSIC VIDEO', title: 'AI 뮤직비디오', desc: '곡 한 편의 풀 MV. 마스터프레임으로 세계를 고정하고 세그먼트를 이어 붙여 2~4분을 만듭니다. 립싱크 대신 연출로 보여 줍니다.', refName: '「今夜も開演」 MV', ref: '2:40 · 20세그먼트 · 2K' },
        { type: 'drama', k: 'SHORT DRAMA', title: 'AI 숏드라마', desc: '세로형 3분 에피소드를 시리즈로. 캐릭터 시트로 얼굴을 고정하고, 대본·연출·자막까지 한 번에 갑니다.', refName: '「남편이 나를 AI로 교체했다」', ref: 'EP.01–02 · 2026 비글루 숏드라마 페스티벌 출품' },
        { type: 'trailer', k: 'TRAILER', title: '시네마틱 트레일러', desc: '게임·브랜드용 60초. 컷 시트로 리듬을 먼저 설계하고 샷 단위로 생성한 뒤, 내레이션과 음악을 얹습니다.', refName: '「최후의 전투」', ref: '58초 · 다크 판타지' },
        { type: 'music', k: 'MUSIC', title: '음원 제작', desc: '콘셉트·작사·구성·믹스·마스터링. 영상에 들어갈 한 곡부터 싱글 발매까지, 가사 3개 국어 대역과 스토어 유통 포함.', refName: '영상 음악 전부 자체 제작', ref: '「今夜も開演」 사운드트랙 포함' },
      ],
    },
    works: {
      kicker: 'Works',
      title: '작품',
      sub: '두 채널의 영상을 한자리에. 대표작이 먼저, 나머지는 최신순.',
      all: '전체',
      filter: { mv: '뮤직비디오', drama: '숏드라마', trailer: '트레일러' },
      more: { studio: '스튜디오 채널', music: '음악 채널' },
    },
    process: {
      kicker: 'Process',
      title: '생성은 AI가, 결정은 사람이',
      sub: '네 단계, 순서대로.',
      steps: [
        { name: '기획', desc: '이야기 한 장, 곡 구조, 컷 시트. 무엇을 만들지 먼저 글로 고정합니다.', note: '이야기가 먼저 — 가사는 그 요약' },
        { name: '생성', desc: '마스터프레임으로 세계를 잠그고, 세그먼트·음원·음성을 생성합니다.', note: 'Suno · Seedance · Higgsfield · GPT Image · ElevenLabs' },
        { name: '편집', desc: '연출, 컷, 자막, 믹스와 마스터링은 사람이 직접. 립싱크는 쓰지 않습니다.', note: 'AI 생성 + 사람의 연출' },
        { name: '납품', desc: '2K 영상, 원본 음원, 썸네일, 가사 대역. 스톡 소재 없음, 전부 오리지널.', note: '유통까지 대행 가능' },
      ],
    },
    ip: {
      kicker: 'Original Character',
      title: '모든 작업의 얼굴, 深夜',
      lede: '깊은 밤의 도쿄에서 태어난 AI 캐릭터. 첫 풀 뮤직비디오의 주인공이자 스튜디오의 얼굴이고, 의뢰 작업에서는 캐릭터 시트로 세계를 잠그는 방식의 기준이 됩니다.',
      about: '소개',
      tag: '夜更かしの住人',
    },
    cta: {
      kicker: 'Subscribe',
      title: '새 작업은 밤에, 두 채널에 먼저 올라옵니다',
      sub: '뮤직비디오는 음악 채널에, 숏드라마와 트레일러는 스튜디오 채널에. 구독해 두면 놓치지 않습니다.',
      music: '음악 채널 구독',
      studio: '스튜디오 채널 구독',
    },
  },
  en: {
    title: 'SHINYA Studio — AI music videos, short dramas, trailers & original music | 深夜',
    description: 'A content studio where AI generates and people direct. The pipeline behind our own character, 深夜 — a music video, a short drama, a cinematic trailer — now makes video and music to commission.',
    hero: {
      eyebrow: 'AI content studio',
      h1: ['Music and film,', 'made ', 'after midnight'],
      lede: 'Generated with AI, directed by people. The pipeline we built around our own character, 深夜 — a music video, a short drama, a cinematic trailer — is the one we bring to commissioned work.',
      works: 'See the work',
      channel: 'Studio channel',
      tools: [['Seedance 2.5', 'Video'], ['Higgsfield', 'Image'], ['Suno', 'Music'], ['ElevenLabs', 'Narration']],
    },
    services: {
      kicker: 'Services',
      title: 'Four things we make',
      sub: 'One team, from the first page of the brief to delivery.',
      items: [
        { type: 'mv', k: 'MUSIC VIDEO', title: 'AI music video', desc: 'A full video for one song. Master frames lock the world, segments are chained into two to four minutes, and direction stands in for lip-sync.', refName: '「今夜も開演」 MV', ref: '2:40 · 20 segments · 2K' },
        { type: 'drama', k: 'SHORT DRAMA', title: 'AI short drama', desc: 'Vertical three-minute episodes, written as a series. Character sheets hold the faces; script, direction and subtitles come as one job.', refName: '「My Husband Replaced Me with an AI」', ref: 'EP.01–02 · 2026 Vigloo Short Drama Festival entry' },
        { type: 'trailer', k: 'TRAILER', title: 'Cinematic trailer', desc: 'Sixty seconds for a game or a brand. The cut sheet sets the rhythm first; shots are generated to it, then narration and score go on top.', refName: '「The Last Battle」', ref: '58 s · dark fantasy' },
        { type: 'music', k: 'MUSIC', title: 'Original music', desc: 'Concept, lyrics, structure, mix and master. From the one track a video needs to a released single, with lyrics in three languages and store distribution.', refName: 'Every soundtrack made in-house', ref: 'including 「今夜も開演」' },
      ],
    },
    works: {
      kicker: 'Works',
      title: 'Selected work',
      sub: 'Both channels in one place. The flagship first, then newest.',
      all: 'All',
      filter: { mv: 'Music video', drama: 'Short drama', trailer: 'Trailer' },
      more: { studio: 'Studio channel', music: 'Music channel' },
    },
    process: {
      kicker: 'Process',
      title: 'AI generates, people decide',
      sub: 'Four steps, in order.',
      steps: [
        { name: 'Plan', desc: 'A one-page story, the song structure, the cut sheet. What gets made is fixed in writing first.', note: 'Story first — the lyric is its summary' },
        { name: 'Generate', desc: 'Master frames lock the world; segments, music and voice are generated against them.', note: 'Suno · Seedance · Higgsfield · GPT Image · ElevenLabs' },
        { name: 'Edit', desc: 'Direction, cuts, subtitles, mix and master are done by hand. No lip-sync.', note: 'AI generation + human direction' },
        { name: 'Deliver', desc: '2K video, master audio, thumbnails, translated lyrics. No stock, all original.', note: 'Distribution handled on request' },
      ],
    },
    ip: {
      kicker: 'Original character',
      title: 'The face of every piece, 深夜',
      lede: 'An AI character born in Tokyo after midnight — the lead of the first full music video, the face of the studio, and on commissions the reference for how a character sheet locks a world.',
      about: 'About',
      tag: 'Resident of the late night',
    },
    cta: {
      kicker: 'Subscribe',
      title: 'New work lands at night, on two channels first',
      sub: 'Music videos on the music channel, dramas and trailers on the studio channel. Subscribe and nothing slips past.',
      music: 'Subscribe · Music',
      studio: 'Subscribe · Studio',
    },
  },
  ja: {
    title: 'SHINYA Studio — AIミュージックビデオ · ショートドラマ · トレーラー · 音源制作 | 深夜',
    description: 'AIが生成し、人が演出するコンテンツスタジオ。自社キャラクター「深夜」でミュージックビデオ・ショートドラマ・シネマティックトレーラーを作ったパイプラインで、映像と音源を制作します。',
    hero: {
      eyebrow: 'AIコンテンツ制作スタジオ',
      h1: ['夜に作る', '音楽と', '映像'],
      lede: 'AIで生成し、人が演出します。自社キャラクター「深夜」でミュージックビデオ、ショートドラマ、シネマティックトレーラーまで作ってきたパイプラインを、そのまま受託制作に使います。',
      works: '作品を見る',
      channel: 'スタジオチャンネル',
      tools: [['Seedance 2.5', '映像生成'], ['Higgsfield', '画像'], ['Suno', '音楽'], ['ElevenLabs', 'ナレーション']],
    },
    services: {
      kicker: 'Services',
      title: '四つを作ります',
      sub: '企画から納品まで、一つのチームで。',
      items: [
        { type: 'mv', k: 'MUSIC VIDEO', title: 'AIミュージックビデオ', desc: '一曲のフルMV。マスターフレームで世界を固定し、セグメントを繋いで2〜4分に。リップシンクの代わりに演出で見せます。', refName: '「今夜も開演」 MV', ref: '2:40 · 20セグメント · 2K' },
        { type: 'drama', k: 'SHORT DRAMA', title: 'AIショートドラマ', desc: '縦型3分のエピソードをシリーズで。キャラクターシートで顔を固定し、脚本・演出・字幕まで一括で。', refName: '「夫が私をAIに差し替えた」', ref: 'EP.01–02 · 2026 Vigloo ショートドラマフェスティバル出品' },
        { type: 'trailer', k: 'TRAILER', title: 'シネマティックトレーラー', desc: 'ゲーム・ブランド向けの60秒。カットシートでリズムを先に設計し、ショット単位で生成してナレーションと音楽を重ねます。', refName: '「最後の戦い」', ref: '58秒 · ダークファンタジー' },
        { type: 'music', k: 'MUSIC', title: '音源制作', desc: 'コンセプト・作詞・構成・ミックス・マスタリング。映像に入れる一曲からシングルのリリースまで、三か国語の歌詞対訳とストア配信込み。', refName: '映像の音楽はすべて自社制作', ref: '「今夜も開演」のサウンドトラックを含む' },
      ],
    },
    works: {
      kicker: 'Works',
      title: '作品',
      sub: '二つのチャンネルの映像をひとつに。代表作を先に、あとは新しい順。',
      all: 'すべて',
      filter: { mv: 'ミュージックビデオ', drama: 'ショートドラマ', trailer: 'トレーラー' },
      more: { studio: 'スタジオチャンネル', music: '音楽チャンネル' },
    },
    process: {
      kicker: 'Process',
      title: '生成はAIが、決定は人が',
      sub: '四つの段階を、順番に。',
      steps: [
        { name: '企画', desc: '物語一枚、曲の構成、カットシート。何を作るかを先に文章で固定します。', note: '物語が先 — 歌詞はその要約' },
        { name: '生成', desc: 'マスターフレームで世界を固定し、セグメント・音源・音声を生成します。', note: 'Suno · Seedance · Higgsfield · GPT Image · ElevenLabs' },
        { name: '編集', desc: '演出、カット、字幕、ミックスとマスタリングは人の手で。リップシンクは使いません。', note: 'AI生成 + 人の演出' },
        { name: '納品', desc: '2K映像、原音源、サムネイル、歌詞対訳。ストック素材なし、すべてオリジナル。', note: '配信代行も可能' },
      ],
    },
    ip: {
      kicker: 'Original character',
      title: 'すべての作品の顔、深夜',
      lede: '深夜の東京で生まれたAIキャラクター。初のフルMVの主役であり、スタジオの顔であり、受託制作ではキャラクターシートで世界を固定するやり方の基準になります。',
      about: 'アバウト',
      tag: '夜更かしの住人',
    },
    cta: {
      kicker: 'Subscribe',
      title: '新しい仕事は夜に、二つのチャンネルへ先に届きます',
      sub: 'ミュージックビデオは音楽チャンネルに、ドラマとトレーラーはスタジオチャンネルに。登録しておけば見逃しません。',
      music: '音楽チャンネルを登録',
      studio: 'スタジオチャンネルを登録',
    },
  },
};
