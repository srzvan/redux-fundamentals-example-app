import { createSlice } from '@reduxjs/toolkit'

import { StatusFilters } from '../../utils'

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

        if (changeType === 'add') {
          state.colors.push(color)
        } else {
          state.colors.filter((c) => c !== color)
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
