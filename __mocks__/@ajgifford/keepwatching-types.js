// Mock for @ajgifford/keepwatching-types to avoid ES module issues in Jest

const WatchStatus = {
  WATCHED: 'WATCHED',
  WATCHING: 'WATCHING',
  NOT_WATCHED: 'NOT_WATCHED',
  UP_TO_DATE: 'UP_TO_DATE',
  UNAIRED: 'UNAIRED',
};

const MILESTONE_THRESHOLDS = {
  episodes: [100, 500, 1000, 5000],
  movies: [25, 50, 100, 500],
  hours: [100, 500, 1000, 5000],
};

module.exports = {
  WatchStatus,
  MILESTONE_THRESHOLDS,
};
