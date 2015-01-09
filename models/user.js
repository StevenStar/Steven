var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var utility = require('utility');

var UserSchema = new Schema({
	user_nickname: {type: String, unique: true},
	user_realname: {type: String},
	user_pass: {type: String},
	user_email: {type: String, unique: true},
	user_phone: {type: String, default: ''},
	user_sex: {type: String, default: 'secret'},
	user_birthday: {type: String, default: ''},
	user_company: {type: String, default: ''},
	user_profession: {type: String, default: ''},
	user_info: {type: String, default: '这个人很懒，什么都没有留下。'},
	user_label: {type: Object, default: ''},
	user_created: {type: Date, default: Date.now()},
	user_actived: {type: Date, default: Date.now()},

	user_url: {type: String, default: ''},
	user_weibo: {type: String, default: ''},
	user_qq: {type: String, default: ''},
	user_profile_image_url: {type: String, default: ''},
	user_signature: {type: String, default: ''},
	user_isverify: {type: Boolean, default: false},
	user_isstar: {type: Boolean, default: false},
	user_isadmin: {type: Boolean, default: false},

	user_topic_count: {type: Number, default: 0},
	user_replay_count: {type: Number, default: 0},
	user_follower_count: {type: Number, default: 0},
	user_following_count: {type: Number, default: 0}
	
});

mongoose.model('User', UserSchema);
