const { client } = require("../client")

async function createReview({ userId, itemId, description }) {
    try {
        const { rows: [review] } = await client.query(`
        INSERT INTO reviews("userId","itemId",description)
        VALUES($1,$2,$3)
        RETURNING *;`, [userId, itemId, description]);
        return review;
    } catch (error) {
        throw error;
    }
}

async function getReviewById(id) {
    try {
        const { rows: [review] } = await client.query(`
        SELECT * FROM reviews
        WHERE id=$1;`, [id]);
        return review;
    } catch (error) {
        throw error;
    }
}
async function getReviewsByItemId(itemId) {
    try {
        const { rows: [reviews] } = await client.query(`
        SELECT * FROM reviews
        WHERE "itemId"=$1;`, [itemId]);
    } catch (error) {
        throw error;
    }
}

async function getReviewByUserId(userId) {
    try {
        const { rows: [reviews] } = await client.query(`
        SELECT * FROM reviews
        WHERE "userId"=$1;`, [userId]);
        return reviews;
    } catch (error) {
        throw error;
    }
}

async function getAllReviews() {
    try {
        const { rows: [reviews] } = await client.query(`
        SELECT * FROM reviews
        RETURNING *;`);
        return reviews;
    } catch (error) {
        throw error;
    }
}

async function updateReview({ id, userId, description }) {
    try {
        let temp = await getReviewById(id);
        description = description ? description : temp.description;
        userId = userId ? userId : temp.userId;
        const { rows: [review] } = await client.query(`
        UPDATE reviews
        SET "userId"=$1 description=$2
        WHERE id=$3
        RETURNING *;`, [userId, description, id]);
        return review;
    } catch (error) {
        throw error;
    }
}

async function deleteReview(id) {
    try {
        const { rows: [review] } = await client.query(`
        DELETE FROM reviews
        WHERE id=$1
        RETURNING *;`, [id]);
        return review;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createReview,
    getReviewById,
    getReviewByUserId,
    getReviewsByItemId,
    getAllReviews,
    updateReview,
    deleteReview
}