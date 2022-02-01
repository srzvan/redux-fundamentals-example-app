export const StatusFilters = {
  All: 'all',
  Active: 'active',
  Completed: 'completed',
}

const initialState = {
  status: 'all',
  colors: [],
}

export const actions = {
  CHANGE_STATUS_FILTER: 'filters/CHANGE_STATUS_FILTER',
  CHANGE_COLOR_FILTER: 'filters/CHANGE_COLOR_FILTER',
}

export default function filtersReducer(state = initialState, action) {
  switch (action.type) {
    case actions.CHANGE_STATUS_FILTER: {
      return {
        ...state,
        status: action.payload,
      }
    }
    case actions.CHANGE_COLOR_FILTER: {
      if (action.payload.changeType === 'add') {
        return {
          ...state,
          colors: [...state.colors, action.payload.color],
        }
      }

      return {
        ...state,
        colors: state.colors.filter((color) => color !== action.payload.color),
      }
    }
    default:
      return state
  }
}
