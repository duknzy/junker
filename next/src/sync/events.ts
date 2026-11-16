type Listener = () => void;

const listeners = new Set<Listener>();

/**
 * ローカルデータが変わったことを同期エンジンへ知らせる。
 * Dexie の changes イベントだと同期で書き戻したときにも反応して
 * ループするため、リポジトリの書き込み関数から明示的に呼ぶ。
 */
export function notifyLocalChange(): void {
  for (const listener of listeners) listener();
}

export function onLocalChange(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
