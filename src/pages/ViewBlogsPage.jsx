import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import { Box, Divider, Typography } from '@mui/material';
import BlogCard from '../components/BlogCard';
import Alert from '../components/Alert';
import { getAuth } from 'firebase/auth';

const ViewBlogsPage = () => {
    const [blogsList, setBlogsList] = useState([]);
    const [likesList, setLikesList] = useState([]); 
    const [alertConfig, setAlertConfig] = useState({});
    const userId = getAuth().currentUser?.uid;

    const blogCollectionReference = collection(db, "blogs");

    const getBlogsList = async () => {
        const blogs = await getDocs(blogCollectionReference);
        const extractedBlogs = blogs.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }));
        setBlogsList(extractedBlogs);
    };

// Note to Prabh: the getFavoritesList function fetches a user's previously-liked posts from a "users/likes" collection in Firestore. I used ChatGPT to help me write the complicated logic.
    const getLikesList = async () => {
        if (!userId) return;
        const likesCollectionRef = collection(db, 'users', userId, 'likes');
        const likesSnapshot = await getDocs(likesCollectionRef);
        const likesIds = likesSnapshot.docs.map(doc => doc.id);
        setLikesList(likesIds);
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
        getLikesList();
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
                        isLiked={likesList.includes(blog.id)}
                        handleLike={() => manageLikes(blog.id)} 
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
