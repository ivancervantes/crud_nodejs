const { Router } = require('express');

const path = require('path');
const { unlink } = require('fs-extra');
const router = Router();

// Models
const Image = require('../models/Image');

router.get('/', async (req, res) => {
    const images = await Image.find();
    res.render('index', { images });
});

router.get('/upload', (req, res) => {
    res.render('upload');
});

router.post('/upload', async (req, res) => {
    const image = new Image();
    image.nombre = req.body.nombre;
    image.apellido = req.body.apellido;
    image.sexo = req.body.sexo;
    image.filename = req.file.filename;
    image.path = '/img/uploads/' + req.file.filename;
    image.originalname = req.file.originalname;
    image.mimetype = req.file.mimetype;
    image.size = req.file.size;

    await image.save();
    res.redirect('/');
});

  
  router.post('/edit/:id', async (req, res, next) => {
    
    const { id } = req.params;
    
    const imageDeleted = await Image.findById(id);
    await unlink(path.resolve('../src/public/img/uploads/' + imageDeleted.filename));
    
    await Image.update({_id: id}, req.body);
    await Image.update({_id: id}, req.file);
    res.redirect('/');
  });
router.get('/image/:id', async (req, res) => {
    const { id } = req.params;
    const image = await Image.findById(id);
    res.render('profile', { image });
});
router.get('/images/:id', async (req, res) => {
    const { id } = req.params;
    const image = await Image.findById(id);
    res.render('edit', { image });
});
router.get('/image/:id/delete', async (req, res) => {
    const { id } = req.params;
    const imageDeleted = await Image.findByIdAndDelete(id);
    await unlink(path.resolve('../src/public/img/uploads/' + imageDeleted.filename));
    res.redirect('/');
});

module.exports = router;