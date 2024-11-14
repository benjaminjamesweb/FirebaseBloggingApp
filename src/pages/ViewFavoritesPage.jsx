import { collection, deleteDoc, doc, getDocs, getDoc, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import { Box, Typography } from '@mui/material';
import BlogCard from '../components/BlogCard';
import { getAuth } from 'firebase/auth';

const ViewFavoritesPage = () => {
    const [favoritesList, setFavoritesList] = useState([]);
    const userId = localStorage.getItem("userId") || getAuth().currentUser?.uid;

    const getFavoritesList = async () => {
        if (!userId) {
            console.error("User ID is missing. Unable to fetch favorites.");
            return;
        }

        try {
            const favoritesCollectionRef = collection(db, 'users', userId, 'favorites');
            const favoritesSnapshot = await getDocs(favoritesCollectionRef);
            const extractedFavorites = favoritesSnapshot.docs.map((doc) => ({
                id: doc.id,
                postId: doc.data().postId,
            }));

            const blogPromises = extractedFavorites.map(async (favorite) => {
                const blogDoc = await getDoc(doc(db, 'blogs', favorite.postId));
                return { id: favorite.postId, ...blogDoc.data(), isFavorited: true };
            });

            const blogData = await Promise.all(blogPromises);
            setFavoritesList(blogData);
        } catch (error) {
            console.error("Error fetching favorites:", error);
        }
    };

    const toggleFavorite = async (postId) => {
        if (!userId) {
            console.error("User ID is missing. Unable to toggle favorite.");
            return;
        }

        const isCurrentlyFavorited = favoritesList.some(fav => fav.id === postId);
        const favoriteRef = doc(db, 'users', userId, 'favorites', postId);

        try {
            if (isCurrentlyFavorited) {
                await deleteDoc(favoriteRef);
                setFavoritesList(prevList => prevList.filter(blog => blog.id !== postId));
                console.log("Removed from favorites:", postId);
            } else {
                await setDoc(favoriteRef, { postId, favoritedAt: new Date() });
                setFavoritesList(prevList => [...prevList, { id: postId, isFavorited: true }]);
                console.log("Added to favorites:", postId);
            }
        } catch (error) {
            console.error("Error toggling favorite:", error);
        }
    };

    useEffect(() => {
        getFavoritesList();
    }, [userId]);

    if (!userId) {
        return <Typography variant="body1">Please log in to view your favorites.</Typography>;
    }

    return (
        <Box>
            <Typography variant="h4">Your Favorites</Typography>
            <Box display="flex" flexDirection="column" gap="20px" mt={2}>
                {favoritesList.length > 0 ? (
                    favoritesList.map((blog) => (
                        <BlogCard 
                            key={blog.id} 
                            blog={blog} 
                            userId={userId} 
                            isFavorited={blog.isFavorited} 
                            handleFavoriteClick={() => toggleFavorite(blog.id)} 
                            deleteBlog={() => toggleFavorite(blog.id)} 
                            showDeleteIcon={true}
                        />
                    ))
                ) : (
                    <Typography variant="body1">You have no favorites yet.</Typography>
                )}
            </Box>
        </Box>
    );
};

export default ViewFavoritesPage;
