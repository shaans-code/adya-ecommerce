const express = require('express');
const app = express();
app.use(express.json());
const { register, login, placeOrder, getUserOrders, addProduct, getProducts } = require('./functions');

app.post('/register', async (req, res) => {
    const { email, password } = req.body;
    const { user, error } = await register(email, password);
    if (error) return res.status(400).send(error.message);
    res.send(user);
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const { user, token, error } = await login(email, password);
    if (error) return res.status(400).send(error.message);
    res.send({ user, token });
});

app.get('/products', async (req, res) => {
    const { name } = req.query;
    const filter = {};

    if (name) {
        filter.name = name;
    }
    const { data, error } = await getProducts(filter);
    if (error) return res.status(400).send(error.message);
    res.send(data);
});

app.post('/products', async (req, res) => {
    const { name, description, price, stock, category } = req.body;
    const { data, error } = await addProduct(name, description, price, stock, category);
    if (error) return res.status(400).send(error.message);
    res.send(data);
});

app.post('/place-order', async (req, res) => {
    const { accessToken, productIds } = req.body;
    const { data, error } = await placeOrder(accessToken, productIds);
    if (error) return res.status(400).send(error);
    res.send(data);
});

app.get('/user-orders', async (req, res) => {
    const { accessToken } = req.query;
    const { data, error } = await getUserOrders(accessToken);
    if (error) return res.status(400).send(error);
    res.send(data);
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
