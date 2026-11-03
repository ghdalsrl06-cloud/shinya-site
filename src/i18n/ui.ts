export type Lang = 'en' | 'ko' | 'ja';

// Strings the layout shares across pages; the home's copy lives in lib/studio.ts.
export const ui = {
  en: {
    'nav.services': 'Services',
    'nav.works': 'Works',
    'nav.process': 'Process',
    'nav.about': 'About',
    'clock.shinya': '— 深夜です. This is the hour the work gets made.',
    'clock.day': '— the night will come.',
    'footer.tagline': 'Music and film made after midnight — generated with AI, directed by people.',
    'footer.channels': 'Channels',
    'footer.stores': 'Stores',
    'footer.ytMusic': 'YouTube · Music',
    'footer.ytStudio': 'YouTube · Studio',
    'footer.copy': '© 2026 SHINYA Studio. Late night music and film from Tokyo.',
  },
  ko: {
    'nav.services': '서비스',
    'nav.works': '작품',
    'nav.process': '제작 방식',
    'nav.about': '소개',
    'clock.shinya': '— 深夜です. 작업이 만들어지는 바로 그 시간입니다.',
    'clock.day': '— 밤은 반드시 옵니다.',
    'footer.tagline': '밤에 만드는 음악과 영상 — AI로 생성하고, 사람이 연출합니다.',
    'footer.channels': '채널',
    'footer.stores': '스토어',
    'footer.ytMusic': 'YouTube · 음악',
    'footer.ytStudio': 'YouTube · 스튜디오',
    'footer.copy': '© 2026 SHINYA Studio. 밤에 만드는 음악과 영상.',
  },
  ja: {
    'nav.services': 'サービス',
    'nav.works': '作品',
    'nav.process': '制作方法',
    'nav.about': 'アバウト',
    'clock.shinya': '— 深夜です。作品が生まれる時間。',
    'clock.day': '— 夜は必ず来ます。',
    'footer.tagline': '夜に作る音楽と映像 — AIで生成し、人が演出します。',
    'footer.channels': 'チャンネル',
    'footer.stores': 'ストア',
    'footer.ytMusic': 'YouTube · 音楽',
    'footer.ytStudio': 'YouTube · スタジオ',
    'footer.copy': '© 2026 SHINYA Studio. 東京発、夜に作る音楽と映像。',
  },
} as const;

export const t = (lang: Lang, key: keyof (typeof ui)['en']): string => ui[lang][key] ?? ui.en[key];
