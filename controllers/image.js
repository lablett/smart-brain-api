const Clarifai = require('clarifai');

const app = new Clarifai.App({
    apiKey: process.env.API_CLARIFAI  });

const handleAPICall = (req, resp) => {
    app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => resp.json(data))
    .catch(err => resp.status(400).json('Error connecting to API'))
}
  
const handleImage = (req, resp, db) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => resp.json(entries[0]))
    .catch(err => resp.status(400).json('Error updating entry count'))
};

module.exports = {
    handleImage,
    handleAPICall
};