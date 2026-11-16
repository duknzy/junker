import { useSyncExternalStore } from 'react';
import {
  getSyncState,
  subscribeSync,
  type SyncState,
} from './engine';

export function useSyncState(): SyncState {
  return useSyncExternalStore(subscribeSync, getSyncState, getSyncState);
}
