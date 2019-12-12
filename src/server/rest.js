// Imports
import express from 'express';
import bodyParser from 'body-parser';

// Router Setup
const router = express({
	caseSensitive: false
});

// Add Middlewares
// parse request body as json
router.use(bodyParser.json());
// parse application/x-www-form-urleconded
router.use(bodyParser.urlencoded({ extended: true }));

// Add Routes
// `/api/`
router.get('/', (req, res) => {
	res.send(200);
});

// Export
const endpoint = '/api';
export { router, endpoint };
