const {OAuth2Client} = require('google-auth-library');

async function authenticate(req, res, next) {
	if (req.get('authorization') == null || req.get('authorization') == '' || !req.get('authorization').startsWith('Bearer ')) {
		req.user = {roles: []};
		return next();
	}
	try {
		token = JSON.parse(req.get('authorization').slice(7));
		if (!token.token) {
			req.user = {roles: []};
			return next();
		}
		const client = new OAuth2Client('263273650927-8hg4d3stccism1g1jq5372e0g03ni6du.apps.googleusercontent.com');
		const ticket = await client.verifyIdToken({
			idToken: token.token
			//audience: '263273650927-8hg4d3stccism1g1jq5372e0g03ni6du.apps.googleusercontent.com'
		});
		const payload= ticket.getPayload();
		console.log('Google payload is '+JSON.stringify(payload));
	}
	catch (e) {
		req.user = {roles: []};
		return next();
	}
	let email = payload['email'];
	const admins = ['timothyaaronwhite@gmail.com','awesomenerd.dv@gmail.com','braden.thompson18@gmail.com','eddie52gomez@gmail.com'];
	if (admins.includes(email)) {
		req.user = {roles: 'admin'};
		next();
	}
	else {
		res.locals.connection.query("SELECT * FROM users WHERE email = ?", email, function(error, results, fields) {
			if (!error && results.length) {
				req.user = {id: results[0].userID, roles: []};
				res.locals.connection.query("SELECT * FROM supervisors WHERE userID = ?", results[0].userID, function(error, results, fields) {
					if (!error && results.length) {
						for (i in results) {
							req.user.roles.insert({role: 'supervisor', org: results[i].orgID});
						}
					}
					res.locals.connection.query("SELECT * FROM tutors WHERE userID = ?", results[0].userID, function(error, results, fields) {
						if (!error && results.length) {
							for (i in results) {
								req.user.roles.insert({role: 'tutor', org: results[i].orgID});
							}
						}
						res.locals.connection.query("SELECT * FROM students WHERE userID = ?", results[0].userID, function(error, results, fields) {
							if (!error && results.length) {
								for (i in results) {
									req.user.roles.insert({role: 'student', org: results[i].orgID});
								}
							}
							next();
						});
					});
				});
			}
			else {
				req.user = {roles: []};
			}
		});
	}
}

function isAdmin(req, res, next) {
	if (req.user.roles == 'admin') next();
	else res.status(401).send({error:'Insufficient permissions'});
}

function isAdminOrSupervisorWithOrg(req, res, next) {
	if (req.user.roles == 'admin' || req.user.roles.includes({role: 'supervisor', org: req.params.orgID})) next();
	else res.status(401).send({error:'Insufficient permissions'});
}

function isTutorWithOrg(req, res, next) {
	if (req.user.roles.includes({role: 'tutor', org: req.params.orgID})) next();
	else res.status(401).send({error:'Insufficient permissions'});
}

function isSameUser(req, res, next) {
	if (req.params.userID == req.user.id) next();
	else res.status(401).send({error:'Insufficient permissions'});
}

function isNewUser(req, res, next) {
	if (req.user == {}) next();
	else res.status(400).send({error:'User already exists'});
}

module.exports = {authenticate, isAdmin, isAdminOrSupervisorWithOrg, isTutorWithOrg, isSameUser, isNewUser};
