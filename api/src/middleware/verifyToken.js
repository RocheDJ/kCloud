//middleware/verifyToken

const jwt = require('jsonwebtoken');
require("dotenv").config();
function verifyToken(req, res, next) {
const tokenRaw = req.header('Authorization');
//const tokenRaw = req.headers.authorization.replace('Bearer ', '');
if (!tokenRaw) return res.status(401).json({ error: 'Access denied' });
const token = tokenRaw.replace('Bearer ', '');
if (!token) return res.status(401).json({ error: 'Access denied' });
try {
 const decoded = jwt.verify(token, process.env.JWT_SECRET);
 req.userId = decoded.id;
 next();
 } catch (error) {
 res.status(401).json({ error: 'Invalid token' });
 }
 };

module.exports = verifyToken;