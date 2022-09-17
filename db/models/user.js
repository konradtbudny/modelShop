const client = require('../client');
const bcrypt=require("bcrypt");

async function createUser({username, password,email, contactNumber, type}){
    try {
        const SALT_COUNT=10;
        const hashedPassword=await bcrypt.hash(password,SALT_COUNT);
        const {rows:[user]}=await client.query(`
        INSERT INTO users(username,password,email,contactNumber,type)
        VALUES($1,$2,$3,$4,$5)
        ON CONFLICT (username) DO NOTHING
        RETURNIING *;`,[username,hashedPassword,email,contactNumber,type]);
        delete user.hashedPassword;
        delete user.password;
        return user;
    } catch (error) {
        throw error;
    }
}
async function getUserByUsername(username){
    try {
        const {rows:[user]}=await client.query(`
        SELECT * FROM users WHERE username=$1;`,[username]);
        if(!user){
            return null;
        }
        return user;
    } catch (error) {
        throw error;
    }
}
async function getUserById(id){
    try {
        const {rows:[user]}=await client.query(`'
        SELECT * FROM users WHERE ID=$1`,[id]);
        delete user.hashedPassword;
        delete user.password;
        return user;
    } catch (error) {
        throw error;
    }
}
async function getUser({username,password}){
    try {
        let user =await getUserByUsername(username);
        const passwordMatch=await bcrypt.compare(password,user.password);
        if(passwordMatch){
            delete user.password;
            delete user.hashedPassword;
            return user;
        }
        else{
            return;
        }
    } catch (error) {
        throw error;
    }
}
async function getAllUsers() {
    try {
        const {rows:[user]}=await client.query(`
        SELECT * FROM users RETURNING *;
        `)
        return user;
    } catch (error) {
        throw error;
    }
}
async function deleteUser(username){
    try {
        const {rows:[user]}=await client.query(`
        DELETE FROM users WHERE username=$1`,[username]);
        return user;
    } catch (error) {
        throw error;
    }
}
module.exports = {
    createUser,
    getUserByUsername,
    getUserById,
    getUser,
    getAllUsers,
    deleteUser
};