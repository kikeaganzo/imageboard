//Connect with postgress

var spicedPg = require('spiced-pg');
var db = spicedPg(
  process.env.DATABASE_URL ||
    'postgres:postgres:postgres@localhost:5432/wintergreen-imageboard',
);

module.exports.getImages = function getImages() {
  return db.query(`SELECT * from images ORDER BY id DESC`);
};


module.exports.insertDb = function insertDb(url, username, title, description) {
    return db.query("INSERT INTO images (url, username, title, description) VALUES ($1, $2, $3, $4) RETURNING * ",
    [url, username, title, description]);
};

module.exports.getImageID = function getImageID(id) {
    return db.query(
        `SELECT * FROM images WHERE id = $1`, [id]);
};


module.exports.addComment = function addComment(comment, username, image_id) {
    return db.query("INSERT INTO comments (comment, username, image_id) VALUES ($1, $2, $3) RETURNING * ",
    [comment, username, image_id]);
};

module.exports.showComments = function showComments(image_id) {
    return db.query(
        `SELECT comment FROM comments WHERE image_id = $1`, [image_id]);
};
