//Help method for checking if email is following normal rules
const isEmail = (email) => {
	const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if (email.match(emailRegEx)) return true;
	else return false;
};

//Help method for checking if things are empty
const isEmpty = (string) => {
	if (string.trim() == "") return true;
	else return false;
};

exports.validateSignupData = (data) => {
	let errors = {};

	//Checks if email is empty and valid
	if (isEmpty(data.email)) {
		errors.email = "Must not be empty";
	} else if (!isEmail(data.email)) {
		errors.email = "Must be a valid email address";
	}

	//Checks if password is empty
	if (isEmpty(data.password)) errors.password = "Must not be empty";
	//Checks if confirm password is the same as password
	if (data.password !== data.confirmPassword)
		errors.confirmPassword = "Passwords must match";
	//Checks if username is empty
	if (isEmpty(data.handle)) errors.handle = "Must not be empty";

	return {
		errors,
		valid: Object.keys(errors).length === 0 ? true : false,
	};
};

exports.validateLoginData = (data) => {
	let errors = {};

	if (isEmpty(data.email)) errors.email = "Must not be empty";
	if (isEmpty(data.password)) errors.password = "Must not be empty";

	return {
		errors,
		valid: Object.keys(errors).length === 0 ? true : false,
	};
};
