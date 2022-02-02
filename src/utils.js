export const capitalize = (s) => s[0].toUpperCase() + s.slice(1)

export const APICallStatusTypes = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed',
}

export const StatusFilters = {
  All: 'all',
  Active: 'active',
  Completed: 'completed',
}
