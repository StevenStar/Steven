var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MessageSchema = new Schema({
	from_userid: {type: Schema.Types.ObjectId},
	to_userid: {type: Schema.Types.ObjectId},
	message_nickname: {type: String},
	message_email: {type: String},
	message_ip: {type: String},
	message_created: {type: String, default: Date.now()},
	message_text: {type: String},

	message_isread: {type: Boolean, default: false}
});

mongoose.model('Message', MessageSchema);
