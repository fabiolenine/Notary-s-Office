var mongoose = require('mongoose');
var bcrypt	 = require('bcrypt-nodejs');

var sequenceAuthSchema = new mongoose.Schema({	primeironome	: {	type		: String,
																  	required	: true	
																  },
											  	ultimonome		: String,
											  	numerocelular	: {	type		: String,
																	unique		: true,
																  	required	: true	
																  },
											  	contaverificada	: {	type		:Boolean,
																  	default		: false},
											  	criadotimestamp	: {	type		: Date,
																  	default		: Date.now},
											  	//foto			: { data		: Buffer, 
																   	contentType	: String },
												local			: {	email		: {	type		: String,
																					unique		: true,
																  					required	: true	
																  					},
														   			password	: {	type		: String,
																  					required	: true	
																  					}}
                                       });

// methods
// generating a hash
sequenceAuthSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
sequenceAuthSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.local.password);
};

exports.model = mongoose.model('sequenceauth',sequenceAuthSchema);