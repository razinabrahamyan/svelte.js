import cors from 'cors';
import schemas from './src/collections';
import { fieldsToSchema, saveFiles, parse } from './src/utils/utils';
import env from './env';
import multer from 'multer';
import sharp from "sharp";

// console.log(sharp, "ssssssssssss")

// Lucia
import adapter from '@lucia-auth/adapter-mongoose';
import lucia, { generateRandomString } from 'lucia-auth';
import { user, session } from './src/collections/Auth';
import cookieParser from 'cookie-parser';

// get url to redirect the user to, with the state
const User = mongoose.model('user', new mongoose.Schema({ ...user }, { _id: false }));

const Session = mongoose.model('session', new mongoose.Schema({ ...session }, { _id: false }));

export const auth = lucia({
	adapter: adapter(mongoose),
	env: 'DEV',
	generateCustomUserId: async () => generateRandomString(32),
	transformUserData: (user) => ({
		userId: user.id,
		username: user.username
	})
});

// MongoDB database - set up a connection using the Mongoose library
import mongoose from 'mongoose';

// Turn off strict mode for query filters. Default in Mongodb 7
mongoose.set('strictQuery', false);

// use for mongodb Atalas
// mongoose.connect(`mongodb+srv://${env.DB_USER}:${env.DB_PASSWORD}@${env.DB_HOST}/${env.DB_NAME}?retryWrites=true&w=majority`);

// use for mongodb
mongoose.connect(env.DB_HOST, {
	authSource: 'admin',
	user: env.DB_USER,
	pass: env.DB_PASSWORD,
	dbName: env.DB_NAME
});

// Store Mongoose models representing each collection in the database
let collections: { [Key: string]: mongoose.Model<any> } = {};

// iterates over an array of schemas and creates a new Mongoose schema and model for each on
for (let schema of schemas) {
	const schema_object = new mongoose.Schema(
		{ ...fieldsToSchema(schema.fields), createdAt: Number, updatedAt: Number },
		{
			strict: schema.strict || false,
			timestamps: { currentTime: () => Date.now() }
		}
	);
	collections[schema.name] = mongoose.model(schema.name, schema_object);
}

// Express Server
import express from 'express';
import path from 'path';
const app = express();

app.use(multer().any());
app.use(cors());
app.use(cookieParser());
app.use(express.static('./build'));
app.get('/get_collections', async (req, res) => {
	console.log(schemas);

	res.send(schemas);
});

// Collection find by ID
app.get('/api/findById', async (req, res) => {
	let collection = collections[req.query.collection as string];
	res.send(await collection.findById(req.query.id as string));
});

app.get('/api/find', async (req, res) => {
	let collection = collections[req.query.collection as string];
	res.send(await collection.find(JSON.parse(req.query.query as string)));
});

// Sign In Route
app.post('/api/signin', async (req, res) => {
	console.log(req.cookies);
	let user = await auth
		.authenticateUser('email', req.body.email, req.body.password)
		.catch(() => null);
	if (!user) return res.send({ status: 404 });
	const session = await auth.createSession(user.userId);
	console.log(user);
	console.log(session);

	res.send({ user: user.username, session: session.sessionId, status: 200 });
});

// Sign Up Route
app.post('/api/signup', async (req, res) => {
	let user = await auth
		.createUser('email', req.body.email, {
			password: req.body.password,
			attributes: {
				username: 'Admin'
			}
		})
		.catch(() => null);
	console.log(user);
	if (!user) return res.send({ status: 404 });
	const session = await auth.createSession(user.userId);
	res.send({ user: user.username, session: session.sessionId, status: 200 });
});

// Validate User Session
app.post('/api/validateSession', async (req, res) => {
	// const resp = await auth.validateSessionUser(req.body.sessionId, () => {}).catch(() => null);
	const resp = await auth.validateSessionUser(req.body.sessionId).catch(() => null);
	if (!resp) return res.send({ status: 404 });
	res.send({ user: resp.user.username, session: resp.session?.sessionId, status: 200 });
});

// GET request that returns a list of entries from a specified collection, with optional pagination and filtering options.
app.get('/api/:endpoint', async (req, res) => {
	let page = parseInt(req.query.page as string) || 1;
	let collection = collections[req.params.endpoint];
	let length = parseInt(req.query.length as string) || Infinity;
	let skip = (page - 1) * length;
	res.send({
		entryList: await collection.find().skip(skip).limit(length),
		totalCount: await collection.countDocuments()
	});
});

// PATCH request that updates a single entry in a specified collection, using data from the request body.
app.patch('/api/:endpoint', async (req, res) => {
	let collection = collections[req.params.endpoint];
	let { _id, ...formData } = req.body;
	console.log(formData);
	formData = parse(formData);
	console.log(formData);
	let files = saveFiles(req);
	res.send(await collection.updateOne({ _id }, { ...formData, ...files }, { upsert: true }));
});

