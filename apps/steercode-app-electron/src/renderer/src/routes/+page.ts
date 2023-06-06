import { recentRepositories } from '$lib/shared/stores/recentRepositories';

export function load() {
  recentRepositories.fetchData();
  return {};
}
