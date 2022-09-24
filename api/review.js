const express = require("express");
const { emptyQuery } = require("pg-protocol/dist/messages");
const reviewRouter = express.Router();
const { createReview, getReviewById, getReviewsByItemId, getAllReviews, deleteReview } = require("../db");
const { requireUser } = require("./utils");

reviewRouter.post("/createReview", requireUser, async (req, res, next) => {
    const { itemId, description } = req.body;
    let reviewData = {};
    try {
        reviewData.userId = req.user.id;
        reviewData.itemId = itemId;
        reviewData.description = description;
        const review = await createReview(reviewData);
        if (review) {
            res.send({ review });
        } else {
            next({ name: "CreateReviewError", message: "Review not created. Check if you are logged in and you put description" });
        }
    } catch ({ name, error }) {
        next(name, error);
    }
});

reviewRouter.get("/", async (req, res, next) => {
    try {
        const allReviews = await getAllReviews();
        if (!allReviews) {
            next({ name: "RetrivingAllReviewsError", message: "Cannot retrieve any reviews at the moment" });
        }
        const reviews = allReviews.filter((review) => { return ((req.user && review.userId === req.userId)) });
        if (reviews) {
            res.send(reviews);
        } else {
            next({ name: "NoReviewsError", message: "There is no review with specific info." });
        }

    } catch ({ name, message }) {
        next({ name, message })
    }
});

reviewRouter.get("/:itemId", async (req, res, next) => {
    let itemId = req.params.itemId;
    try {
        const itemReviews = await getReviewsByItemId(itemId);
        if (itemReviews) {
            res.send(itemReviews);
        } else {
            next({ name: "GettingReviewsByItemIdError", message: "Error with getting reviews for the given item. Check if item exists." });
        }
    } catch ({ name, message }) {
        next({ name, message });
    }
});

reviewRouter.delete("/:reviewId/delete", requireUser, async (req, res, next) => {
    try {
        const review = await getReviewById(req.params.reviewId);
        if (review && review.id === req.user.id) {
            const deletedReview = await deleteReview(review.id);
            res.send({ review: deletedReview });
        } else {
            next(review ? { name: "UnauthorizedUserError", message: "You cannot delete a review which is not yours" } : { name: "ReviewNotFoundError", message: "That review does not exist" });
        }
    } catch ({ name, message }) {
        next({ name, message });
    }
});

module.exports = reviewRouter;
