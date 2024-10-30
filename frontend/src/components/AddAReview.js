import React, { useState } from 'react'; // This keeps track of which frame/step the user is on
import './AddAReview.css'; // import the CSS file
import OfficialLogo from '../Assets/official logo.svg';
import SubmitLandlordRate from '../Assets/submit landlord rate.svg';
import SideMenu from './SideMenu'; // Import the SideMenu component
import AccountButton from '../Assets/Account button.svg';

import AddRatingTitle from '../Assets/add-rating-title.svg';
import Face1 from '../Assets/face-1.svg';
import Face2 from '../Assets/face-2.svg';
import Face3 from '../Assets/face-3.svg';
import Face4 from '../Assets/face-4.svg';
import Face5 from '../Assets/face-5.svg';

// Creating the AddAReview functional component
const AddAReview = () => {

    // To keep track of the steps
    const [currentStep, setCurrentStep] = useState(1); // User will always start at the first frame

    // Handle form submission 
    const handleSubmit = () => {
        console.log('Submitting review...');
    };

    // Keep track of the selected rating (1-5)
    const [selectedRating, setSelectedRating] = useState(0); // Zero means no rating selected

    return (
        <div className="main-container">

            {/* Rendering the side menu component at the top left page */}
            <SideMenu />

            {/* Header section */}
            <header className="headerhp">
                {/* Container for logo */}
                <div className="logohp-container">
                    <img
                        src={OfficialLogo} // Path to the logo image
                        alt="Official Logo" // Alternative text for accessibility
                        className="center-logo" // CSS class for styling the logo
                    />
                </div>

                {/* Container for the action buttons in the header */}
                <div className="buttons-container">
                    {/* Left Image: Submit Landlord Rate */}
                    <img
                        src={SubmitLandlordRate} // Path to 'submit landlord' image
                        alt="Submit Landlord Rate" // Alt text for accessibility
                        className="left-icon" // CSS class 
                    />

                    {/* Right Image: Account Button */}
                    <a href="/account">
                        <img
                            src={AccountButton} // Path to image
                            alt="Account Button"
                            className="account-right"
                        />
                    </a>
                </div>
            </header>

            {/* Conditionally rendering different sections based on current step */}
            {/* If currentStep is 1, render the content for Step 1 */}
            {currentStep === 1 && (
                <div className="form-container">  {/* Gray box container */}
                    {/* Title Image for Step 1 */}
                    <img
                        src={AddRatingTitle}
                        alt="Add Rating Title"
                        className="add-rating-title"
                    />
                    <div className="you-are-rating"> 
                        <h2>
                            You are Rating:
                        </h2>
                    </div> {/**End of you-are-rating */}

                    <div className="you-are-rating-landlord-name"> 
                        <h2>
                            Francisco Diaz
                        </h2>
                    </div> {/**End */}

                    {/* Write a Review Box */}
                    <div className="review-box">
                        <h3>Write a Review</h3>
                        <textarea placeholder="What do you want other tenants to know about this landlord?" />
                        <div className="guidelines">
                            <h4>Guidelines</h4>
                            <ul>
                                <li>No use of profanity or derogatory terms</li>
                                <li>Be honest and specific</li>
                                <li>Stay professional and respectful</li>
                                <li>Protect your privacy</li>
                            </ul>
                        </div>
                    </div>

                    {/* Select property */}
                    <div className="select-property">
                        <label htmlFor="property">Select Property:</label>
                        <select id="property">
                            <option> Fairview Apartment</option>
                            {/* Add more property options later */}
                        </select>
                    </div>

                    {/* Rate Your Landlord */}
                    <div className="rate-landlord">
                        <label>Rate your landlord:</label>
                        <div className="rating-icons">
                            <img
                                src={Face1}
                                alt="Angry Face"
                                className={`rating-icon ${selectedRating >= 1 ? 'active red' : ''}`}
                                onClick={() => setSelectedRating(1)}
                            />
                            <img
                                src={Face2}
                                alt="Sad Face"
                                className={`rating-icon ${selectedRating >= 2 ? 'active orange' : ''}`}
                                onClick={() => setSelectedRating(2)}
                            />
                            <img
                                src={Face3}
                                alt="Neutral Face"
                                className={`rating-icon ${selectedRating >= 3 ? 'active yellow' : ''}`}
                                onClick={() => setSelectedRating(3)}
                            />
                            <img
                                src={Face4}
                                alt="Happy Face"
                                className={`rating-icon ${selectedRating >= 4 ? 'active light-green' : ''}`}
                                onClick={() => setSelectedRating(4)}
                            />
                            <img
                                src={Face5}
                                alt="Very Happy Face"
                                className={`rating-icon ${selectedRating === 5 ? 'active green' : ''}`}
                                onClick={() => setSelectedRating(5)}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* If currentStep is 2, render the content for Step 2 */}
            {currentStep === 2 && (
                <div>
                    {/* Title for Step 2 */}
                    <h2>
                        Step 2: Rate the Landlord
                    </h2>
                    {/* Add step 2 content */}
                </div>
            )}

            {/* If currentStep is 3, render the content for step 3 */}
            {currentStep === 3 && (
                <div>
                    {/* Title for step 3 */}
                    <h2>
                        Step 3: Rate the Landlord Cont.....
                    </h2>
                    {/* Add content here */}
                </div>
            )}

            {/* Button row to navigate between steps and submit the form */}
            <div className="button-row">
                {/* Render the 'Back' button only if the current step is greater than 1 */}
                {currentStep > 1 && (
                    <button onClick={() => setCurrentStep(currentStep - 1)}>
                        Back
                    </button>
                )}

                {/* Render the 'Next' button only if the user is not on the last step */}
                {currentStep < 4 && (
                    <button onClick={() => setCurrentStep(currentStep + 1)}>
                        Next
                    </button>
                )}

                {/* Show the 'Submit' button only on step 4 */}
                {currentStep === 4 && (
                    <button onClick={handleSubmit}>
                        Submit
                    </button>
                )}
            </div>
        </div>
    );
};

export default AddAReview;
