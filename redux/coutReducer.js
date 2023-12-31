import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const cout = [
  {
    id: 1,
    name: 'Achat Matiere premiere',
    amount: 600,
    validate: true,
    prodId: 1,
    date: '',
  },
  {
    id: 2,
    name: 'Transport de la marchandise',
    amount: 300,
    validate: true,
    prodId: 1,
    date: '',
  },
  {
    id: 3,
    name: 'Frais de formation',
    amount: 700,
    validate: true,
    prodId: 2,
    date: '',
  },
  {
    id: 4,
    name: 'Transport des agents',
    amount: 400,
    validate: true,
    prodId: 2,
    date: '',
  },
];

export const loadCoutsFromStorage = createAsyncThunk('couts/loadFromStorage', async () => {
  try {
    // Retrieve data from AsyncStorage
    const coutsData = await AsyncStorage.getItem('couts');
    if (coutsData) {
      // Parse the data as JSON
      const couts = JSON.parse(coutsData);
      return couts;
    } else {
      return [...cout];
    }
  } catch (error) {
    console.error('Error loading couts from AsyncStorage:', error);
    throw error;
  }
});

const coutSlice = createSlice({
  name: 'couts',
  initialState: {
    couts: [...cout],
  },
  reducers: {
    addCout: (state, action) => {
      state.couts = [...state.couts, action.payload];
      AsyncStorage.setItem('couts', JSON.stringify(action.payload));
    },
    resetAllCouts: (state, action) => {
      state.couts = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadCoutsFromStorage.fulfilled, (state, action) => {
      state.couts = action.payload;
    });
  },
});

export const { addCout, resetAllCouts } = coutSlice.actions;

export default coutSlice.reducer;
