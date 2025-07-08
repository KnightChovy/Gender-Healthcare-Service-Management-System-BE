import mongoose from 'mongoose';

const cycleSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true
  },
  lastPeriodDate: {
    type: Date,
    required: true
  },
  cycleLength: {
    type: Number,
    required: true
  },
  periodLength: {
    type: Number,
    required: true
  },
  pillTime: {
    type: String, // HH:mm format, e.g., "07:30"
    required: true
  },
  periodRange: {
    start: { type: Date },
    end: { type: Date }
  },
  ovulationRange: {
    start: { type: Date },
    end: { type: Date }
  },
  fertilityWindow: {
    start: { type: Date },
    end: { type: Date }
  }
}, {
  timestamps: true
});

export const CycleModel = mongoose.model('Cycle', cycleSchema);
