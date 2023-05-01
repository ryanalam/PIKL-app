import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import './ClientFeedback.css';

const ClientFeedback = () => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [message, setMessage] = useState('');

    const handleRatingChange = (newRating) => {
        setRating(newRating);
    };

    const handleMessageChange = (e) => {
        setMessage(e.target.value);
    };

    const handleSubmit = () => {
        // Submit the rating and message
        // Submit the rating and message
        console.log(`Rating: ${rating}`);
        console.log(`Message: ${message}`);

        // Reset the inputs
        setRating(0);
        setMessage('');

        // Display feedback message
        alert('Feedback Received');
    };

    return (
        <div className='container-sm'>
            <h2>Please rate your experience</h2>
            <div className="star-rating">
                {[...Array(5)].map((_, index) => (
                    <label key={index}>
                        <input
                            type="radio"
                            name="rating"
                            value={index + 1}
                            onChange={() => handleRatingChange(index + 1)}
                            className="hidden"
                        />
                        <FaStar
                            className="star"
                            color={index + 1 <= (hover || rating) ? '#ffc107' : '#e4e5e9'}
                            size={50}
                            onMouseEnter={() => setHover(index + 1)}
                            onMouseLeave={() => setHover(0)}
                        />
                    </label>
                ))}
            </div>
            <div className='container-sm'>
                <br />
                <div class="form-floating">
                    <center><textarea className="form-control commentbox" onChange={handleMessageChange} value={message} placeholder="Leave a comment here" id="floatingTextarea"></textarea>
                    </center>
                </div>

            </div>
            <br />
            <button className='btn btn-primary' onClick={handleSubmit}>Submit</button>
        </div>
    );
};

export default ClientFeedback;
