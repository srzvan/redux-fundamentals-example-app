export const StatusFilters = {
  All: 'all',
  Active: 'active',
  Completed: 'completed',
}

const initialState = {
  status: 'all',
  colors: [],
}

const actionTypes = {
  CHANGE_STATUS_FILTER: 'filters/CHANGE_STATUS_FILTER',
  CHANGE_COLOR_FILTER: 'filters/CHANGE_COLOR_FILTER',
}

export const actionCreators = {
  colorFilterChanged: (color, changeType) => ({
    type: actionTypes.CHANGE_COLOR_FILTER,
    payload: { color, changeType },
  }),
  statusFilterChanged: (status) => ({
    type: actionTypes.CHANGE_STATUS_FILTER,
    payload: status,
  }),
}

export default function filtersReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.CHANGE_STATUS_FILTER: {
      return {
        ...state,
        status: action.payload,
      }
    }
    case actionTypes.CHANGE_COLOR_FILTER: {
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
