import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  articleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article',
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  action: {
    type: String,
    required: true,
    enum: ['view', 'share', 'favorite'],
    index: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Create compound index for unique tracking per user/article/action/day
analyticsSchema.index(
  {
    userId: 1,
    articleId: 1,
    action: 1,
    timestamp: 1
  }
);

export const Analytics = mongoose.models.Analytics || mongoose.model('Analytics', analyticsSchema);
