document.addEventListener('DOMContentLoaded', () => {
  // Helper function to sanitize user input to prevent XSS attacks
  const sanitizeInput = (input) => {
    if (typeof input !== 'string') return '';
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };
  
  // Function to get API key based on environment
  const getApiKey = () => {
    // In a production environment, you might want to use a more secure approach
    // This is a simplified example for demonstration purposes
    
    // For a real application, consider:
    // 1. Using environment variables with a build process
    // 2. Fetching from a secure configuration endpoint (with proper authentication)
    // 3. Using a secure vault or key management service
    
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      // Development API key - should be replaced with your actual development key
      return 'secure-api-key-change-in-production';
    } else {
      // Production API key - should be securely managed
      // IMPORTANT: Replace this with your actual production API key before deployment
      // DO NOT commit the actual API key to version control
      return 'your-production-api-key';
    }
  };
  
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

  // Function to create a GitHub issue and add it to a project
  async function createGitHubIssue(title, body) {
    try {
      // Validate input
      if (!title || !body) {
        console.error('Title and body are required');
        return { 
          success: false, 
          message: 'Title and body are required' 
        };
      }
      
      // Additional validation to match server-side requirements
      if (title.length < 3 || title.length > 256) {
        console.error('Title must be between 3 and 256 characters');
        return { success: false, message: 'Title must be between 3 and 256 characters' };
      }
      
      if (body.length < 10) {
        console.error('Description must be at least 10 characters');
        return { success: false, message: 'Description must be at least 10 characters' };
      }

      // Get CSRF token from meta tag (should be added to your HTML)
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      
      // Get API key from configuration
      // In a real application, this would be securely stored and retrieved
      // For development purposes, we're using a constant value
      const API_KEY = getApiKey();
      
      // Determine backend URL based on environment
      let backendUrl;
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        backendUrl = 'http://localhost:3000/api/create-issue';
      } else {
        // Use relative URL in production to avoid hardcoding domains
        // This assumes the API is hosted on the same domain or properly configured for CORS
        backendUrl = '/api/create-issue';
      }

      // Make the API request to the backend with security headers
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest', // Helps prevent CSRF
          'x-api-key': API_KEY, // Add API key for authentication
          ...(csrfToken && { 'X-CSRF-Token': csrfToken }), // Add CSRF token if available
        },
        credentials: 'same-origin', // Include cookies for session authentication
        body: JSON.stringify({ 
          title: title, // Already sanitized before calling this function
          body: body    // Already sanitized before calling this function
        }),
      });

      // Handle different response status codes
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        // Handle specific status codes
        switch (response.status) {
          case 401:
            throw new Error('Authentication failed. Please check your API key.');
          case 429:
            throw new Error('Too many requests. Please try again later.');
          case 400:
            throw new Error(`Validation error: ${errorData.message || 'Invalid input'}`);
          case 404:
            throw new Error('API endpoint not found. Please check the server configuration.');
          case 500:
          case 502:
          case 503:
          case 504:
            throw new Error('Server error. Please try again later.');
          default:
            throw new Error(`Server responded with status: ${response.status}. ${errorData.message || ''}`);
        }
      }

      // Parse the response
      const data = await response.json();

      // Log the result (only in development)
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        if (data.success) {
          console.log('Issue created successfully:', data.issueUrl);
        } else {
          console.error('Failed to create issue:', data.message);
        }
      }

      // Return the success status and additional data
      return {
        success: data.success,
        message: data.message,
        issueUrl: data.issueUrl
      };
    } catch (error) {
      // Log error (only in development)
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.error('Error creating issue:', error.message);
      }
      
      // Return structured error response
      return {
        success: false,
        message: error.message || 'There was an error submitting your report. Please try again later.'
      };
    }
  }

  // Create a feedback message element
  const createFeedbackMessage = (message, isError = false) => {
    const feedbackElement = document.createElement('div');
    feedbackElement.className = `error-submission-feedback ${isError ? 'error' : 'success'}`;
    feedbackElement.textContent = message;
    feedbackElement.style.padding = '10px';
    feedbackElement.style.marginBottom = '15px';
    feedbackElement.style.borderRadius = '4px';
    feedbackElement.style.backgroundColor = isError ? '#ffebee' : '#e8f5e9';
    feedbackElement.style.color = isError ? '#c62828' : '#2e7d32';
    feedbackElement.style.border = `1px solid ${isError ? '#ef9a9a' : '#a5d6a7'}`;
    
    return feedbackElement;
  };
  
  // Function to show feedback message in the form
  const showFeedback = (message, isError = false) => {
    // Remove any existing feedback
    const existingFeedback = document.querySelector('.error-submission-feedback');
    if (existingFeedback) {
      existingFeedback.remove();
    }
    
    const feedbackElement = createFeedbackMessage(message, isError);
    
    // Insert at the top of the form
    const form = document.querySelector('.error-submission-form');
    form.insertBefore(feedbackElement, form.firstChild);
    
    // Auto-remove success messages after 5 seconds
    if (!isError) {
      setTimeout(() => {
        if (document.body.contains(feedbackElement)) {
          feedbackElement.remove();
        }
      }, 5000);
    }
  };

  // Handle form submission
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    // Get form data and sanitize inputs
    const errorTypeSelect = document.getElementById('errorType');
    const errorDescriptionInput = document.getElementById('errorDescription');
    
    // Validate inputs
    if (!errorTypeSelect || !errorDescriptionInput) {
      console.error('Form elements not found');
      showFeedback('Form error: Elements not found', true);
      return;
    }
    
    // Get and sanitize values
    const errorType = sanitizeInput(errorTypeSelect.value);
    let errorDescription = sanitizeInput(errorDescriptionInput.value);
    
    // Validate that required fields are not empty after sanitization
    if (!errorType || !errorDescription) {
      showFeedback('Please fill in all required fields with valid input', true);
      return;
    }
    
    // Client-side validation matching server requirements
    // Note: The error type is used as the title for the GitHub issue
    if (errorType.length < 3 || errorType.length > 256) {
      showFeedback('Error type (issue title) must be between 3 and 256 characters', true);
      return;
    }
    
    if (errorDescription.length < 2) {
      showFeedback('Description (issue body) must be at least 1 character', true);
      return;
    }
    
    // Show loading state
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';
    showFeedback('Submitting your report...', false);
    
    // Add endpoint information to the description
    const currentEndpoint = window.location.pathname;
    errorDescription = `${errorDescription}\n\nEndpoint: ${currentEndpoint}`;
    
    // Log the submission for debugging (avoid logging sensitive data in production)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.log('Error report submitted:', {
        type: errorType,
        description: errorDescription.substring(0, 50) + (errorDescription.length > 50 ? '...' : '')
      });
    }
    
    // Create GitHub issue and add to project
    const result = await createGitHubIssue(errorType, errorDescription);
    
    // Reset button state
    submitButton.disabled = false;
    submitButton.textContent = 'Submit Report';
    
    if (result.success) {
      console.log('Successfully added issue to GitHub project');
      showFeedback('Your report was submitted successfully!', false);
    } else {
      console.warn(`Failed to add issue to GitHub project: ${result.message}`);
      showFeedback(`Error: ${result.message || 'Failed to submit report'}`, true);
      return; // Stop execution to prevent showing success animation
    }
    
    // Apply blur effect to the menu container
    const menuContainer = document.querySelector('.error-submission-container');
    menuContainer.style.filter = 'blur(5px)';
    menuContainer.style.transition = 'filter 0.3s ease';
    
    // Create and play the check.webm animation with security measures
    const videoContainer = document.createElement('div');
    videoContainer.className = 'success-animation-container';
    // Use CSS classes instead of inline styles where possible
    videoContainer.classList.add('success-animation-fixed');
    // Only set essential styles inline
    videoContainer.style.zIndex = '2001';
    
    // Create video element with security measures
    const video = document.createElement('video');
    
    // Validate and sanitize video source path
    const videoPath = '/assets/video/check.webm';
    // Only allow specific video files from our assets directory
    if (!/^\/assets\/video\/(check|success)\.webm$/.test(videoPath)) {
      console.error('Invalid video source');
      return;
    }
    
    // Set attributes safely
    video.setAttribute('src', videoPath);
    video.setAttribute('autoplay', 'true');
    video.setAttribute('muted', 'true');
    video.setAttribute('playsinline', 'true');
    video.setAttribute('width', '150');
    video.setAttribute('height', '150');
    
    // Add security attributes
    video.setAttribute('crossorigin', 'anonymous');
    
    // Prevent potential script execution
    video.addEventListener('error', (e) => {
      console.error('Video error:', e);
      if (document.body.contains(videoContainer)) {
        document.body.removeChild(videoContainer);
      }
    }, { once: true });
    
    // Append elements safely
    videoContainer.appendChild(video);
    document.body.appendChild(videoContainer);
    
    // Reset the form
    form.reset();
    
    // Safe removal function to prevent errors
    const safelyRemoveAndClose = () => {
      try {
        // Only remove if it exists in the DOM
        if (document.body.contains(videoContainer)) {
          document.body.removeChild(videoContainer);
        }
        
        // Only hide if the function exists
        if (typeof hideErrorSubmissionMenu === 'function') {
          hideErrorSubmissionMenu();
        }
        
        // Only reset filter if menuContainer exists
        if (menuContainer && menuContainer.style) {
          setTimeout(() => {
            menuContainer.style.filter = 'none';
          }, 300);
        }
      } catch (err) {
        // Log error only in development
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
          console.error('Error in cleanup:', err.message);
        }
      }
    };
    
    // Wait for the video to finish playing, then close the menu
    video.addEventListener('ended', safelyRemoveAndClose, { once: true });
    
    // Error handling: if video fails to load or play, still close the menu
    video.addEventListener('error', () => {
      // Log error only in development
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.error('Error playing the success animation');
      }
      safelyRemoveAndClose();
    }, { once: true });
    
    // Set a timeout as a fallback to ensure the menu closes even if the video doesn't play or end
    const fallbackTimeout = setTimeout(() => {
      // Log only in development
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('Using fallback to close the menu');
      }
      safelyRemoveAndClose();
    }, 5000); // 5 seconds should be enough for most animations
    
    // Clear the fallback timeout if the video ends normally
    video.addEventListener('ended', () => {
      clearTimeout(fallbackTimeout);
    }, { once: true });
  });
  
  // Securely expose the show function to the global scope
  // Use a more specific namespace to avoid global pollution
  if (!window.RoboLab) {
    window.RoboLab = {};
  }
  
  // Expose the function through our namespace with proper validation
  window.RoboLab.showErrorForm = () => {
    try {
      showErrorSubmissionMenu();
    } catch (err) {
      // Only log in development
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.error('Error showing form:', err.message);
      }
    }
  };
  
  // Handle the error report button animation with improved security
  const errorBtn = document.getElementById('errorReportBtn');
  if (errorBtn) {
    // Check if the animation has already been played in this session
    if (!sessionStorage.getItem('errorBtnAnimationPlayed')) {
      // Use a safer approach with requestAnimationFrame
      requestAnimationFrame(() => {
        setTimeout(() => {
          // Use classList instead of direct style manipulation
          errorBtn.classList.add('visible');
          // Mark that the animation has been played
          sessionStorage.setItem('errorBtnAnimationPlayed', 'true');
        }, 1000);
      });
    } else {
      // If animation already played, just show the button without animation
      errorBtn.classList.add('visible');
    }
    
    // Add click handler directly here instead of inline HTML onclick
    errorBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.RoboLab.showErrorForm();
    });
  }
  
  /*
   * SECURITY RECOMMENDATIONS:
   * 
   * 1. Content Security Policy (CSP)
   * Add the following meta tag to your HTML head or configure server headers:
   * 
   * <meta http-equiv="Content-Security-Policy" content="
   *   default-src 'self';
   *   script-src 'self';
   *   style-src 'self' 'unsafe-inline';
   *   img-src 'self' data:;
   *   media-src 'self';
   *   connect-src 'self' https://api.github.com;
   *   form-action 'self';
   *   frame-ancestors 'none';
   * ">
   * 
   * 2. Add CSRF protection to your backend API
   * 3. Implement rate limiting for the issue submission API
   * 4. Consider adding CAPTCHA for form submission
   * 5. Regularly update dependencies and audit your code
   */
});