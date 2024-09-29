import jwt from 'jsonwebtoken';
// import { userModel } from '../models/user.js';
import dotenv from 'dotenv'
dotenv.config();



export const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).send({ message: "No token provided!" });

    jwt.verify(token, process.env.JWT_SIGNATURE, (err, decoded) => {
        if (err) return res.status(401).send({ message: "Unauthorized!" });
        req.user = decoded; // Assuming decoded contains user info
        next();
    });
};

// const submitReview = async (productId, reviewData) => {
//     const token = localStorage.getItem('token');

//     try {
//         const response = await axios.post(`/api/products/${productId}/reviews`, reviewData, {
//             headers: {
//                 Authorization: token,
//             },
//         });
//         console.log(response.data);
//     } catch (error) {
//         console.error("Error submitting review:", error.response.data);
//     }
// };
