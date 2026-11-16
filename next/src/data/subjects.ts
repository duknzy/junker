export const SUBJECTS = [
  '数学',
  '物理',
  '化学',
  '生物',
  '英語',
  '国語',
  '日本史',
  '世界史',
  '地理',
  '公民',
  '情報',
  'その他',
] as const;

export type Subject = (typeof SUBJECTS)[number];
