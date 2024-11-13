/* eslint-disable react/prop-types */
import { Button, Card, CardActions, CardContent, CardMedia, Chip, IconButton, Typography } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import DeleteIcon from '@mui/icons-material/Delete';

const BlogCard = (props) => {
    const { blog, deleteBlog = () => {}, showDeleteIcon = true } = props;
    // Favorites Table as well in the database

    const navigate = useNavigate();

    return (
        <Card style={{ position: 'relative' }}>
            <CardMedia
                sx={{ height: 140 }}
                image={blog.image}
                title="green iguana"
            />
            {
                showDeleteIcon && <IconButton style={{ position: 'absolute', right: '10px', top: '5px' }} aria-label="delete" size="small" onClick={() => deleteBlog(blog.id)}>
                <DeleteIcon fontSize="inherit" />
            </IconButton>
            }
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
                <Button color='success' variant='contained'>Favorite</Button>
                <Button color='secondary' variant='contained' onClick={() => navigate(`/viewblogs/${blog.id}`)}>Learn More</Button>
            </CardActions>
        </Card>
    )
}

export default BlogCard