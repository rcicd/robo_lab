document.addEventListener('DOMContentLoaded', () => {
  // Create the error submission menu elements
  const createErrorSubmissionMenu = () => {
    // Create the overlay
    const overlay = document.createElement('div');
    overlay.className = 'error-submission-overlay';
    overlay.id = 'errorSubmissionOverlay';
    
    // Create the menu container
    const menuContainer = document.createElement('div');
    menuContainer.className = 'error-submission-container inner-content-box';
    
    // Create the header
    const header = document.createElement('h2');
    header.textContent = 'Report an Error';
    header.className = 'error-submission-header';
    
    // Create the close button
    const closeButton = document.createElement('button');
    closeButton.className = 'error-submission-close';
    closeButton.innerHTML = '&times;';
    closeButton.setAttribute('aria-label', 'Close');
    
    // Create the form
    const form = document.createElement('form');
    form.className = 'error-submission-form';
    
    // Create the error type field
    const errorTypeGroup = document.createElement('div');
    errorTypeGroup.className = 'error-submission-group';
    
    const errorTypeLabel = document.createElement('label');
    errorTypeLabel.innerHTML = 'Error Type: <span class="required-star">*</span>';
    errorTypeLabel.setAttribute('for', 'errorType');
    
    const errorTypeSelect = document.createElement('select');
    errorTypeSelect.id = 'errorType';
    errorTypeSelect.name = 'errorType';
    errorTypeSelect.required = true;
    
    // Add options to the dropdown
    const options = [
      { value: '', text: 'Select error type', disabled: true, selected: true },
      { value: 'content', text: 'Content Error' },
      { value: 'functionality', text: 'Functionality Issue' },
      { value: 'design', text: 'Design Problem' },
      { value: 'other', text: 'Other' }
    ];
    
    options.forEach(option => {
      const optionElement = document.createElement('option');
      optionElement.value = option.value;
      optionElement.textContent = option.text;
      if (option.disabled) optionElement.disabled = true;
      if (option.selected) optionElement.selected = true;
      errorTypeSelect.appendChild(optionElement);
    });
    
    errorTypeGroup.appendChild(errorTypeLabel);
    errorTypeGroup.appendChild(errorTypeSelect);
    
    // Create the description field
    const descriptionGroup = document.createElement('div');
    descriptionGroup.className = 'error-submission-group';
    
    const descriptionLabel = document.createElement('label');
    descriptionLabel.innerHTML = 'Description: <span class="required-star">*</span>';
    descriptionLabel.setAttribute('for', 'errorDescription');
    
    const descriptionTextarea = document.createElement('textarea');
    descriptionTextarea.id = 'errorDescription';
    descriptionTextarea.name = 'errorDescription';
    descriptionTextarea.rows = 5;
    descriptionTextarea.required = true;
    descriptionTextarea.placeholder = 'Please describe the error in detail...';
    
    descriptionGroup.appendChild(descriptionLabel);
    descriptionGroup.appendChild(descriptionTextarea);
    
    // Create the submit button
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.className = 'error-submission-button';
    submitButton.textContent = 'Submit Report';
    
    // Assemble the form
    form.appendChild(errorTypeGroup);
    form.appendChild(descriptionGroup);
    form.appendChild(submitButton);
    
    // Assemble the menu
    menuContainer.appendChild(closeButton);
    menuContainer.appendChild(header);
    menuContainer.appendChild(form);
    overlay.appendChild(menuContainer);
    
    // Add the menu to the body
    document.body.appendChild(overlay);
    
    // Return references to the elements we'll need to interact with
    return {
      overlay,
      closeButton,
      form,
      submitButton
    };
  };
  
  // Create the menu elements
  const { overlay, closeButton, form, submitButton } = createErrorSubmissionMenu();
  
  // Function to check if both fields are filled and update button color
  const updateButtonColor = () => {
    const errorType = document.getElementById('errorType').value;
    const errorDescription = document.getElementById('errorDescription').value;
    
    if (errorType && errorDescription) {
      // Both fields are filled
      submitButton.style.backgroundColor = 'var(--primary-color)';
    } else {
      // At least one field is empty
      submitButton.style.backgroundColor = '#2C2C2C';
    }
  };
  
  // Set initial button color
  submitButton.style.backgroundColor = '#2C2C2C';
  
  // Add event listeners to fields to update button color
  document.getElementById('errorType').addEventListener('change', updateButtonColor);
  document.getElementById('errorDescription').addEventListener('input', updateButtonColor);
  
  // Function to show the menu
  const showErrorSubmissionMenu = () => {
    overlay.classList.add('active');
    // Add a small delay before adding the visible class to create the animation effect
    setTimeout(() => {
      overlay.classList.add('visible');
    }, 10);
    
    // Reset button color when menu is shown
    updateButtonColor();
  };
  
  // Function to hide the menu
  const hideErrorSubmissionMenu = () => {
    overlay.classList.remove('visible');
    // Wait for the animation to complete before removing the active class
    setTimeout(() => {
      overlay.classList.remove('active');
    }, 300); // Match this to the CSS transition time
  };
  
  // Event listeners
  closeButton.addEventListener('click', hideErrorSubmissionMenu);
  
  // Close when clicking outside the menu
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
      hideErrorSubmissionMenu();
    }
  });
  
  // Handle form submission
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    
    // Get form data
    const errorType = document.getElementById('errorType').value;
    const errorDescription = document.getElementById('errorDescription').value;
    
    // Here you would typically send the data to a server
    console.log('Error report submitted:', {
      type: errorType,
      description: errorDescription
    });
    
    // Apply blur effect to the menu container
    const menuContainer = document.querySelector('.error-submission-container');
    menuContainer.style.filter = 'blur(5px)';
    menuContainer.style.transition = 'filter 0.3s ease';
    
    // Create and play the check.webm animation
    const videoContainer = document.createElement('div');
    videoContainer.className = 'success-animation-container';
    videoContainer.style.position = 'fixed';
    videoContainer.style.top = '50%';
    videoContainer.style.left = '50%';
    videoContainer.style.transform = 'translate(-50%, -50%)';
    videoContainer.style.zIndex = '2001';
    
    const video = document.createElement('video');
    video.src = 'assets/video/check.webm';
    video.autoplay = true;
    video.muted = true;
    video.style.width = '150px';
    video.style.height = '150px';
    
    videoContainer.appendChild(video);
    document.body.appendChild(videoContainer);
    
    // Reset the form
    form.reset();
    
    // Wait for the video to finish playing, then close the menu
    video.addEventListener('ended', () => {
      document.body.removeChild(videoContainer);
      hideErrorSubmissionMenu();
      // Reset the blur effect after the menu is closed
      setTimeout(() => {
        menuContainer.style.filter = 'none';
      }, 300);
    });
    
    // Error handling: if video fails to load or play, still close the menu
    video.addEventListener('error', () => {
      console.error('Error playing the success animation');
      document.body.removeChild(videoContainer);
      hideErrorSubmissionMenu();
      // Reset the blur effect after the menu is closed
      setTimeout(() => {
        menuContainer.style.filter = 'none';
      }, 300);
    });
    
    // Set a timeout as a fallback to ensure the menu closes even if the video doesn't play or end
    const fallbackTimeout = setTimeout(() => {
      if (document.body.contains(videoContainer)) {
        console.log('Using fallback to close the menu');
        document.body.removeChild(videoContainer);
        hideErrorSubmissionMenu();
        // Reset the blur effect after the menu is closed
        setTimeout(() => {
          menuContainer.style.filter = 'none';
        }, 300);
      }
    }, 5000); // 5 seconds should be enough for most animations
    
    // Clear the fallback timeout if the video ends normally
    video.addEventListener('ended', () => {
      clearTimeout(fallbackTimeout);
    });
  });
  
  // Expose the show function to the global scope so it can be called from a button
  window.showErrorSubmissionMenu = showErrorSubmissionMenu;
  
  // Handle the error report button animation
  const errorBtn = document.getElementById('errorReportBtn');
  if (errorBtn) {
    // Check if the animation has already been played in this session
    if (!sessionStorage.getItem('errorBtnAnimationPlayed')) {
      // Wait a bit before showing the button
      setTimeout(function() {
        errorBtn.style.opacity = '1';
        errorBtn.style.transform = 'translateY(0)';
        // Mark that the animation has been played
        sessionStorage.setItem('errorBtnAnimationPlayed', 'true');
      }, 1000);
    } else {
      // If animation already played, just show the button without animation
      errorBtn.style.opacity = '1';
      errorBtn.style.transform = 'translateY(0)';
    }
  }
});