import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userService from './userService';

const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
  user: user ? user : null,
  isError: false,
  userDetails: {},
  isSuccess: false,
  isLoading: false,
  incomes: [],
  expenses: [],
  savings: [],
  billReminders: [],
  budgets: [],
  goals: [],
  message: '',
};

export const register = createAsyncThunk('user/register', async (userData, thunkAPI) => {
  try {
    const response = await userService.register(userData);
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const login = createAsyncThunk('user/login', async (userData, thunkAPI) => {
  try {
    const response = await userService.login(userData);
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getMe = createAsyncThunk('user/getMe', async (token, thunkAPI) => {
  try {
    const token = thunkAPI.getState().userauth.user.token;
    const response = await userService.getMe(token);
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const createExpense = createAsyncThunk('user/createExpense', async (expenseData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().userauth.user.token;
    const response = await userService.createExpense(expenseData, token);
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const createIncome = createAsyncThunk('user/createIncome', async (incomeData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().userauth.user.token;
    const response = await userService.createIncome(incomeData, token);
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getAllIncomes = createAsyncThunk('user/getAllIncomes', async (token, thunkAPI) => {
  try {
    const token = thunkAPI.getState().userauth.user.token;
    const response = await userService.getAllIncomes(token);
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getAllExpenses = createAsyncThunk('user/getAllExpenses', async (token, thunkAPI) => {
  try {
    const token = thunkAPI.getState().userauth.user.token;
    const response = await userService.getAllExpenses(token);
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getUserInfo = createAsyncThunk('user/getUserInfo', async (token, thunkAPI) => {
  try {
    const token = thunkAPI.getState().userauth.user.token;
    const response = await userService.getUserInfo(token);
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const createSavings = createAsyncThunk('user/createSavings', async (savingsData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().userauth.user.token;
    const response = await userService.createSavings(savingsData, token);
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getAllSavings = createAsyncThunk('user/getAllSavings', async (token, thunkAPI) => {
  try {
    const token = thunkAPI.getState().userauth.user.token;
    const response = await userService.getAllSavings(token);
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const createBillReminder = createAsyncThunk('user/createBillReminder', async (billReminderData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().userauth.user.token;
    const response = await userService.createBillReminder(billReminderData, token);
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getAllBillReminders = createAsyncThunk('user/getAllBillReminders', async (token, thunkAPI) => {
  try {
    const token = thunkAPI.getState().userauth.user.token;
    const response = await userService.getAllBillReminders(token);
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const createBudget = createAsyncThunk('user/createBudget', async (budgetData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().userauth.user.token;
    const response = await userService.createBudget(budgetData, token);
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getAllBudgets = createAsyncThunk('user/getAllBudgets', async (token, thunkAPI) => {
  try {
    const token = thunkAPI.getState().userauth.user.token;
    const response = await userService.getAllBudgets(token);
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const createGoal = createAsyncThunk('user/createGoal', async (goalData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().userauth.user.token;
    const response = await userService.createGoal(goalData, token);
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getAllGoals = createAsyncThunk('user/getAllGoals', async (token, thunkAPI) => {
  try {
    const token = thunkAPI.getState().userauth.user.token;
    const response = await userService.getAllGoals(token);
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const updateUserInfo = createAsyncThunk('user/updateUserInfo', async (userData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().userauth.user.token;
    const response = await userService.updateUserInfo(userData, token);
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const addPersonalDetails = createAsyncThunk('user/getPersonalDetails', async (userData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().userauth.user.token;
    const response = await userService.addPersonalDetails(userData, token);
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    reset: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      .addCase(getMe.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.userDetails = action.payload;
      })
      .addCase(getMe.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createExpense.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createExpense.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = 'Expense created successfully.';
      })
      .addCase(createExpense.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createIncome.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createIncome.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = 'Income created successfully.';
      })
      .addCase(createIncome.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getAllIncomes.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllIncomes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.incomes = action.payload;
      })
      .addCase(getAllIncomes.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getAllExpenses.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllExpenses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.expenses = action.payload;
      })
      .addCase(getAllExpenses.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getUserInfo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.userDetails = action.payload;
      })
      .addCase(getUserInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createSavings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createSavings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = 'Savings created successfully.';
        state.userDetails = action.payload;
      })
      .addCase(createSavings.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getAllSavings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllSavings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.savings = action.payload;
        state.userDetails = action.payload;
      })
      .addCase(getAllSavings.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        
      })
      .addCase(createBillReminder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createBillReminder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = 'Bill reminder created successfully.';
        state.userDetails = action.payload;
      })
      .addCase(createBillReminder.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getAllBillReminders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllBillReminders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.billReminders = action.payload;
        state.userDetails = action.payload;
      })
      .addCase(getAllBillReminders.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createBudget.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createBudget.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = 'Budget created successfully.';
        state.userDetails = action.payload;
      })
      .addCase(createBudget.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getAllBudgets.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllBudgets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.budgets = action.payload;
        state.userDetails = action.payload;
      })
      .addCase(getAllBudgets.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createGoal.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createGoal.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = 'Goal created successfully.';
        state.userDetails = action.payload;
      })
      .addCase(createGoal.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getAllGoals.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllGoals.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.goals = action.payload;
        state.userDetails = action.payload;
      })
      .addCase(getAllGoals.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateUserInfo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUserInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = 'User info updated successfully.';
        state.userDetails = action.payload;
        state.userDetails = action.payload;
      })
      .addCase(updateUserInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(addPersonalDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addPersonalDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = 'User info updated successfully.';
        state.userDetails = action.payload;
        state.userDetails = action.payload;
      })
      .addCase(addPersonalDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
      
  },
});

export const { reset } = userSlice.actions;

export default userSlice.reducer;
