const {OAuth2Client} = require('google-auth-library');

async function authenticate(req, res, next) {
	if (req.get('authorization') == null || req.get('authorization') == '' || !req.get('authorization').startsWith('Bearer ')) {
		req.user = {role: 'none'};
		return next();
	}
	token = JSON.parse(req.get('authorization').slice(7));
	if (!token.token) {
		req.user = {role: 'none'};
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
		req.user = {role: 'admin'};
		next();
	}
	else {
		res.locals.connection.query("SELECT * FROM advisors WHERE email = ?", email, function(error, results, fields) {
			if (!error && results.length) {
				req.user = {role: 'advisor', id: results[0].advisorID};
				next();
			}
			else {
				res.locals.connection.query("SELECT * FROM students WHERE email = ?", email, function(error, results, fields) {
					if (!error && results.length) {
						req.user = {role: 'student', id: results[0].studentID};
						next();
					}
					else {
						req.user = {role: 'none'};
						next();
					}
				});
			}
		});
	}
}

function isAdmin(req, res, next) {
	if (req.user.role == 'admin') next();
	else res.status(401).send({error:'Insufficient permissions'});
}

function isAdminOrAdvisor(req, res, next) {
	if (req.user.role == 'admin' || req.user.role == 'advisor') next();
	else res.status(401).send({error:'Insufficient permissions'});
}

function isAdminOrSameAdvisor(req, res, next) {
	if (req.user.role == 'admin' || (req.user.role == 'advisor' && req.params.id == req.user.id)) next();
	else res.status(401).send({error:'Insufficient permissions'});
}

function isAdminAdvisorOrSameStudent(req, res, next) {
	if (req.user.role == 'admin' || req.user.role == 'advisor' || (req.user.role == 'student' && req.params.studentID == req.user.id)) next();
	else res.status(401).send({error:'Insufficient permissions'});
}

module.exports = {authenticate, isAdmin, isAdminOrAdvisor, isAdminOrSameAdvisor, isAdminAdvisorOrSameStudent};
