import { makeStore } from "./baseStore";
import { RecentActivity } from "./types";
import { recentActivity as initialRecentActivity } from "@/data/dashboardData";

export const activityStore = makeStore<RecentActivity[]>("activities", [...initialRecentActivity] as any);

export function useRecentActivity() {
  return activityStore.useValue();
}

export function getRecentActivity() {
  return activityStore.getValue();
}

export function addActivityItem(a: RecentActivity) {
  activityStore.setValue([a, ...activityStore.getValue()]);
}
