const mongoose = require('mongoose');

const profileSellerSchema = new mongoose.Schema({ 
  name: { type: String, required: true},
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
  orders: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Order'} ],
  books: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Book' } ],
  ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Rating' }],
  avgRating: Number,
  logo: { data: Buffer, contentType: String }
});

const getStoreModel = (req) =>
  req.app.locals.supportDB.model('Store', StoreSchema);

exports.getByCity = async (req, res) => {
  try {
    const Store = req.app.locals.supportDB.model('profileseller', profileSellerSchema);

    const stores = await Store.find({
      city: { $regex: new RegExp(req.params.city, 'i') }
    });

    if (stores.length === 0) {
      return res.status(404).json({ error: 'Vendedor no encontrado' });
    }

    res.json(stores);
  } catch(e){
    res.status(500).json({error: 'Error al obtener el vendedor', detalle: e.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const Store = req.app.locals.supportDB.model('profileseller', profileSellerSchema);
    const store = await Store.findOne({ id: req.params.id });
    if (!store) return res.status(404).json({ error: 'Vendedor no encontrado' });
    res.json(store);
  } catch (e) {
    res.status(500).json({ error: 'Error al obtener el Vendedor', detalle: e.message });
  }
};

exports.getLogo = async (req, res) => {
  try {
    const Store = req.app.locals.supportDB.model('profileseller', profileSellerSchema);
    const store = await Store.findOne({ id: req.params.id });

    const store = await Store.findById(req.params.id);

    if (!store || !store.logo) {
      return res.status(404).send('Logo no encontrado');
    }

    res.contentType(store.logo.contentType);
    res.send(store.logo.data);

  } catch (e) {
    res.status(500).json({ error: 'Error al obtener logo', detalle: e.message });
  }
};

exports.update = async (req, res) => {
  try {
    const Store = req.app.locals.supportDB.model('profileseller', profileSellerSchema);
    const store = await Store.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!store) {
      return res.status(404).json({ error: 'Tienda no encontrada' });
    }

    res.json(store);

  } catch (e) {
    res.status(400).json({ error: 'Error al actualizar', detalle: e.message });
  }
};

exports.addRating = async (req, res) => {
  try {
    const Store = req.app.locals.supportDB.model('profileseller', profileSellerSchema);
    const store = await Store.findOneAndUpdate(
      { id: req.params.id },
      { $push: { ratings: req.body.ratingId } },
      { new: true }
    );

    if (!store) {
      return res.status(404).json({ error: 'Tienda no encontrada' });
    }

    res.json(store);

  } catch (e) {
    res.status(400).json({ error: 'Error al agregar rating', detalle: e.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const Store = req.app.locals.supportDB.model('profileseller', profileSellerSchema);
    const removedStore = await Store.findByIdAndDelete({id: req.params.id});
    if (!removedStore){
      return res.status(404).json({ error: 'Tienda no encontrada' });
    }

    res.status(204).end();

  } catch (e) {
    res.status(500).json({ error: 'Error al eliminar la tienda', detalle: e.message });
  }
};