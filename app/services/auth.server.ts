import { Authenticator } from "remix-auth";
import { sessionStorage } from "./session.server";
import { FormStrategy } from "remix-auth-form";
import invariant from "tiny-invariant";
import bcrypt from "bcrypt";
import { db } from "@/util/db/db.server";

type UserData = {
	id: string;
	username: string;
	email: string;
};

export let authenticator = new Authenticator<UserData>(sessionStorage);

authenticator.use(
	new FormStrategy(async ({ form }) => {
		let email = form.get("email");
		let password = form.get("password");

		console.log("here");
		console.log(email);

		invariant(typeof email === "string", "email must be a string");
		invariant(email.length > 0, "email must not be empty");

		invariant(typeof password === "string", "password must be a string");
		invariant(password.length > 0, "password must not be empty");

		let user = await login(email, password);
		console.log(`user: ${user.username}`);
		return user;
	}),
	"user-pass",
);

const hash = async (password: string): Promise<string> => {
	const saltRounds = 11;
	return new Promise((resolve, reject) => {
		bcrypt.genSalt(saltRounds, (err, salt) => {
			if (err) {
				reject(err);
				return;
			}

			bcrypt.hash(password, salt, (err, hash) => {
				if (err) {
					reject(err);
					return;
				}

				resolve(hash);
			});
		});
	});
};

const selectUser = {
	id: true,
	username: true,
	email: true,
	password: true,
};

export async function createNewUser(username: string, email: string, password: string) {
	// TODO: consider validating args
	//
	const hashedPassword = await hash(password);

	try {
		const newUser = await db.user.create({
			data: {
				username,
				email,
				password: hashedPassword,
			},
			select: selectUser,
		});

		return newUser;
	} catch (err) {
		console.error("Error creating new user:", err);
	}
}

async function login(email: string, password: string) {
	console.log("login function");
	const user = await getUser(email);

	if (!user) {
		throw new Error("Error, no user found");
	}

	const match = await bcrypt.compare(password, user.password);
	if (match) {
		return user;
	} else {
		console.error("Error, password failed comparison");
		throw new Error("Error, password failed comparison");
	}
}

const getUser = async (email: string) => {
	console.log("get user details..");
	console.log(email);

	// returns null if there are no users found
	const user = await db.user.findUnique({
		where: {
			email,
		},
		select: selectUser,
	});

	console.log(`returned user: ${user}`);

	return user;
};
