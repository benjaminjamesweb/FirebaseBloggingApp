import { Button, Card, CardActions, CardContent, CardMedia, Chip, IconButton, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const BlogCard = ({ blog, deleteBlog, showDeleteIcon = true, userId, isLiked: initiallyLiked }) => {

// Note to Prabh: the purpose of the initiallyLiked variable is so that posts a user has previously liked (in a previous session) will reappear as liked when they log back in.
    const [isLiked, setIsLiked] = useState(initiallyLiked || false);
    const navigate = useNavigate();

    // Previously-liked posts display as liked (red color) upon login
    useEffect(() => {
        setIsLiked(initiallyLiked || false);
    }, [initiallyLiked]);


    const handleLike = async () => {
        if (userId && blog.id) {
            setIsLiked(!isLiked);
            await manageLikesCollection(blog.id, userId);
        } else {
            console.error("Could not find user or blog ID. Try logging in again.");
        }
    };


// Note to Prabh: in order for the liked posts to stay liked after logging out and logging back in again, I had to create an extra collection (users/likes) to store users' liked posts
    const manageLikesCollection = async (postId, userId) => {
        try {
            const likeRef = doc(db, 'users', userId, 'likes', postId);
            if (isLiked) {
                await deleteDoc(likeRef);
                console.log("Blog has been removed from likes", postId);
            } else {
                await setDoc(likeRef, { postId, LikedAt: new Date() });
                console.log("Blog has been added to likes", postId);
            }
        } catch (error) {
            console.error("Error liking/unliking this blog, please refresh", error);
        }
    };

    return (
        <Card style={{ position: 'relative' }}>
            <CardMedia
                sx={{ height: 140 }}
                image={blog.image}
                title={blog.title}
            />
            {showDeleteIcon && (
                <IconButton
                    style={{ position: 'absolute', right: '10px', top: '5px' }}
                    aria-label="delete"
                    size="small"
                    onClick={() => deleteBlog(blog.id)}
                >
                    <DeleteIcon fontSize="inherit" />
                </IconButton>
            )}
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {blog.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {blog.description}
                </Typography>
                <Chip label={blog.category} variant="outlined" />
            </CardContent>
            <CardActions>
                <IconButton onClick={handleLike}>
                    <FavoriteIcon color={isLiked ? 'error' : 'disabled'} />
                </IconButton>
                <Button color="secondary" variant="contained" onClick={() => navigate(`/viewblogs/${blog.id}`)}>
                    Learn More
                </Button>
            </CardActions>
        </Card>
    );
};

export default BlogCard;
