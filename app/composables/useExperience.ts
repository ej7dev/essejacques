// Career start (Multivers, August 2020). Years are counted from here, so the figure never needs a manual update.
const CAREER_START = new Date(2020, 7, 1);

const yearsSince = (start: Date, now: Date) =>
  now.getFullYear() - start.getFullYear() - (now < new Date(now.getFullYear(), start.getMonth(), start.getDate()) ? 1 : 0);

/** Full years of experience: computed at build time, then refreshed in the browser in case the static build is old. */
export function useExperienceYears() {
  const years = ref(yearsSince(CAREER_START, new Date()));
  onMounted(() => { years.value = yearsSince(CAREER_START, new Date()); });
  return years;
}
