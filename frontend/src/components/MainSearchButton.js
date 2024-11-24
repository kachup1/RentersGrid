import React, { useState } from 'react';
import styles from './MainSearchButton.module.css';
import DownArrowIcon from '../Assets/downward.svg'; // Update path as needed
import { useNavigate } from 'react-router-dom';



function SearchButton({ onSearch }) {
    const [selectedOption, setSelectedOption] = useState('all'); // Set default to "All"
    const [searchQuery, setSearchQuery] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const options = [
        { value: 'all', label: 'All' }, // Add this line
        { value: 'landlord', label: 'Landlord Name' },
        { value: 'property', label: 'Property Name' },
        { value: 'address', label: 'Address' },
        { value: 'city', label: 'City' },
        { value: 'zipcode', label: 'Zip Code' },
    ];
    

    const handleOptionSelect = (value) => {
        setSelectedOption(value);
        setDropdownOpen(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch(); // Trigger the search when Enter is pressed
        }
    };
    

    const handleSearch = () => {
        if (searchQuery.trim()) {
 
        const query = searchQuery.trim() || ' '; // Use a space to fetch all results if query is empty
        const searchBy = selectedOption || 'all';

    
            // If selectedOption is null, set it to 'all'
    
            fetch(`http://localhost:5000/api/search?searchBy=${searchBy}&query=${encodeURIComponent(searchQuery)}`)
                .then(response => response.json())
                .then(data => {
                    navigate('/SearchResults', { state: { results: data, searchQuery: query, searchBy  } });
                })
                .catch(error => {
                    console.error('Error fetching search results:', error);
                });
        } else {
            alert("Please enter a search query.");
        }
    };

    
    return (
        <div className={styles.searchContainer}>
            {/* Dropdown */}
            <div className={styles.dropdownContainer} onClick={() => setDropdownOpen(!dropdownOpen)}>
                <span className={styles.selectedOption}>
                    {/* Display placeholder if no option is selected */}
                    {selectedOption ? options.find(option => option.value === selectedOption)?.label : 'All'}
                </span>
                <img 
                    src={DownArrowIcon} 
                    alt="Arrow" 
                    className={`${styles.downArrow} ${dropdownOpen ? styles.rotateArrow : ''}`}
                />

                
                {/* Dropdown Menu */}
                {dropdownOpen && (
                    <ul className={styles.dropdownMenu}>
                        {options.map(option => (
                            <li 
                                key={option.value} 
                                className={styles.dropdownItem}
                                onClick={() => handleOptionSelect(option.value)}
                            >
                                {option.label}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            
            {/* Input Field */}
            <input
                type="text"
                className={styles.searchInput}
                placeholder={selectedOption && selectedOption !== 'all' ? 
                    `Search by ${options.find(option => option.value === selectedOption)?.label}` : 'Search All Categories'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
            />


        </div>
    );
}

export default SearchButton;
