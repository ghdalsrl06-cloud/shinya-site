import type { Lang } from '../i18n/ui';

// SHINYA Studio — the commercial face of the site. The home page sells four
// services on the strength of work already made under the 深夜 IP, so almost
// everything it shows is read from the collections; this module holds what is
// not: the studio channel's videos, the outside links, and the copy.

export const CHANNELS = {
  music: { url: 'https://www.youtube.com/@shinyatokyo', handle: '@shinyatokyo' },
  studio: { url: 'https://www.youtube.com/@shinyatokyostudio', handle: '@shinyatokyostudio' },
};

export const STORES = [
  { id: 'spotify', label: 'Spotify', url: 'https://open.spotify.com/artist/6pNKFavzsT5AhRLq8Aj9KH' },
  { id: 'apple', label: 'Apple Music', url: 'https://music.apple.com/kr/artist/shinya-%E6%B7%B1%E5%A4%9C/6800007121' },
  { id: 'ytmusic', label: 'YouTube Music', url: 'https://music.youtube.com/@shinyatokyo' },
];

export type WorkType = 'mv' | 'drama' | 'trailer' | 'album' | 'webtoon';

// The track whose video is the studio's reference music video — the one full
// MV so far. Everything else about it (art, running time, video) comes from
// the music collection.
export const FEATURED_MV = 'tonight-the-curtain-rises';

// Videos published on the studio channel. They live on YouTube only, so the
// list is kept here; `vertical` marks a Short, which opens under /shorts/ and
// gets a pillarboxed thumbnail.
export interface StudioVideo {
  id: string;
  type: 'drama' | 'trailer';
  series?: Record<Lang, string>;
  title: Record<Lang, string>;
  episode?: string;
  duration: string;
  date: string; // YYYY-MM-DD, KST
  vertical?: boolean;
  tools: string[];
  note: Record<Lang, string>;
}

export const VIDEOS: StudioVideo[] = [
  {
    id: 'jF4bKE5bP1c',
    type: 'drama',
    series: { ko: '남편이 나를 AI로 교체했다', en: 'My Husband Replaced Me with an AI', ja: '夫が私をAIに差し替えた' },
    title: { ko: '2화 「리셋」', en: 'EP.02 "Reset"', ja: '第2話「リセット」' },
    episode: 'EP.02',
    duration: '2:58',
    date: '2026-10-10',
    vertical: true,
    tools: ['Seedance 2.5', 'Higgsfield', 'Suno'],
    note: { ko: '2026 비글루 숏드라마 페스티벌 출품작', en: '2026 Vigloo Short Drama Festival entry', ja: '2026 Vigloo ショートドラマフェスティバル出品作' },
  },
  {
    id: '3if1sg_D5is',
    type: 'trailer',
    title: { ko: '최후의 전투', en: 'The Last Battle', ja: '最後の戦い' },
    duration: '0:58',
    date: '2026-10-09',
    tools: ['Seedance 2.5', 'GPT Image 2.5', 'Topaz', 'ElevenLabs', 'Suno'],
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
    tools: ['Seedance 2.5', 'Higgsfield', 'Suno'],
    note: { ko: '2026 비글루 숏드라마 페스티벌 출품작', en: '2026 Vigloo Short Drama Festival entry', ja: '2026 Vigloo ショートドラマフェスティバル出品作' },
  },
];

export const ytThumb = (id: string, q: 'maxresdefault' | 'hqdefault' = 'maxresdefault') => `https://i.ytimg.com/vi/${id}/${q}.jpg`;
export const ytUrl = (v: StudioVideo) => (v.vertical ? `https://www.youtube.com/shorts/${v.id}` : `https://www.youtube.com/watch?v=${v.id}`);

// The numbers the hero and the IP panel quote, counted from the data so a new
// record or episode changes them on its own.
export function studioCounts(albums: { singles: any[] }[], episodes: { data: { date: Date; draft: boolean } }[]) {
  return {
    albums: albums.length,
    tracks: albums.reduce((n, a) => n + a.singles.length, 0),
    episodes: episodes.filter((e) => !e.data.draft && e.data.date.valueOf() <= Date.now()).length,
    dramas: VIDEOS.filter((v) => v.type === 'drama').length,
  };
}

// Category labels on tiles and in the ticker stay in English across locales,
// as the line names (CLUB, AFTER) already do.
export const WORK_LABEL: Record<WorkType, string> = {
  mv: 'MUSIC VIDEO',
  drama: 'SHORT DRAMA',
  trailer: 'TRAILER',
  album: 'ALBUM',
  webtoon: 'WEBTOON',
};

