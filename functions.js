const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = "https://qjejqdtpmnvfwzheotca.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqZWpxZHRwbW52Znd6aGVvdGNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQzODA3MjQsImV4cCI6MjAyOTk1NjcyNH0.WNBB-QUQ9AXcqKb9M9rkOhujzNpM4uIRLgr4tpNyneY";
const SECRET_KEY = 'ulwN/1jeJErVnKllWpEu9OE2Cqtt5VkH9iHT9SE1ZSCIQGFN2p/mbU3wDBa/s0De1lKGDKf4Ti1jK/WDD3mHIA==';
const jwt = require('jsonwebtoken');
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function register(email, password) {
    const { user, error } = await supabase.auth.signUp({
        email,
        password,
    });
    return { user, error };
}

async function login(email, password) {
    await supabase.auth.signInWithPassword({
        email,
        password,
    });
    const token = await supabase.auth.getSession();
    return { token };
}

async function placeOrder(accessToken, productIds) {
    try {
        const decoded = jwt.verify(accessToken, SECRET_KEY);
        const userId = decoded.sub;
        const { data, error } = await supabase
            .from('orders')
            .insert({
                user_id: userId, product_ids: productIds
            });
        return { data, error };
    } catch (err) {
        return { data: null, error: 'Invalid access token' };
    }
}

async function getUserOrders(accessToken) {
    try {
        const decoded = jwt.verify(accessToken, SECRET_KEY);
        const userId = decoded.sub;
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('user_id', userId);
        return { data, error };
    } catch (err) {
        console.log(err)
        return { data: null, error: 'Invalid access token' };
    }
}

async function addProduct(name, description, price, stock, category) {
    console.log("WHATT")
    const { data, error } = await supabase
        .from('products')
        .insert([{ name, description, price, stock, category }]);
    return { data, error };
}

async function getProducts(filter = {}) {
    try {
        let query = supabase.from('products').select('*');
        console.log(filter)
        if (filter.name) {
            query = query.like('name', `%${filter.name}%`);
        }
        const { data, error } = await query;
        return { data, error };
    } catch (error) {
        return { data: null, error: error.message };
    }
}

module.exports = { register, login, placeOrder, getUserOrders, addProduct, getProducts };