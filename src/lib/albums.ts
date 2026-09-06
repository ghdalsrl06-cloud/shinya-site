import type { Lang } from '../i18n/ui';

// Everything the music pages need to know about an album that cannot be derived
// from releases.json: which line it belongs to, what its tab and heading read,
// and the blurb under the jacket. The tracks, the playlist and the released
// state all come from the collection, keyed on `n`.
//
// Adding an album is one block here plus its entries in releases.json — the
// three music pages loop over this list and need no edit.

export type LineId = 'main' | 'club' | 'after';

export interface AlbumMeta {
  n: number;
  line: LineId;
  /** Shown in the tab and used to build the jacket's alt text. */
  name: string;
  /** The small label above the name in the tab. */
  tabNo: Record<Lang, string>;
  heading: Record<Lang, string>;
  /** Blurb once the album is out, and while it is still upcoming. */
  noteOut: Record<Lang, string>;
  noteSoon: Record<Lang, string>;
  /** Label for a link to the album-story page, on the one album that has one. */
  story?: Record<Lang, string>;
}

export const LINES: { id: LineId; label: Record<Lang, string> }[] = [
  {
    id: 'after',
    label: { en: 'SHINYA AFTER — dark R&B', ko: 'SHINYA AFTER — 다크 R&B 라인', ja: 'SHINYA AFTER — ダークR&B' },
  },
  {
    id: 'club',
    label: { en: 'SHINYA CLUB — Jersey club', ko: 'SHINYA CLUB — 저지 클럽 라인', ja: 'SHINYA CLUB — ジャージークラブ' },
  },
  {
    id: 'main',
    label: {
      en: 'SHINYA 深夜 — dark electronic',
      ko: 'SHINYA 深夜 — 다크 일렉트로닉',
      ja: 'SHINYA 深夜 — ダークエレクトロニック',
    },
  },
];

const COVER_ALT: Record<Lang, string> = { en: 'album cover', ko: '앨범 커버', ja: 'アルバムジャケット' };

export const jacketOf = (a: AlbumMeta) => `images/covers/album-${a.n}.jpg`;
/** The tab label split into the line name it may start with ("CLUB", "AFTER")
 *  and the number, so the line can be dropped where it is already stated. */
export const tabParts = (a: AlbumMeta, lang: Lang) => {
  const m = a.tabNo[lang].match(/^(CLUB|AFTER)\s+(.*)$/);
  return m ? { line: m[1], no: m[2] } : { line: '', no: a.tabNo[lang] };
};
export const jacketAlt = (a: AlbumMeta, lang: Lang) => `${a.name} ${COVER_ALT[lang]}`;

