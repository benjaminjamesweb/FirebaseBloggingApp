import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import { Box, Divider, Typography } from '@mui/material';
import BlogCard from '../components/BlogCard';
import Alert from '../components/Alert';
import { getAuth } from 'firebase/auth';

const ViewBlogsPage = () => {
    const [blogsList, setBlogsList] = useState([]);
    const [favoritesList, setFavoritesList] = useState([]); // Store user's favorite blog IDs
    const [alertConfig, setAlertConfig] = useState({});
    const userId = getAuth().currentUser?.uid;

    const blogCollectionReference = collection(db, "blogs");

    // Fetch all blogs from Firestore
    const getBlogsList = async () => {
        const blogs = await getDocs(blogCollectionReference);
        const extractedBlogs = blogs.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }));
        setBlogsList(extractedBlogs);
    };

    // Fetch the user's favorites list from Firestore
    const getFavoritesList = async () => {
        if (!userId) return; // Ensure the user is logged in
        const favoritesCollectionRef = collection(db, 'users', userId, 'favorites');
        const favoritesSnapshot = await getDocs(favoritesCollectionRef);
        const favoriteIds = favoritesSnapshot.docs.map(doc => doc.id);
        setFavoritesList(favoriteIds);
    };

    const deleteBlog = async (id) => {
        const blogDoc = doc(db, "blogs", id);
        try {
            await deleteDoc(blogDoc);
            setAlertConfig({
                message: 'Successfully deleted the blog',
                color: 'success',
                isOpen: true
            });
            setBlogsList((prevList) => prevList.filter((blog) => blog.id !== id));
        } catch (error) {
            setAlertConfig({
                message: 'Error deleting the blog',
                color: 'error',
                isOpen: true
            });
        }
    };

    useEffect(() => {
        getBlogsList();
        getFavoritesList();
    }, [userId]);

    return (
        <Box display="flex" flexDirection="column" gap="20px">
            <Typography variant="h3">View Blogs</Typography>
            <Divider />
            <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap="12px">
                {blogsList.map((blog) => (
                    <BlogCard 
                        key={blog.id} 
                        blog={blog} 
                        userId={userId} 
                        isFavorited={favoritesList.includes(blog.id)} // Set isFavorited based on favorites list
                        handleFavoriteClick={() => toggleFavorite(blog.id)} 
                        deleteBlog={() => deleteBlog(blog.id)} 
                        showDeleteIcon={true}
                    />
                ))}
            </Box>
            <Alert alertConfig={alertConfig} />
        </Box>
    );
};

export default ViewBlogsPage;
