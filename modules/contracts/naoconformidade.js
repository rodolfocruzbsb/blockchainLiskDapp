var private = {}, self = null,
	library = null, modules = null;

function naoconformidade(cb, _library) {
	self = this;
	self.type = 6
	library = _library;
	cb(null, self);
}

var aliasedFields = [
	{ field: "t.id", alias: "id" },
	{ field: "t.blockId", alias: "blockId" },
	{ field: "t.senderId", alias: "senderId" },
	{ field: "t.recipientId", alias: "recipientId" },
	{ field: "t.amount", alias: "amount" },
	{ field: "t.fee", alias: "fee" },
	{ field: "t.timestamp", alias: "timestamp" },
	{ field: "entry", alias: "entry" }
];

var fieldMap = {
	"id": String,
	"blockId": String,
	"senderId": String,
	"recipientId": String,
	"amount": Number,
	"fee": Number,
	"timestamp": Date,
	"entry": String
};

naoconformidade.prototype.create = function (data, trs) {
	trs.recipientId = data.recipientId;
	trs.asset = {
		entry: new Buffer(data.entry, 'utf8').toString('hex') // Salva o texto da Não conformidade em hexadecimal.
	};

	return trs;
}

naoconformidade.prototype.calculateFee = function (trs) {
    return 0; // Não tem Taxa, isso mesmo é FREE hahaha!
}

naoconformidade.prototype.verify = function (trs, sender, cb, scope) {
	if (trs.asset.entry.length > 2000) {
		return setImmediate(cb, "Texto máximo permitido para Não conformidade é de 1000 caracteres!");
	}

	setImmediate(cb, null, trs);
}

naoconformidade.prototype.getBytes = function (trs) {
	return new Buffer(trs.asset.entry, 'hex');
}

naoconformidade.prototype.apply = function (trs, sender, cb, scope) {
    modules.blockchain.accounts.mergeAccountAndGet({
        address: sender.address,
        balance: -trs.fee
    }, cb);
}

naoconformidade.prototype.undo = function (trs, sender, cb, scope) {
    modules.blockchain.accounts.undoMerging({
        address: sender.address,
        balance: -trs.fee
    }, cb);
}

naoconformidade.prototype.applyUnconfirmed = function (trs, sender, cb, scope) {
    if (sender.u_balance < trs.fee) {
        return setImmediate(cb, "Enviador não tem moedas suficiente"); //Como não há taxação[fee] este ponto não será alcançado
    }

    modules.blockchain.accounts.mergeAccountAndGet({
        address: sender.address,
        u_balance: -trs.fee
    }, cb);
}

naoconformidade.prototype.undoUnconfirmed = function (trs, sender, cb, scope) {
    modules.blockchain.accounts.undoMerging({
        address: sender.address,
        u_balance: -trs.fee
    }, cb);
}

naoconformidade.prototype.ready = function (trs, sender, cb, scope) {
	setImmediate(cb);
}

naoconformidade.prototype.save = function (trs, cb) {
	modules.api.sql.insert({
		table: "asset_entries",
		values: {
			transactionId: trs.id,
			entry: trs.asset.entry
		}
	}, cb);
}

naoconformidade.prototype.dbRead = function (row) {
	if (!row.gb_transactionId) {
		return null;
	} else {
		return {
			entry: row.gb_entry
		};
	}
}

naoconformidade.prototype.normalize = function (asset, cb) {
	library.validator.validate(asset, {
		type: "object", // It is an object
		properties: {
			entry: { // It contains a entry property
				type: "string", // It is a string
				format: "hex", // It is in a hexadecimal format
				minLength: 1 // Minimum length of string is 1 character
			}
		},
		required: ["entry"] // Entry property is required and must be defined
	}, cb);
}

naoconformidade.prototype.onBind = function (_modules) {
	modules = _modules;
	modules.logic.transaction.attachAssetType(self.type, self);
}

naoconformidade.prototype.add = function (cb, query) {
	library.validator.validate(query, {
		type: "object",
		properties: {
			recipientId: {
				type: "string",
				minLength: 1,
				maxLength: 21
			},
			secret: {
				type: "string",
				minLength: 1,
				maxLength: 100
			},
			entry: {
				type: "string",
				minLength: 1,
				maxLength: 1000
			}
		}
	}, function (err) {
		// If error exists, execute callback with error as first argument
		if (err) {
			return cb(err[0].message);
		}

		var keypair = modules.api.crypto.keypair(query.secret);

		modules.blockchain.accounts.setAccountAndGet({
			publicKey: keypair.publicKey.toString('hex')
		}, function (err, account) {
			// If error occurs, call cb with error argument
			if (err) {
				return cb(err);
			}

			console.log(account);
			try {
				var transaction = library.modules.logic.transaction.create({
					type: self.type,
					entry: query.entry,
					recipientId: query.recipientId,
					sender: account,
					keypair: keypair
				});
			} catch (e) {
				// Catch error if something goes wrong
				return setImmediate(cb, e.toString());
			}

			// Send transaction for processing
			modules.blockchain.transactions.processUnconfirmedTransaction(transaction, cb);
		});
	});
}

naoconformidade.prototype.list = function (cb, query) {
    // Verify query parameters
    library.validator.validate(query, {
        type: "object",
        properties: {
            recipientId: {
                type: "string",
                minLength: 2,
                maxLength: 21
            }
        },
        required: ["recipientId"]
    }, function (err) {
        if (err) {
            return cb(err[0].message);
        }

        // Select from transactions table and join entries from the asset_entries table
        modules.api.sql.select({
            table: "transactions",
            fields: aliasedFields,
            alias: "t",
            condition: {
                recipientId: query.recipientId,
                type: self.type
            },
            join: [{
                type: 'left outer',
                table: 'asset_entries',
                alias: "gb",
                on: {"t.\"id\"": "gb.\"transactionId\""}
            }]
        }, fieldMap, function (err, transactions) {
            if (err) {
                return cb(err.toString());
            }

            // Map results to asset object
            var entries = transactions.map(function (tx) {
                tx.asset = {
                    entry: new Buffer(tx.entry, 'hex').toString('utf8')
                };

                delete tx.entry;
                return tx;
            });

            return cb(null, {
                entries: entries
            })
        });
    });
}

module.exports = naoconformidade;
