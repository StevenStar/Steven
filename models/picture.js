var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pictureSchema = new Schema({
	user_id: {type: Schema.Types.ObjectId},
	picture_name: {type: String},
	picture_info: {type: String},
	picture_filename: {type: String, default: ''},
	picture_extension: {type: String},
	picture_size: {type: Number},
	picture_mimetype: {type: String},
	picture_md5: {type: String},
	picture_created: {type: String, default: Date.now()}
});

mongoose.model('Picture', pictureSchema);
