const UserModel = require('../models/user-model')

createUser = (req, res) => {
	const body = req.body

	if (!body) {
		return res.status(400).json({
			success: false,
			error: 'You must provide a user',
		})
	}

	const user = new UserModel(body)
	if (!user) {
		return res.status(400).json({ success: false, error: err })
	}

	user
		.save()
		.then(() => {
			return res.status(200).json({
				success: true,
				id: user._id,
				message: 'User created!',
			})
		})
		.catch(error => {
			return res.status(400).json({
				error,
				message: 'User not created!',
			})
		})
}

updateUser = async (req, res) => {
	const body = req.body
	if (!body) {
		return res.status(400).json({
			success: false,
			error: 'You must provide a body to update',
		})
	}

	UserModel.findOne({ _id: req.params.id }, (err, user) => {
		if (err) {
			return res.status(404).json({
				err,
				message: 'User not found!',
			})
		}
		user.firstName = body.firstName
		user.lastName = body.lastName
		user.phone = body.phone
		user.email = body.email
		user
			.save()
			.then(() => {
				return res.status(200).json({
					success: true,
					id: user._id,
					message: 'User updated!',
				})
			})
			.catch(error => {
				return res.status(404).json({
					error,
					message: 'User not updated!',
				})
			})
	})
}

deleteUser = async (req, res) => {
	await UserModel.findOneAndDelete({ _id: req.params.id }, (err, user) => {
		if (err) {
			return res.status(400).json({ success: false, error: err })
		}

		if (!user) {
			return res
				.status(404)
				.json({ success: false, error: `User not found` })
		}

		return res.status(200).json({ success: true, data: user })
	}).catch(err => console.log(err))
}

getUserById = async (req, res) => {
	await UserModel.findOne({ _id: req.params.id }, (err, user) => {
		if (err) {
			return res.status(400).json({ success: false, error: err })
		}

		if (!user) {
			return res
				.status(404)
				.json({ success: false, error: `User not found` })
		}
		return res.status(200).json({ success: true, data: user })
	}).catch(err => console.log(err))
}

getUser = async (req, res) => {
	const body = req.body
	console.log(body)
	if (!body) {
		return res.status(400).json({
			success: false,
			error: 'You must provide a user',
		})
	}

	const user = new UserModel(body)
	if (!user) {
		return res.status(400).json({ success: false, error: err })
	}

	await UserModel.find({ username: body.username, password: body.password }, (err, user) => {
		if (err) {
			return res.status(400).json({ success: false, error: err })
		}
		if (!user.length) {
			return res
				.status(404)
				.json({ success: false, error: `User not found` })
		}
		return res.status(200).json({ success: true, data: user })
	}).catch(err => console.log(err))
}

module.exports = {
	createUser,
	updateUser,
	deleteUser,
	getUser,
	getUserById,
}