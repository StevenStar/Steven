var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
	from_userid: {type: Schema.Types.ObjectId},
	to_userid: {type: Schema.Types.ObjectId},
	content_id: {type: Schema.Types.ObjectId},
	comment_nickname: {type: String},
	comment_email: {type: String},
	comment_ip: {type: String},
	comment_created: {type: Date, default: Date.now()},
	comment_updated: {type: Date, default: Date.now()},
	comment_text: {type: String, default: ''},
	comment_reply: {type: String, default: ''},
	comment_agree: {type: Number, default: 0},

	comment_isread: {type: Boolean, default: false},
	comment_isreply: {type: Boolean, default: false}
});

mongoose.model('Comment', CommentSchema);
