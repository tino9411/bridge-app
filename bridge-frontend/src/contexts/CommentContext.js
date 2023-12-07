// contexts/CommentContext.js
import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import useSnackbar from '../hooks/useSnackbar'; // Assuming you have a snackbar hook for notifications
import { useAuth } from '../hooks/useAuth'; // Assuming you have an auth hook for authentication

const CommentContext = createContext();

export const useComments = () => useContext(CommentContext);

export const CommentProvider = ({ children }) => {

  const { user, token } = useAuth(); // Assuming you have an auth hook for authentication
  const [comments, setComments] = useState([]);
  const [commentCount, setCommentCount] = useState()
  const [loading, setLoading] = useState(false);
  const { snackbarOpen, snackbarMessage, snackbarSeverity, showSnackbar, handleSnackbarClose } = useSnackbar(); // Use the useSnackbar hook

  // Define your comment-related functions here (create, read, update, delete)

  const fetchComments = async (taskId) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/tasks/${taskId}/comments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching comments', error);
      showSnackbar('Error fetching comments', 'error');
      setLoading(false);
    }
  };

  const getComment = async (taskId, commentId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/tasks/${taskId}/comments/${commentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data) {
        // You can choose to do something with the comment, such as setting it in the state.
        setComments([...comments, response.data]);
        showSnackbar('Comment retrieved successfully', 'success');
      } else {
        throw new Error('Failed to retrieve comment');
      }
    } catch (error) {
      console.error('Error retrieving comment', error);
      showSnackbar('Error retrieving comment', 'error');
    }
  };
  

  const addComment = async (taskId, commentData) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/tasks/${taskId}/comments`, 
        commentData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments([...comments, response.data]);
      showSnackbar('Comment added successfully', 'success');
    } catch (error) {
      console.error('Error adding comment', error);
      showSnackbar('Error adding comment', 'error');
    }
  };

  const updateComment = async (taskId, commentId, updatedContent) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/tasks/${taskId}/comments/${commentId}`,
        { content: updatedContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data) {
        // Update the comment in the local state
        setComments(
          comments.map(comment =>
            comment._id === commentId ? { ...comment, content: updatedContent } : comment
          )
        );
        showSnackbar('Comment updated successfully', 'success');
      } else {
        throw new Error('Failed to update comment');
      }
    } catch (error) {
      console.error('Error updating comment', error);
      showSnackbar('Error updating comment', 'error');
    }
  };

  // Add this function inside your CommentContext

  const deleteComment = async (taskId, commentId) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/tasks/${taskId}/comments/${commentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data) {
        // Update the comment's content to '[deleted]' in the local state
        setComments(comments.map(comment =>
          comment._id === commentId ? { ...comment, content: '[deleted]' } : comment
        ));
        showSnackbar('Comment deleted successfully', 'success');
      } else {
        throw new Error('Failed to delete comment');
      }
    } catch (error) {
      console.error('Error deleting comment', error);
      showSnackbar('Error deleting comment', 'error');
    }
  };

  const addReplyToComment = async (taskId, commentId, replyData) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/tasks/${taskId}/comments/${commentId}/replies`,
        replyData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (response.data) {
        // Update the comments state to include the new reply
        // Assuming each comment in the state has an 'replies' array to hold its replies
        setComments(comments.map(comment => {
          if (comment._id === commentId) {
            return {
              ...comment,
              replies: [...comment.replies, response.data] // Add the new reply to the existing replies
            };
          }
          return comment;
        }));
  
        showSnackbar('Reply added successfully', 'success');
      } else {
        throw new Error('Failed to add reply');
      }
    } catch (error) {
      console.error('Error adding reply', error);
      showSnackbar('Error adding reply', 'error');
    }
  };
  
  const getCommentCount = async (taskId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/tasks/${taskId}/comment-count`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (response.data) {
        // Assuming response.data contains the count, e.g., { count: 10 }
        const commentCount = response.data.count;
  
        // You can either update a state here or return this count for a component to handle
        // For example, if you have a state for commentCount:
        setCommentCount(commentCount);
  
        // Or simply return the count for a component to handle it:
      } else {
        throw new Error('Failed to get comment count');
      }
    } catch (error) {
      console.error('Error getting comment count', error);
      showSnackbar('Error getting comment count', 'error');
      return null; // Return null or appropriate value to indicate failure
    }
  };
  
  
  


  return (
    <CommentContext.Provider 
    value={{ 

        user,
        token,
        comments, 
        fetchComments, 
        addComment,
        updateComment,
        deleteComment,
        getComment,
        addReplyToComment,
        getCommentCount,
        /* other functions */
        snackbarOpen,
        snackbarMessage,
        snackbarSeverity,
        handleSnackbarClose,
        loading,
        commentCount
         }}>
      {children}
    </CommentContext.Provider>
  );
};
