import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  article: {
    title: String,
    description: String,
    url: String,
    urlToImage: String,
    publishedAt: String,
    source: {
      id: String,
      name: String
    }
  },
  createdAt: { type: Date, default: Date.now }
});

export const History = mongoose.models.History || mongoose.model('History', historySchema);