// DELETE request that removes one or more entries from a specified collection, using an array of IDs from the request body.
app.delete('/api/:endpoint', async (req, res) => {
	let collection = collections[req.params.endpoint];
	let { ids } = req.body;
	ids = JSON.parse(ids);
	console.log(ids);
	console.log(typeof ids);

	res.send(
		await collection.deleteMany({
			_id: {
				$in: ids
			}
		})
	);
});

// POST request that creates one or more new entries in a specified collection, using data from the request body.
// app.post('/api/:endpoint', async (req, res) => {
// 	for (let key in req.body) {
// 		try {
// 			req.body[key] = JSON.parse(req.body[key]);
// 		} catch (e) {}
// 	}
// 	console.log(req.body);
// 	let collection = collections[req.params.endpoint];
// 	if (!collection) return 'collection not found!!';
// 	let files = saveFiles(req);
// 	res.send(await collection.insertMany({ ...req.body, ...files }));
// });





// POST request that creates one or more new entries in a specified collection, using data from the request body.

app.post('/api/:endpoint', async (req, res) => {
	if(req.files && req.body.crop_left){
		const canvas = createCanvas(+req.body.width, +req.body.height);
		const ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, req.body.width, req.body.height);
		const _files = (req.files as Array<Express.Multer.File>) || [];
		for ( const file of _files ) {
			const {buffer, fieldname, ...meta} = file;
			const blur_areas: any = [];
			for (const el of JSON.parse(req.body.blur_areas)) {

				let top = Math.floor(Math.sin(+req.body.rotate * (Math.PI/180))*((req.body.width * req.body.rotateScale - req.body.width)/2) + Math.cos(+req.body.rotate * (Math.PI/180)) * ((req.body.height * req.body.rotateScale - req.body.height)/2) - +el.top)
				let left = Math.floor(Math.cos(+req.body.rotate * (Math.PI/180))*((req.body.width * req.body.rotateScale - req.body.width)/2) + Math.sin(+req.body.rotate * (Math.PI/180)) * ((req.body.height * req.body.rotateScale - req.body.height)/2) - +el.left)
				top = Math.abs(top);
				left = Math.abs(left);
				if(+req.body.rotate >= 270){
					left = Math.abs(req.body.width - left - el.width)
				}else if(+req.body.rotate >= 180){
					top = Math.abs(req.body.height - top - el.height)
					left = Math.abs(req.body.width - left - el.width)
				}else if( +req.body.rotate >= 90 ){
					top = Math.abs(req.body.height - top - el.height)
				}

				if(top + +el.height > +req.body.height){
					top -= top + +el.height - req.body.height
				}
				if(left + +el.width > +req.body.width){
					left -= left + +el.width - req.body.width
				}
				const blurArea = await sharp(buffer)
					.extract({left: left , top: top, width: +el.width, height: +el.height})
					.blur(10)
					.toBuffer();
				blur_areas.push({image: blurArea, left: left, top: top, width: +el.width, height: +el.height});
			}
			const mainImage = new Image();
			mainImage.onload = function () {
				ctx.drawImage(mainImage,0,0, +req.body.width, +req.body.height);
			}
			mainImage.src = buffer;
			for (const el of blur_areas) {
				const image = new Image();
				image.onload = function () {
					ctx.drawImage(image, +el.left, +el.top, +el.width, +el.height);
				}
				image.src = el.image;
			}
			await sharp(canvas.toBuffer())
				.extract({ left: +req.body.crop_left, top: +req.body.crop_top, width: req.body.width - req.body.crop_right - req.body.crop_left, height: req.body.height - req.body.crop_bottom - req.body.crop_top })
				.rotate(+req.body.rotate)
				.toFile('media/image_array/' + req.body.name + '.webp');
		}
		const collection = collections[req.params.endpoint];
		if (!collection) return "collection not found!!";
		res.send(await collection.insertMany({
			Name: req.body.name,
			'Multi Image Array': {
				originalname: req.body.name + '.webp',
				mimetype: 'image/webp'
			}}));
	}else {
		for (let key in req.body) {
			try {
				req.body[key] = JSON.parse(req.body[key]);
			} catch (e) {
			}
		}
		let collection = collections[req.params.endpoint];
		if (!collection) return 'collection not found!!';
		let files = saveFiles(req);
		res.send(await collection.insertMany({...req.body, ...files}));
	}
});
	

// routes for frontend
app.get("/",(req,res)=>{
	res.sendFile(path.join(__dirname, './build/index.html'));
})
app.get("/login",(req,res)=>{
	res.sendFile(path.join(__dirname, './build/login.html'));
})

// Listen for incoming requests on the port specified in the env.PORT environment variable.
app.listen(env.PORT, () => {
	console.log(`Example app listening on port ${env.PORT}`);
});
