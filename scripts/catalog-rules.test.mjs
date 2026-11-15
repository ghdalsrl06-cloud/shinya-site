// The title rules, checked against titles as they are on the channel.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { blurb, buildSeries, isSkipped, parseTitle } from './catalog-rules.mjs';

test('EP.N | Name is an episode of Name', () => {
  assert.deepEqual(parseTitle('EP.01 | 남편이 나를 AI로 교체했다 【AI드라마】 #숏드라마 #AI드라마'), {
    name: '남편이 나를 AI로 교체했다',
    no: 1,
    title: '남편이 나를 AI로 교체했다',
  });
});

test('Hook | Name N화 is an episode of Name, shown as the hook', () => {
  assert.deepEqual(parseTitle('라떼에 하트 100개… 평생 삼시 세끼를 책임지겠다는 카페 사장님!? | 호감도 버그 3화'), {
    name: '호감도 버그',
    no: 3,
    title: '라떼에 하트 100개… 평생 삼시 세끼를 책임지겠다는 카페 사장님!?',
  });
});

test('「」 marks the name inside a longer label', () => {
  assert.deepEqual(parseTitle('수당 안 준 회사에 복수하러 온 튜토리얼 1번 몹 | AI드라마 「전생했더니 최강 고양이」 1화'), {
    name: '전생했더니 최강 고양이',
    no: 1,
    title: '수당 안 준 회사에 복수하러 온 튜토리얼 1번 몹',
  });
});

test('a title with no episode number is a single work', () => {
  assert.deepEqual(parseTitle('「트릿」 아파트 할로윈의 규칙 | 단편 공포영화'), { name: '트릿', no: null, title: '「트릿」 아파트 할로윈의 규칙 | 단편 공포영화' });
  assert.deepEqual(parseTitle('공략집이 하나도 안 통하는 그녀 #호감도버그 #애니 #shorts'), { name: null, no: null, title: '공략집이 하나도 안 통하는 그녀' });
});

test('skip words are matched on the title as written, brackets included', () => {
  const words = ['뮤직비디오', '가사', 'Lyrics', '트레일러'];
  assert.ok(isSkipped('-1°C (영하 1도) | Frozen in Time – Korean Winter Ballad (Lyrics/가사) 【AI 뮤직비디오】', words));
  assert.ok(isSkipped("I'm awake, now the dark knows my name | AWAKE – 다크 팝 · 여자 보컬 (가사)", words));
  assert.ok(isSkipped('이 게임의 이름을 지어 주세요 | 최후의 전투 【AI 시네마틱 트레일러】', words));
  assert.ok(!isSkipped('「트릿」 아파트 할로윈의 규칙 | 단편 공포영화', words));
});

test('episodes group into series in number order; clips and skipped titles stay out', () => {
  const v = (id, raw, publishedAt, vertical = false) => ({ id, raw, description: `${id} 설명`, publishedAt, vertical, thumb: `${id}.jpg`, channel: 'studio' });
  const series = buildSeries(
    [
      v('b3', '세 번째 | 호감도 버그 3화', '2026-11-12T08:00:01Z'),
      v('b1', '첫 번째 | 호감도 버그 1화', '2026-11-05T08:00:04Z'),
      v('clip', '공략집이 하나도 안 통하는 그녀 #호감도버그 #shorts', '2026-11-11T10:00:00Z', true),
      v('mv', 'Night Mode (가사) 【AI 뮤직비디오】', '2026-10-23T09:00:00Z'),
      v('one', '「트릿」 아파트 할로윈의 규칙 | 단편 공포영화', '2026-10-30T12:00:08Z'),
    ],
    { skipTitles: ['뮤직비디오'], skipClips: true },
  );
  assert.deepEqual(series.map((s) => [s.id, s.kind, s.title, s.episodes.map((e) => e.id)]), [
    ['series:호감도 버그', 'group', '호감도 버그', ['b1', 'b3']],
    ['one', 'video', '트릿', ['one']],
  ]);
  assert.equal(series[0].description, 'b1 설명');
  assert.equal(series[0].cover, 'b3.jpg');
  assert.equal(series[0].updatedAt, '2026-11-12T08:00:01Z');
});

test('a description is its first paragraph, without tag lines', () => {
  assert.equal(blurb('#숏드라마 #AI드라마\n\n석 달 만에 집에 돌아왔다.\n통유리 너머였다.\n\n구독과 좋아요'), '석 달 만에 집에 돌아왔다. 통유리 너머였다.');
});
