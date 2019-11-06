import mongoose from "mongoose";

const Schema = mongoose.Schema;
const CommentSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  body: { type: String, required: true },
  created: { type: Date, default: Date.now }
});

CommentSchema.set('toJSON', { getters: true });
CommentSchema.options.toJSON.transform = (doc, ret) => {
  const obj = { ...ret };
  delete obj._id;
  return obj;
};

const PostSchema = new Schema({
  title: { type: String, required: true },
  url: { type: String },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  score: { type: Number, default: 0 },
  votes: [{ user: Schema.Types.ObjectId, vote: Number, _id: false }],
  comments: [CommentSchema],
  created: { type: Date, default: Date.now },
  views: { type: Number, default: 0 },
  type: { type: String, default: 'link', required: true },
  text: { type: String },
});

PostSchema.set('toJSON', { getters: true, virtuals: true });
PostSchema.options.toJSON.transform = (doc, ret) => {
  const obj = { ...ret };
  delete obj._id;
  delete obj.__v;
  return obj;
};

PostSchema.virtual('upvotePercentage').get(function () {
  if (this.votes.length === 0) return 0;
  const upvotes = this.votes.filter(vote => vote.vote === 1);
  return Math.floor((upvotes.length / this.votes.length) * 100);
});

PostSchema.methods.vote = function (user, vote) {
  const existingVote = this.votes.find(item => item.user._id.equals(user));

  if (existingVote) {
    // reset score
    this.score -= existingVote.vote;
    if (vote === 0) {
      // remove vote
      this.votes.pull(existingVote);
    } else {
      // change vote
      this.score += vote;
      existingVote.vote = vote;
    }
  } else if (vote !== 0) {
    // new vote
    this.score += vote;
    this.votes.push({ user, vote });
  }

  return this.save();
};

PostSchema.methods.addComment = function (author, body) {
  this.comments.push({ author, body });
  return this.save();
};

PostSchema.methods.removeComment = function (id) {
  const comment = this.comments.id(id);
  if (!comment) throw new Error('Comment not found');
  comment.remove();
  return this.save();
};

PostSchema.pre(/^find/, function () {
  this.populate('author').populate('comments.author');
});

PostSchema.pre('save', function (next) {
  this.wasNew = this.isNew;
  next();
});

PostSchema.post('save', function (doc, next) {
  if (this.wasNew) this.vote(this.author._id, 1);
  doc
    .populate('author')
    .populate('comments.author')
    .execPopulate()
    .then(() => next());
});

const Post = mongoose.model('Post', PostSchema);

export { Post }
