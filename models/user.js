var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');


var personSchema = new Schema({
    _id: Schema.Types.ObjectId,
    facebookID: {
        type: String
    },
    googleID: {
        type: String
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String
    },
    password: {
        type: String
    },
    messages: [{
        type: Schema.Types.ObjectId,
        ref: 'Message'
    }],
    offers: {
        type: String
    },
    imagepath: {
        type: String
    },
    location: {
        type: String
    },
    lastLogin: {
        type: Date
    },
    tippeehistory: [{
        type: Schema.Types.ObjectId,
        ref: 'tippee'
    }],
    tipperhistory: [{
        type: Schema.Types.ObjectId,
        ref: 'tipper'
    }],

    description: {
        type: String
    },

    customer_id: {
        type: String
    },

    card_holder_details: {
        type: Object
    },

    card: {
        isCard: {
            type: Boolean
        },
        payment_credentials: {
            type: Object
        },
        card_credentials: {
            type: Object
        },
        card_data: {
            type: Object
        }
    },
    creator: {
        isCreator: {
            type: Boolean,
            required: true
        },
        creatorName: {
            type: String,
            required: true
        },
        creatorNameuser: {
            type: String,
            required: true
        },
        creatorEmail: {
            type: String,
            required: true
        },
        creatorUrl: {
            type: String,
            required: true
        },
        creatorDesc: {
            type: String
        },
        creatorLocation: {
            type: String,
            required: true
        },
        creatorCategories: [],
        creatorTileImage: {
            type: String
        },
        creatorBack: {
            type: String
        },
        creatorThumbnail: {
            type: String
        },
        creatorAbout: {
            type: String
        },
        facebookURL: {
            type: String
        },
        twitterURL: {
            type: String
        }
    },



});

//encrypting the password
personSchema.methods.encryptPassword = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
}

//decrypting password and compare the passwords
personSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model(
    'user', personSchema
);