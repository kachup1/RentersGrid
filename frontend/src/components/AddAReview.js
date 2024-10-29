import React, {useState} from 'react'; //This keeps track of which frame/step the user is on
import './AddAReview.css'; //import the css file
import OfficialLogo from '../Assets/official logo.svg';
import SubmitLandlordRate from '../Assets/submit landlord rate.svg';
import SideMenu from './SideMenu'; // Import the SideMenu component
import AccountButton from '../Assets/Account button.svg';




//creating the add a review 1 functional component
const AddAReview = () => {

    //To keep track of the steps
    const [currentStep, setCurrentStep] = useState(1); //User will always start at the first frame

    //Handle form submission 
    const handleSubmit = () => {
        console.log('Submitting review...');
    };

    return (
        < div className="main-container">

            {/* Rendering the side menu component at the top left page */}
            <SideMenu />

            {/* Header section */}
            <header className="headerhp">
                {/*Container for logo*/}
                <div className="logohp-container">
                    <img
                        src={OfficialLogo} //Path to the logo image
                        alt="Official Logo" //Alternative text for accessability
                        className="center-logo" //CSS class for styling the logo
                    />
                </div>

                {/*Container for the action buttons in the header */}
                <div className="buttons-container">
                    {/* Left Image: Submit Landlord Rate */}
                    <img
                        src={SubmitLandlordRate} //Path to 'submit lanlord' image
                        alt="Submit Landlord Rate" //Alt text for accessability
                        className="left-icon" //CSS class 
                    />

                    {/* Right Image: Account Button */}
                    <a href="/account">
                    <img
                        src={AccountButton} //Path to image
                        alt="Account Button"
                        className="account-right"
                        
                    />
                    </a>
                </div>
            </header>

            {/*Conditionally rendering diff sections based on current step */}
            {/*If currentStep is 1, render the content for Step 1 */}
            {currentStep == 1 && (
                <div>
                    {/*Title for Step 1 */}
                    <h2>
                        Step 1: Write Review
                    </h2>
                    {/*Step contents */}
                </div>
            )}

            {/*If currentStep is 2, render the content for Step 2 */}
            {currentStep == 2 && (
                <div>
                    {/*Title for Step 2 */}
                    <h2>
                        Step 2: Rate the Landlord
                    </h2>
                    {/*Add step 2 content...... */}

                </div>
            )}
            {/*If currentStep is 3, render the content for step 3 */}
            {currentStep == 3 && (
                <div>
                    {/*Title for step 3 */}
                    <h2>
                        Step 3: Rate the Landlord Cont.....
                    </h2>
                    {/*Add content here.... */}
                </div>
            )}

            {/*Button row to navigate between steps and submit the form */}
            <div className ='button-row'>
                {/*Renter the 'Back' button only if the current step is greater than 1 (to prevent going back from step 1) */}
                {currentStep > 1 && (
                    <button onClick={() => setCurrentStep(currentStep - 1)}>
                        Back {/*Buton label */}
                    </button>
                )}

                {/*Render the 'Next' button only if user is not on the last step */}
                {currentStep < 4 && (
                    <button onClick={() => setCurrentStep(currentStep + 1)}>
                        Next
                    </button>
                )}

                {/*Show the 'Submit' button only on step 4 */}
                {currentStep == 4 && (
                    <button onClick={handleSubmit}>
                        Submit
                    </button>
                )}
            </div>
        </div>
    );
};

export default AddAReview;