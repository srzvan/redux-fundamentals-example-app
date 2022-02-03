import { createSlice } from '@reduxjs/toolkit'

import { StatusFilters } from '../../utils'

export const CHANGE_COLOR_TYPES = {
  ADD: 'add',
  REMOVE: 'remove',
}

const initialState = {
  status: StatusFilters.All,
  colors: [],
}

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    statusFilterChanged(state, action) {
      state.status = action.payload
    },
    colorFilterChanged: {
      reducer(state, action) {
        const { color, changeType } = action.payload

        if (changeType === CHANGE_COLOR_TYPES.ADD) {
          state.colors.push(color)
        } else {
          const newColors = state.colors.filter((c) => c !== color)

          state.colors = newColors
        }
      },
      prepare(color, changeType) {
        return {
          payload: { color, changeType },
        }
      },
    },
  },
})

export const { statusFilterChanged, colorFilterChanged } = filtersSlice.actions

export default filtersSlice.reducer
