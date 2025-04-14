import mongoose, { Document } from 'mongoose';

// Add serialized interfaces
interface SerializedView {
  _id: string;
  userId: string;
  viewedAt: string;
}

interface SerializedArticle {
  _id: string;
  title: string;
  description?: string;
  content?: string;
  url: string;
  urlToImage?: string;
  publishedAt: string;
  source: {
    id?: string;
    name: string;
  };
  favorites: string[];
  views: SerializedView[];
  category?: string;
  createdAt: string;
}

interface IArticle {
  title: string;
  description?: string;
  content?: string;
  url: string;
  urlToImage?: string;
  publishedAt: Date;
  source: {
    id?: string;
    name: string;
  };
  favorites: mongoose.Types.ObjectId[];
  views: Array<{
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    viewedAt: Date;
  }>;
  category?: string;
  createdAt: Date;
}

interface ArticleMethods {
  addView(userId: string): Promise<void>;
  addToFavorites(userId: string): Promise<void>;
  removeFromFavorites(userId: string): Promise<void>;
  toJSON(): SerializedArticle;
}

type ArticleDocument = Document & IArticle & ArticleMethods;

const articleSchema = new mongoose.Schema<ArticleDocument>({
  title: { type: String, required: true },
  description: String,
  content: String,
  url: { type: String, required: true, unique: true },
  urlToImage: String,
  publishedAt: Date,
  source: {
    id: String,
    name: String
  },
  createdAt: { type: Date, default: Date.now },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  views: [{
    _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    viewedAt: { type: Date, default: Date.now }
  }],
  category: String
});

// Update toJSON implementation
articleSchema.method('toJSON', function(): SerializedArticle {
  const obj = this.toObject() as Document & IArticle & { _id: mongoose.Types.ObjectId };
  return {
    ...obj,
    _id: obj._id.toString(),
    publishedAt: obj.publishedAt.toISOString(),
    createdAt: obj.createdAt.toISOString(),
    favorites: obj.favorites?.map(id => id.toString()) || [],
    views: obj.views?.map(view => ({
      _id: view._id.toString(),
      userId: view.userId.toString(),
      viewedAt: new Date(view.viewedAt).toISOString()
    })) || []
  };
});

// Define methods individually instead of as an object
articleSchema.method('addView', async function(userId: string) {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID');
  }

  const userObjectId = new mongoose.Types.ObjectId(userId);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Handle null/undefined views array
  if (!this.views || !Array.isArray(this.views)) {
    this.views = [];
  }

  // Clean any invalid view entries and ensure each has _id
  this.views = this.views.filter(view => {
    if (!view || typeof view !== 'object' || !view.userId || !view.viewedAt) {
      return false;
    }
    if (!view._id) {
      view._id = new mongoose.Types.ObjectId();
    }
    return true;
  });

  // Check if view exists for today using proper object comparison
  const existingView = this.views.find(view =>
    view.userId.toString() === userObjectId.toString() &&
    new Date(view.viewedAt) >= today
  );

  if (!existingView) {
    this.views.push({
      _id: new mongoose.Types.ObjectId(),
      userId: userObjectId,
      viewedAt: new Date()
    });
    await this.save();
  }

  return this;
});

articleSchema.method('addToFavorites', async function(userId: string) {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID');
  }

  const userObjectId = new mongoose.Types.ObjectId(userId);

  // Initialize favorites array if it doesn't exist
  this.favorites = this.favorites || [];

  // Check if already in favorites
  const alreadyFavorited = this.favorites.some(id =>
    id && id.equals && id.equals(userObjectId)
  );

  if (!alreadyFavorited) {
    this.favorites.push(userObjectId);
    await this.save();
  }
});

articleSchema.method('removeFromFavorites', async function(userId: string) {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID');
  }

  const userObjectId = new mongoose.Types.ObjectId(userId);

  // Initialize favorites array if it doesn't exist
  if (!this.favorites) {
    this.favorites = [];
    return;
  }

  this.favorites = this.favorites.filter(id =>
    !(id && id.equals && id.equals(userObjectId))
  );

  await this.save();
});

export const Article = mongoose.models.Article as mongoose.Model<ArticleDocument> ||
  mongoose.model<ArticleDocument>('Article', articleSchema);
