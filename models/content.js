var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ContentSchema = new Schema({
	user_id: {type: Schema.Types.ObjectId},
	content_title: {type: String},
	content_label: {type: String},
	content_text: {type: String},
	content_info: {type: String},
	content_created: {type: Date},
	content_comment_count: {type: Number, default: 0},
	content_agree_count: {type: Number, default: 0},
	content_read_count: {type: Number, default: 0}
});

mongoose.model('Content', ContentSchema);
