var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var musicSchema = new Schema({
	user_id: {type: Schema.Types.ObjectId},
	music_name: {type: String},
	music_author: {type: String},
	music_albumname: {type: String},
	music_info: {type: String},
	music_filename: {type: String},
	music_extension: {type: String},
	music_size: {type: Number},
	music_mimetype: {type: String},
	music_created: {type: String, default: Date.now()}
});

mongoose.model('Music', musicSchema);
