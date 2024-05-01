// Підключаємо роутер до бек-енду
const express = require('express')
const router = express.Router()
const { Post } = require('../class/post')

// Підключіть файли роутів
// const test = require('./test')
// Підключіть інші файли роутів, якщо є
// Об'єднайте файли роутів за потреби
// Використовуйте інші файли роутів, якщо є

router.post('/post-create', (req, res) => {
    try {
        const { username, text, postId } = req.body;

        if (!username || !text) {
            return res.status(400).json({
                message: 'You should share the all data to post'
            })
        }

        let post = null
        console.log(postId, 'postId')

        if (postId) {
            post = Post.getById(Number(postId))
            console.log('post', post)

            if (!post) {
                return res.status(400).json({
                    message: 'Post with this ID is unvaible!'
                })
            }
        }

        const newPost = Post.create(username, text, post)

        return res.status(200).json({
            post: {
                id: newPost.id,
                text: newPost.text,
                username: newPost.username,
                date: newPost.date,
            }
        }) 
    } catch (e) {
        return res.status(400).json({
            message: e.message,
        })
  }
})

router.get('/post-list', function (req, res) {
    try {
        const list = Post.getList()
        if (list.length === 0) {
            return res.status(200).json({
                list: [],
            })
        }
        return res.status(200).json({
            list: list.map(({ id, username, text, date }) => ({
                id,
                username,
                text,
                date,
            }))
        })
    } catch (err) {
        return res.status(400).json({
            message: err.message,
        })
    }
})

router.get('/post-item', function (req, res) {
    try {
        const { id } = req.query
        
        if (!id) {
            return res.status(400).json({
                message: 'Please insert Id'
            })
        }
        const post = Post.getById(Number(id))

        if (!post) {
            return res.status(400).json({
                message: 'Post with this id unvaible'
            })
        }
        return res.status(200).json({
            post: {
                id: post.id,
                text: post.text,
                username: post.username,
                date: post.date,

                reply: post.reply.map((reply) => ({
                    id: reply.id,
                    text: reply.text,
                    username: reply.username,
                    date: reply.date,
                }))
            }
        })
    } catch (err) {
        return res.status(400).json({
            message: err.message,
        })
    }
})

// Експортуємо глобальний роутер
module.exports = router