interface Service {
  type: WorkType;
  k: string;
  title: string;
  desc: string;
  ref: string; // what we point to as proof, after the reference name
  refName: string | ((c: ReturnType<typeof studioCounts>) => string);
}

interface Copy {
  title: string;
  description: (c: ReturnType<typeof studioCounts>) => string;
  hero: { eyebrow: string; h1: [string, string, string]; lede: string; works: string; channel: string };
  stats: { albums: string; tracks: string; episodes: string; dramas: string };
  services: { kicker: string; title: string; sub: string; items: Service[] };
  works: {
    kicker: string;
    title: string;
    sub: string;
    all: string;
    filter: Record<WorkType, string>;
    webtoonMeta: (n: number, finale: boolean) => string;
    mvMeta: string;
    more: { music: string; webtoon: string; channel: string };
  };
  process: { kicker: string; title: string; sub: string; steps: { name: string; desc: string; note: string }[] };
  ip: {
    kicker: string;
    title: string;
    lede: string;
    facts: (c: ReturnType<typeof studioCounts>) => [string, string][];
    links: { music: string; webtoon: string; blog: string; about: string };
    tag: string;
  };
  notes: { kicker: string; title: string; more: string };
}

export const COPY: Record<Lang, Copy> = {
  ko: {
    title: 'SHINYA Studio — AI 뮤직비디오 · 숏드라마 · 트레일러 · 음원 제작 | 深夜',
    description: (c) =>
      `AI로 생성하고 사람이 연출하는 콘텐츠 스튜디오. 자체 IP 深夜로 앨범 ${c.albums}장과 ${c.tracks}곡, 첫 풀 MV, 웹툰 ${c.episodes}화, 숏드라마를 만든 파이프라인으로 뮤직비디오·숏드라마·트레일러·음원을 제작합니다.`,
    hero: {
      eyebrow: 'AI 콘텐츠 제작 스튜디오',
      h1: ['밤에 만드는', '음악과 ', '영상'],
      lede: 'AI로 생성하고, 사람이 연출합니다. 자체 IP 深夜로 앨범 열세 장과 첫 풀 MV, 웹툰 한 시즌, 숏드라마까지 직접 굴려 본 파이프라인을 의뢰 작업에 그대로 씁니다.',
      works: '작품 보기',
      channel: '스튜디오 채널',
    },
    stats: { albums: '앨범', tracks: '곡', episodes: '웹툰 회차', dramas: '숏드라마' },
    services: {
      kicker: 'Services',
      title: '네 가지를 만듭니다',
      sub: '기획부터 납품까지 한 팀이 합니다.',
      items: [
        { type: 'mv', k: 'MUSIC VIDEO', title: 'AI 뮤직비디오', desc: '곡 한 편의 풀 MV. 마스터프레임으로 세계를 고정하고 세그먼트를 이어 붙여 2~4분을 만듭니다. 립싱크 대신 연출로 보여 줍니다.', refName: '「今夜も開演」 MV', ref: '2:40 · 20세그먼트 · 2K' },
        { type: 'drama', k: 'SHORT DRAMA', title: 'AI 숏드라마', desc: '세로형 3분 에피소드를 시리즈로. 캐릭터 시트로 얼굴을 고정하고, 대본·연출·자막까지 한 번에 갑니다.', refName: '「남편이 나를 AI로 교체했다」', ref: 'EP.01–02 · 2026 비글루 숏드라마 페스티벌 출품' },
        { type: 'trailer', k: 'TRAILER', title: '시네마틱 트레일러', desc: '게임·브랜드용 60초. 컷 시트로 리듬을 먼저 설계하고 샷 단위로 생성한 뒤, 내레이션과 음악을 얹습니다.', refName: '「최후의 전투」', ref: '58초 · 다크 판타지' },
        { type: 'album', k: 'MUSIC', title: '음원 제작', desc: '콘셉트·작사·구성·믹스·마스터링. 싱글 한 곡부터 앨범 한 장까지, 가사 3개 국어 대역과 스토어 유통 포함.', refName: (c) => `앨범 ${c.albums}장 · ${c.tracks}곡`, ref: '매주 금요일 23:59 발매' },
      ],
    },
    works: {
      kicker: 'Works',
      title: '작품',
      sub: '두 채널의 작업을 한자리에. 대표작이 먼저, 나머지는 최신순.',
      all: '전체',
      filter: { mv: '뮤직비디오', drama: '숏드라마', trailer: '트레일러', album: '앨범', webtoon: '웹툰' },
      webtoonMeta: (n, finale) => `${finale ? '1부 완결 · ' : ''}${n}화`,
      mvMeta: '첫 풀 뮤직비디오',
      more: { music: '뮤직 전체', webtoon: '웹툰', channel: '스튜디오 채널' },
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
      kicker: 'Original IP',
      title: '스튜디오의 얼굴이자 첫 번째 IP',
      lede: '2026년 8월부터 매주 금요일 한 장. Original · CLUB · AFTER 세 라인을 돌며 열세 장을 냈고, 그 사이 웹툰 한 시즌과 첫 풀 MV까지 만들었습니다. 의뢰 작업은 이 파이프라인 위에서 돌아갑니다.',
      facts: (c) => [
        [`${c.albums}장 · ${c.tracks}곡`, 'Original · CLUB · AFTER · SPECIAL'],
        [`웹툰 ${c.episodes}화`, '1부 완결 · 3일에 한 화'],
        ['첫 풀 MV', '「今夜も開演」 2:40'],
      ],
      links: { music: '뮤직', webtoon: '웹툰', blog: '블로그', about: '소개' },
      tag: '夜更かしの住人',
    },
    notes: { kicker: 'Notes', title: '최근 비하인드', more: '블로그 전체' },
  },
  en: {
    title: 'SHINYA Studio — AI music videos, short dramas, trailers & original music | 深夜',
    description: (c) =>
      `A content studio where AI generates and people direct. The pipeline behind our own IP, 深夜 — ${c.albums} albums, ${c.tracks} tracks, a first full music video, a ${c.episodes}-episode webtoon and a short drama — now makes music videos, short dramas, trailers and music to commission.`,
    hero: {
      eyebrow: 'AI content studio',
      h1: ['Music and film,', 'made ', 'after midnight'],
      lede: 'Generated with AI, directed by people. The pipeline we run for our own IP, 深夜 — thirteen albums, a first full music video, a webtoon season, a short drama — is the one we bring to commissioned work.',
      works: 'See the work',
      channel: 'Studio channel',
    },
    stats: { albums: 'Albums', tracks: 'Tracks', episodes: 'Webtoon episodes', dramas: 'Short dramas' },
    services: {
      kicker: 'Services',
      title: 'Four things we make',
      sub: 'One team, from the first page of the brief to delivery.',
      items: [
        { type: 'mv', k: 'MUSIC VIDEO', title: 'AI music video', desc: 'A full video for one song. Master frames lock the world, segments are chained into two to four minutes, and direction stands in for lip-sync.', refName: '「今夜も開演」 MV', ref: '2:40 · 20 segments · 2K' },
        { type: 'drama', k: 'SHORT DRAMA', title: 'AI short drama', desc: 'Vertical three-minute episodes, written as a series. Character sheets hold the faces; script, direction and subtitles come as one job.', refName: '「My Husband Replaced Me with an AI」', ref: 'EP.01–02 · 2026 Vigloo Short Drama Festival entry' },
        { type: 'trailer', k: 'TRAILER', title: 'Cinematic trailer', desc: 'Sixty seconds for a game or a brand. The cut sheet sets the rhythm first; shots are generated to it, then narration and score go on top.', refName: '「The Last Battle」', ref: '58 s · dark fantasy' },
        { type: 'album', k: 'MUSIC', title: 'Original music', desc: 'Concept, lyrics, structure, mix and master. A single or a whole album, with lyrics in three languages and store distribution included.', refName: (c) => `${c.albums} albums · ${c.tracks} tracks`, ref: 'Released Fridays at 23:59 KST' },
      ],
    },
    works: {
      kicker: 'Works',
      title: 'Selected work',
      sub: 'Both channels in one place. The flagship first, then newest.',
      all: 'All',
      filter: { mv: 'Music video', drama: 'Short drama', trailer: 'Trailer', album: 'Albums', webtoon: 'Webtoon' },
      webtoonMeta: (n, finale) => `${finale ? 'Part 1 complete · ' : ''}${n} episodes`,
      mvMeta: 'First full music video',
      more: { music: 'All music', webtoon: 'Webtoon', channel: 'Studio channel' },
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
      kicker: 'Original IP',
      title: 'The face of the studio, and its first IP',
      lede: 'One record every Friday since August 2026. Thirteen across the Original, CLUB and AFTER lines, with a webtoon season and a first full music video along the way. Commissioned work runs on the same pipeline.',
      facts: (c) => [
        [`${c.albums} records · ${c.tracks} tracks`, 'Original · CLUB · AFTER · SPECIAL'],
        [`${c.episodes} webtoon episodes`, 'Part 1 complete · one every three days'],
        ['First full MV', '「今夜も開演」 2:40'],
      ],
      links: { music: 'Music', webtoon: 'Webtoon', blog: 'Blog', about: 'About' },
      tag: 'Resident of the late night',
    },
    notes: { kicker: 'Notes', title: 'Latest from behind the tracks', more: 'All posts' },
  },
  ja: {
    title: 'SHINYA Studio — AIミュージックビデオ · ショートドラマ · トレーラー · 音源制作 | 深夜',
    description: (c) =>
      `AIが生成し、人が演出するコンテンツスタジオ。自社IP「深夜」でアルバム${c.albums}枚・${c.tracks}曲、初のフルMV、ウェブトゥーン${c.episodes}話、ショートドラマを作ったパイプラインで、ミュージックビデオ・ショートドラマ・トレーラー・音源を制作します。`,
    hero: {
      eyebrow: 'AIコンテンツ制作スタジオ',
      h1: ['夜に作る', '音楽と', '映像'],
      lede: 'AIで生成し、人が演出します。自社IP「深夜」でアルバム13枚、初のフルMV、ウェブトゥーン1シーズン、ショートドラマまで回してきたパイプラインを、そのまま受託制作に使います。',
      works: '作品を見る',
      channel: 'スタジオチャンネル',
    },
    stats: { albums: 'アルバム', tracks: '曲', episodes: 'ウェブトゥーン', dramas: 'ショートドラマ' },
    services: {
      kicker: 'Services',
      title: '四つを作ります',
      sub: '企画から納品まで、一つのチームで。',
      items: [
        { type: 'mv', k: 'MUSIC VIDEO', title: 'AIミュージックビデオ', desc: '一曲のフルMV。マスターフレームで世界を固定し、セグメントを繋いで2〜4分に。リップシンクの代わりに演出で見せます。', refName: '「今夜も開演」 MV', ref: '2:40 · 20セグメント · 2K' },
        { type: 'drama', k: 'SHORT DRAMA', title: 'AIショートドラマ', desc: '縦型3分のエピソードをシリーズで。キャラクターシートで顔を固定し、脚本・演出・字幕まで一括で。', refName: '「夫が私をAIに差し替えた」', ref: 'EP.01–02 · 2026 Vigloo ショートドラマフェスティバル出品' },
        { type: 'trailer', k: 'TRAILER', title: 'シネマティックトレーラー', desc: 'ゲーム・ブランド向けの60秒。カットシートでリズムを先に設計し、ショット単位で生成してナレーションと音楽を重ねます。', refName: '「最後の戦い」', ref: '58秒 · ダークファンタジー' },
        { type: 'album', k: 'MUSIC', title: '音源制作', desc: 'コンセプト・作詞・構成・ミックス・マスタリング。シングル一曲からアルバム一枚まで、三か国語の歌詞対訳とストア配信込み。', refName: (c) => `アルバム${c.albums}枚 · ${c.tracks}曲`, ref: '毎週金曜 23:59 リリース' },
      ],
    },
    works: {
      kicker: 'Works',
      title: '作品',
      sub: '二つのチャンネルの仕事をひとつに。代表作を先に、あとは新しい順。',
      all: 'すべて',
      filter: { mv: 'ミュージックビデオ', drama: 'ショートドラマ', trailer: 'トレーラー', album: 'アルバム', webtoon: 'ウェブトゥーン' },
      webtoonMeta: (n, finale) => `${finale ? '第1部完結 · ' : ''}全${n}話`,
      mvMeta: '初のフルミュージックビデオ',
      more: { music: 'ミュージック一覧', webtoon: 'ウェブトゥーン', channel: 'スタジオチャンネル' },
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
      kicker: 'Original IP',
      title: 'スタジオの顔であり、最初のIP',
      lede: '2026年8月から毎週金曜に一枚。Original · CLUB · AFTER の三つのラインで十三枚を出し、その間にウェブトゥーン1シーズンと初のフルMVまで作りました。受託制作はこのパイプラインの上で回ります。',
      facts: (c) => [
        [`${c.albums}枚 · ${c.tracks}曲`, 'Original · CLUB · AFTER · SPECIAL'],
        [`ウェブトゥーン${c.episodes}話`, '第1部完結 · 三日に一話'],
        ['初のフルMV', '「今夜も開演」 2:40'],
      ],
      links: { music: 'ミュージック', webtoon: 'ウェブトゥーン', blog: 'ブログ', about: 'アバウト' },
      tag: '夜更かしの住人',
    },
    notes: { kicker: 'Notes', title: '最近のビハインド', more: 'ブログ一覧' },
  },
};
