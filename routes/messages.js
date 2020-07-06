require("dotenv").config();

const express = require("express");
const secured = require("../lib/middleware/secured");
const router = express.Router();

const book = require("../models/book");
const BookModel = new book();

const user = require("../models/user");
const UserModel = new user();

const message = require("../models/message");
const MessageModel = new message();

router.get("/messages", secured(), async function (req, res) {
    console.log("Message page loaded");
    const { _raw, _json, ...userProfile } = req.user;
    // let userID = (await UserModel.getUserByID(userProfile.user_id))[0].id;
    let messages = await MessageModel.getMessages(userProfile.user_id);
    messages = await Promise.all(
        messages.map(async function (message) {
            let sender = await UserModel.getUsernameByDBID(message.sender_id);
            let book = await BookModel.getBookFromDBID(message.book_requested_id);
            return {
                sender: sender,
                senderID: message.sender_id,
                bookTitle: book.title,
                message: message.message_text,
            };
        })
    );
    console.log(messages);
    res.render("messages", {
        title: "Your Messages",
        messages: messages,
    });
});

router.get("/messagechain/:sender_id", secured(), async function (req, res) {
    const { _raw, _json, ...userProfile } = req.user;
    //return all messages
    //show in order of time created (need to add that column to the table)
    //have a text box that can add a message to the chain at the bottom,
    //then the page is reloaded
    console.log("Message chain loaded");
    let messages = await MessageModel.getMessageChain(userProfile.user_id, req.params.sender_id);
    console.log("messages", messages);
    const bookInformation = (await BookModel.getBookAndUser(messages[0].book_requested_id))[0]
    const bookRequestedID = messages[0].book_requested_id
    messages = await Promise.all(
        messages.map(async function (message) {
            let sender = await UserModel.getUsernameByDBID(message.sender_id);
            let book = await BookModel.getBookFromDBID(message.book_requested_id);
            return {
                sender: sender,
                senderID: message.sender_id,
                bookTitle: book.title,
                message: message.message_text,
            };
        })
    );
    
    res.render("messagechain", {
        title: `Your messages with ${messages[0].sender} regarding ${messages[0].bookTitle}`,
        messages: messages,
        bookTitle: messages[0].bookTitle,
        meetupLocation: bookInformation.location,
        recipient: bookInformation.possession_id,
        bookID: bookRequestedID,
        bookCover: bookInformation.book_cover
    });
});

module.exports = router;