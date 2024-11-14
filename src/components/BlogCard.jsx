import { Button, Card, CardActions, CardContent, CardMedia, Chip, IconButton, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const BlogCard = ({ blog, deleteBlog, showDeleteIcon = true, userId, isFavorited: initialFavorited }) => {
    const [isFavorited, setIsFavorited] = useState(initialFavorited || false);
    const navigate = useNavigate();

    useEffect(() => {
        setIsFavorited(initialFavorited || false);
    }, [initialFavorited]);

    const handleFavoriteClick = async () => {
        if (userId && blog.id) {
            setIsFavorited(!isFavorited);
            await toggleFavorite(blog.id, userId);
        } else {
            console.error("Missing userId or blog.id:", { userId, blogId: blog.id });
        }
    };

    const toggleFavorite = async (postId, userId) => {
        try {
            const favoriteRef = doc(db, 'users', userId, 'favorites', postId);
            if (isFavorited) {
                await deleteDoc(favoriteRef);
                console.log("Removed from favorites:", postId);
            } else {
                await setDoc(favoriteRef, { postId, favoritedAt: new Date() });
                console.log("Added to favorites:", postId);
            }
        } catch (error) {
            console.error("Error toggling favorite:", error);
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
                <IconButton onClick={handleFavoriteClick}>
                    <FavoriteIcon color={isFavorited ? 'error' : 'disabled'} />
                </IconButton>
                <Button color="secondary" variant="contained" onClick={() => navigate(`/viewblogs/${blog.id}`)}>
                    Learn More
                </Button>
            </CardActions>
        </Card>
    );
};

export default BlogCard;
