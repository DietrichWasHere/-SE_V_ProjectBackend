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
		let email = payload['email'];
		const admins = ['timothyaaronwhite@gmail.com','awesomenerd.dv@gmail.com','braden.thompson18@gmail.com','eddie52gomez@gmail.com'];
		if (admins.includes(email)) {
			req.user = {roles: [{role:'admin'}]};
			next();
		}
		else {
			res.locals.connection.query("SELECT * FROM users WHERE email = ?", email, function(error, results, fields) {
				if (!error && results.length) {
					userID = results[0].userID;
					req.user = {id: userID, roles: []};
					res.locals.connection.query("SELECT * FROM supervisors WHERE userID = ?", userID, function(error, results, fields) {
						if (!error && results.length) {
							for (i in results) {
								req.user.roles.push({role: 'supervisor', org: results[i].orgID});
							}
						}
						res.locals.connection.query("SELECT * FROM tutors WHERE userID = ?", userID, function(error, results, fields) {
							if (!error && results.length) {
								for (i in results) {
									req.user.roles.push({role: 'tutor', org: results[i].orgID});
								}
							}
							res.locals.connection.query("SELECT * FROM students WHERE userID = ?", userID, function(error, results, fields) {
								if (!error && results.length) {
									for (i in results) {
										req.user.roles.push({role: 'student', org: results[i].orgID});
									}
								}
								next();
							});
						});
					});
				}
				else {
					req.user = {user_info: {fname: payload.given_name, lName: payload.family_name, email: payload.email, picture: payload.picture}, roles: []};
					return next();
				}
			});
		}
	}
	catch (e) {
		req.user = {roles: []};
		return next();
	}
}

function isAdmin(req, res, next) {
	if (req.user.roles[0].role == 'admin') next();
	else res.status(401).send({error:'Insufficient permissions'});
}

function isAdminOrSupervisorWithOrg(req, res, next) {
	if (req.user.roles[0].role == 'admin' || req.user.roles.some((e) => e.role == 'supervisor' && e.org == req.params.orgID) || req.user.roles.some((e) => e.role == 'supervisor' && e.org == req.body.orgID)) next();
	else res.status(401).send({error:'Insufficient permissions'});
}

function isTutorWithOrg(req, res, next) {
	if (req.user.roles.some((e) => e.role == 'tutor' && e.org == req.params.orgID) || req.user.roles.some((e) => e.role == 'tutor' && e.org == req.body.orgID)) next();
	else res.status(401).send({error:'Insufficient permissions'});
}

function isTutor(req, res, next) {
	if (req.user.roles.some((e) => e.role == 'tutor')) next();
	else res.status(401).send({error:'Insufficient permissions'});
}

function isSameUser(req, res, next) {
	if (req.params.userID == req.user.id || req.body.userID == req.user.id) next();
	else res.status(401).send({error:'Insufficient permissions'});
}

function isNewUser(req, res, next) {
	if (!req.user.roles.length) next();
	else res.status(400).send({error:'User already exists'});
}

function isInOrg(req, res, next) {
	if (req.user.roles.some((e) => e.org == req.params.orgID) || req.user.roles.some((e) => e.org == req.body.orgID)) next();
	else res.status(401).send({error:'Insufficient permissions'});
}

module.exports = {authenticate, isAdmin, isAdminOrSupervisorWithOrg, isTutorWithOrg, isTutor, isSameUser, isNewUser, isInOrg};
