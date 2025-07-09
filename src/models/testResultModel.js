import mongoose from 'mongoose';

const testResultSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  good_title: {
    type: String,
    required: true
  },
  good_result: {
    type: String,
    required: true
  },
  bad_title: {
    type: String,
    required: true
  },
  bad_result: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export const TestResultModel = mongoose.model('TestResult', testResultSchema);