// SHINYA AFTER 3rd 「Still Daylight」 (n: 11, line 'after') is registered in
// releases.json and its track pages build, but it is deliberately not listed
// here yet: a tab and a panel both render images/covers/album-11.jpg, and the
// jacket has not arrived. Add the block back the moment it does.
export const ALBUMS: AlbumMeta[] = [
  {
    n: 1,
    line: 'main',
    name: 'SHINYA 深夜',
    tabNo: { en: '1st', ko: '1집', ja: '1st' },
    heading: { en: '1st Album 「SHINYA 深夜」', ko: '1st Album 「SHINYA 深夜」', ja: '1st Album 「SHINYA 深夜」' },
    noteOut: {
      en: 'Seven tracks for the hours after midnight — the album where the night begins.',
      ko: '자정 이후의 시간을 위한 일곱 곡 — 밤이 시작되는 앨범.',
      ja: '真夜中過ぎのための7曲 — 夜が始まるアルバム。',
    },
    noteSoon: {
      en: 'Seven tracks for the hours after midnight — the album where the night begins. Coming soon.',
      ko: '자정 이후의 시간을 위한 일곱 곡 — 밤이 시작되는 앨범. 커밍순. 가사는 미리 읽어볼 수 있어요.',
      ja: '真夜中過ぎのための7曲 — 夜が始まるアルバム。カミングスーン。歌詞は先に読めます。',
    },
    story: {
      en: 'One night, seven tracks — read the album story →',
      ko: '하룻밤, 일곱 곡 — 앨범 스토리 읽기 →',
      ja: 'ひと晩、7曲 — アルバムストーリーを読む →',
    },
  },
  {
    n: 2,
    line: 'main',
    name: '始発まで',
    tabNo: { en: '2nd', ko: '2집', ja: '2nd' },
    heading: {
      en: '2nd Album 「始発まで」 — Until the First Train',
      ko: '2nd Album 「始発まで」 — 첫차까지',
      ja: '2nd Album 「始発まで」',
    },
    noteOut: {
      en: 'Seven songs from midnight to the first train — the night after the night ended. Out now.',
      ko: '자정부터 첫차까지, 잠들지 못한 하룻밤의 일곱 곡.',
      ja: '午前0時から始発まで、眠れないひと晩の7曲。',
    },
    noteSoon: {
      en: 'Seven songs from midnight to the first train — the night after the night ended. Coming soon.',
      ko: '자정부터 첫차까지, 잠들지 못한 하룻밤의 일곱 곡 — 커밍순. 가사는 미리 읽어볼 수 있어요.',
      ja: '午前0時から始発まで、眠れないひと晩の7曲 — カミングスーン。歌詞は先に読めます。',
    },
  },
  {
    n: 3,
    line: 'main',
    name: '怖いままで',
    tabNo: { en: '3rd', ko: '3집', ja: '3rd' },
    heading: {
      en: '3rd Album 「怖いままで」 — Still Afraid',
      ko: '3rd Album 「怖いままで」 — 무서운 채로',
      ja: '3rd Album 「怖いままで」',
    },
    noteOut: {
      en: 'Seven songs from 1 AM to 5 AM — a night of being afraid to fall in love again. Out now.',
      ko: '새벽 1시부터 5시까지, 또 좋아하게 되는 게 무서운 하룻밤의 일곱 곡.',
      ja: '午前1時から午前5時まで、また好きになるのが怖いひと晩の7曲。',
    },
    noteSoon: {
      en: 'Seven songs from 1 AM to 5 AM — a night of being afraid to fall in love again. Coming soon.',
      ko: '새벽 1시부터 5시까지, 또 좋아하게 되는 게 무서운 하룻밤의 일곱 곡 — 커밍순. 가사는 미리 읽어볼 수 있어요.',
      ja: '午前1時から午前5時まで、また好きになるのが怖いひと晩の7曲 — カミングスーン。歌詞は先に読めます。',
    },
  },
  {
    n: 4,
    line: 'main',
    name: 'おやすみのあとで',
    tabNo: { en: '4th', ko: '4집', ja: '4th' },
    heading: {
      en: '4th Album 「おやすみのあとで」 — After Goodnight',
      ko: '4th Album 「おやすみのあとで」 — 잘 자, 그 뒤에',
      ja: '4th Album 「おやすみのあとで」',
    },
    noteOut: {
      en: 'Seven songs of the night after becoming us — from a call no one ends to the first train seen off together. Out now.',
      ko: '함께가 된 뒤의 하룻밤 일곱 곡 — 끊지 못하는 통화에서 둘이서 배웅하는 첫차까지.',
      ja: '二人になったあとのひと晩の7曲 — 切れない通話から、二人で見送る始発まで。',
    },
    noteSoon: {
      en: 'Seven songs of the night after becoming us — from a call no one ends to the first train seen off together. Coming soon.',
      ko: '함께가 된 뒤의 하룻밤 일곱 곡 — 끊지 못하는 통화에서 둘이서 배웅하는 첫차까지. 커밍순. 가사는 미리 읽어볼 수 있어요.',
      ja: '二人になったあとのひと晩の7曲 — 切れない通話から、二人で見送る始発まで。カミングスーン。歌詞は先に読めます。',
    },
  },
  {
    n: 5,
    line: 'main',
    name: '誰かの部屋で',
    tabNo: { en: '5th', ko: '5집', ja: '5th' },
    heading: {
      en: "5th Album 「誰かの部屋で」 — In Someone's Room",
      ko: '5th Album 「誰かの部屋で」 — 누군가의 방에서',
      ja: '5th Album 「誰かの部屋で」',
    },
    noteOut: {
      en: 'Eight rooms at the same 3AM — for the first time, the night belongs to strangers. The last room is yours. Out now.',
      ko: '같은 새벽 세 시, 여덟 개의 방 — 처음으로 남의 밤을 부른다. 마지막 방은 당신의 방.',
      ja: '同じ午前三時、八つの部屋 — はじめて他人の夜を歌う。最後の部屋はあなたの部屋。',
    },
    noteSoon: {
      en: 'Eight rooms at the same 3AM — for the first time, the night belongs to strangers. The last room is yours. Coming soon.',
      ko: '같은 새벽 세 시, 여덟 개의 방 — 처음으로 남의 밤을 부른다. 마지막 방은 당신의 방. 커밍순. 가사는 미리 읽어볼 수 있어요.',
      ja: '同じ午前三時、八つの部屋 — はじめて他人の夜を歌う。最後の部屋はあなたの部屋。カミングスーン。歌詞は先に読めます。',
    },
  },
  {
    n: 10,
    line: 'main',
    name: '朝のすぐ手前で',
    tabNo: { en: '6th', ko: '6집', ja: '6th' },
    heading: {
      en: '6th Album 「朝のすぐ手前で」 — Just Before Morning',
      ko: '6th Album 「朝のすぐ手前で」 — 아침 바로 앞에서',
      ja: '6th Album 「朝のすぐ手前で」',
    },
    noteOut: {
      en: 'The hour from 4 to 5 AM, the one hour of the night where a choice is still left — seven tracks between 68 and 96 BPM, alone, ending with the curtain open. Out now.',
      ko: '새벽 4시부터 5시까지, 밤에서 유일하게 선택이 남은 한 시간 — 68~96 BPM 일곱 곡이 혼자서, 커튼을 연 채로 끝난다.',
      ja: '午前4時から5時まで、夜で唯一選択が残された一時間 — 68〜96BPMの七曲が一人で、カーテンを開けたまま終わる。',
    },
    noteSoon: {
      en: 'The hour from 4 to 5 AM, the one hour of the night where a choice is still left — seven tracks between 68 and 96 BPM, alone, ending with the curtain open. Coming soon.',
      ko: '새벽 4시부터 5시까지, 밤에서 유일하게 선택이 남은 한 시간 — 68~96 BPM 일곱 곡이 혼자서, 커튼을 연 채로 끝난다. 커밍순. 가사는 미리 읽어볼 수 있어요.',
      ja: '午前4時から5時まで、夜で唯一選択が残された一時間 — 68〜96BPMの七曲が一人で、カーテンを開けたまま終わる。カミングスーン。歌詞は先に読めます。',
    },
  },
  {
    n: 6,
    line: 'club',
    name: 'Paper Luck',
    tabNo: { en: 'CLUB 1st', ko: 'CLUB 1집', ja: 'CLUB 1st' },
    heading: {
      en: 'SHINYA CLUB 1st 「Paper Luck」 — 紙の運',
      ko: 'SHINYA CLUB 1집 「Paper Luck」 — 종이의 운',
      ja: 'SHINYA CLUB 1st 「Paper Luck」 — 紙の運',
    },
    noteOut: {
      en: 'A new line begins — SHINYA CLUB. Seven Jersey club tracks at 128 BPM about paper luck: lottery tickets, folded odds, and luck you can hold in one hand. Out now.',
      ko: '새 라인 SHINYA CLUB의 시작 — 128 BPM 저지 클럽 7곡. 복권, 접힌 확률, 한 손에 쥘 수 있는 운. 종이의 운.',
      ja: '新ライン SHINYA CLUB、始動 — 128 BPMのジャージークラブ7曲。宝くじ、折られた確率、片手に握れる運。紙の運。',
    },
    noteSoon: {
      en: 'A new line begins — SHINYA CLUB. Seven Jersey club tracks at 128 BPM about paper luck: lottery tickets, folded odds, and luck you can hold in one hand. Coming soon.',
      ko: '새 라인 SHINYA CLUB의 시작 — 128 BPM 저지 클럽 7곡. 복권, 접힌 확률, 한 손에 쥘 수 있는 운. 커밍순. 가사는 미리 읽어볼 수 있어요.',
      ja: '新ライン SHINYA CLUB、始動 — 128 BPMのジャージークラブ7曲。宝くじ、折られた確率、片手に握れる運。カミングスーン。歌詞は先に読めます。',
    },
  },
  {
    n: 7,
    line: 'club',
    name: 'Second Wind',
    tabNo: { en: 'CLUB 2nd', ko: 'CLUB 2집', ja: 'CLUB 2nd' },
    heading: {
      en: 'SHINYA CLUB 2nd 「Second Wind」 — 二度目の息',
      ko: 'SHINYA CLUB 2집 「Second Wind」 — 두 번째 숨',
      ja: 'SHINYA CLUB 2nd 「Second Wind」 — 二度目の息',
    },
    noteOut: {
      en: 'The body answers before the head allows it. Seven Jersey club tracks at 128 BPM tracing one night in order — from not being able to move, through a breath that returns for no reason, to a morning met without sleeping. Out now.',
      ko: '머리가 허락하기 전에 몸이 먼저 답한다. 128 BPM 저지 클럽 7곡이 하룻밤을 순서대로 지난다 — 못 움직이는 밤에서, 이유 없이 돌아온 숨을 지나, 안 자고 맞은 아침까지.',
      ja: '頭が許すより先に体が答える。128 BPMのジャージークラブ7曲が、ひと晩を順番どおりに辿る — 動けない夜から、理由もなく戻ってきた息を経て、眠らずに迎えた朝まで。',
    },
    noteSoon: {
      en: 'The body answers before the head allows it. Seven Jersey club tracks at 128 BPM tracing one night in order — from not being able to move, through a breath that returns for no reason, to a morning met without sleeping. Coming soon.',
      ko: '머리가 허락하기 전에 몸이 먼저 답한다. 128 BPM 저지 클럽 7곡이 하룻밤을 순서대로 지난다 — 못 움직이는 밤에서, 이유 없이 돌아온 숨을 지나, 안 자고 맞은 아침까지. 커밍순. 가사는 미리 읽어볼 수 있어요.',
      ja: '頭が許すより先に体が答える。128 BPMのジャージークラブ7曲が、ひと晩を順番どおりに辿る — 動けない夜から、理由もなく戻ってきた息を経て、眠らずに迎えた朝まで。カミングスーン。歌詞は先に読めます。',
    },
  },
  {
    n: 8,
    line: 'after',
    name: 'Blue Hour',
    tabNo: { en: 'AFTER 1st', ko: 'AFTER 1집', ja: 'AFTER 1st' },
    heading: {
      en: 'SHINYA AFTER 1st 「Blue Hour」 — 青い時間',
      ko: 'SHINYA AFTER 1집 「Blue Hour」 — 파란 시간',
      ja: 'SHINYA AFTER 1st 「Blue Hour」 — 青い時間',
    },
    noteOut: {
      en: 'A third line begins — SHINYA AFTER, for the hour after the club empties. Seven dark R&B tracks at 72 BPM inside the blue hour before sunrise, where two people stay in a room that is ending. Out now.',
      ko: '세 번째 라인 SHINYA AFTER의 시작 — 클럽이 끝난 뒤의 한 시간. 해뜨기 직전 블루아워 안에서만 일어나는 72 BPM 다크 R&B 7곡. 끝나는 중인 방에 둘이 있다.',
      ja: '三つ目のライン SHINYA AFTER、始動 — クラブが終わったあとの一時間。夜明け前のブルーアワーの中だけで起こる72 BPMのダークR&B7曲。終わりかけの部屋に、二人がいる。',
    },
    noteSoon: {
      en: 'A third line begins — SHINYA AFTER, for the hour after the club empties. Seven dark R&B tracks at 72 BPM inside the blue hour before sunrise, where two people stay in a room that is ending. Coming soon.',
      ko: '세 번째 라인 SHINYA AFTER의 시작 — 클럽이 끝난 뒤의 한 시간. 해뜨기 직전 블루아워 안에서만 일어나는 72 BPM 다크 R&B 7곡. 끝나는 중인 방에 둘이 있다. 커밍순. 가사는 미리 읽어볼 수 있어요.',
      ja: '三つ目のライン SHINYA AFTER、始動 — クラブが終わったあとの一時間。夜明け前のブルーアワーの中だけで起こる72 BPMのダークR&B7曲。終わりかけの部屋に、二人がいる。カミングスーン。歌詞は先に読めます。',
    },
  },
  {
    n: 9,
    line: 'after',
    name: 'Empty Room',
    tabNo: { en: 'AFTER 2nd', ko: 'AFTER 2집', ja: 'AFTER 2nd' },
    heading: {
      en: 'SHINYA AFTER 2nd 「Empty Room」 — 空っぽの部屋',
      ko: 'SHINYA AFTER 2집 「Empty Room」 — 빈 방',
      ja: 'SHINYA AFTER 2nd 「Empty Room」 — 空っぽの部屋',
    },
    noteOut: {
      en: 'The second AFTER record — the last night in a room already emptied. Seven dark R&B tracks at 72 BPM run the night in order, from three boxes on the floor to the light going off. Out now.',
      ko: '두 번째 AFTER — 짐을 다 뺀 방에서 보내는 마지막 밤. 72 BPM 다크 R&B 7곡이 하룻밤을 시간 순서대로 지난다. 바닥의 상자 세 개에서, 불을 끄고 나가기까지.',
      ja: '二枚目の AFTER — 荷物を出し終えた部屋で過ごす最後の夜。72 BPMのダークR&B7曲が一晩を時間順に進む。床の段ボール三つから、電気を消して出ていくまで。',
    },
    noteSoon: {
      en: 'The second AFTER record — the last night in a room already emptied. Seven dark R&B tracks at 72 BPM run the night in order, from three boxes on the floor to the light going off. Coming soon.',
      ko: '두 번째 AFTER — 짐을 다 뺀 방에서 보내는 마지막 밤. 72 BPM 다크 R&B 7곡이 하룻밤을 시간 순서대로 지난다. 바닥의 상자 세 개에서, 불을 끄고 나가기까지. 커밍순. 가사는 미리 읽어볼 수 있어요.',
      ja: '二枚目の AFTER — 荷物を出し終えた部屋で過ごす最後の夜。72 BPMのダークR&B7曲が一晩を時間順に進む。床の段ボール三つから、電気を消して出ていくまで。カミングスーン。歌詞は先に読めます。',
    },
  },
];
