# Error Submission Menu Documentation

This document explains how to use the error submission menu component that has been added to the website.

## Overview

The error submission menu is a modal dialog that allows users to report errors on the website. It includes:

1. A dropdown menu for selecting the error type
2. A text area for entering a detailed description of the error
3. A submit button for sending the report

The menu appears in the center of the page with a semi-transparent overlay that darkens the rest of the page. It has a "looming" animation effect when it appears and disappears.

## How to Trigger the Menu

The error submission menu can be triggered by calling the `showErrorSubmissionMenu()` function. This function is globally available on all pages of the website.

### Example: Adding a Button to Trigger the Menu

To add a button that opens the error submission menu, add the following HTML code to your page:

```html
<button 
  onclick="showErrorSubmissionMenu()" 
  class="error-report-button" 
  style="position: fixed; bottom: 20px; left: 20px; z-index: 1000; background-color: var(--primary-color); color: white; border: none; border-radius: 5px; padding: 8px 12px; cursor: pointer; font-size: 14px;">
  Report an Error
</button>
```

You can customize the button's position, appearance, and text as needed. The important part is the `onclick="showErrorSubmissionMenu()"` attribute, which calls the function to show the menu.

## How It Works

When a user submits the form:

1. The form data is collected (error type and description)
2. Currently, the data is logged to the console (you'll need to implement server-side handling)
3. A success message is shown to the user
4. The form is reset and the menu is closed

## Customization

### Changing the Error Type Options

To modify the dropdown options for error types, edit the `options` array in the `assets/js/issue-submission.js` file:

```javascript
const options = [
  { value: '', text: 'Select error type', disabled: true, selected: true },
  { value: 'content', text: 'Content Error' },
  { value: 'functionality', text: 'Functionality Issue' },
  { value: 'design', text: 'Design Problem' },
  { value: 'other', text: 'Other' }
];
```

### Handling Form Submission

Currently, the form submission just logs the data to the console. To send the data to a server, modify the form submission handler in `assets/js/issue-submission.js`:

```javascript
form.addEventListener('submit', (event) => {
  event.preventDefault();
  
  // Get form data
  const errorType = document.getElementById('errorType').value;
  const errorDescription = document.getElementById('errorDescription').value;
  
  // Replace this with your server-side submission code
  console.log('Error report submitted:', {
    type: errorType,
    description: errorDescription
  });
  
  // Show a success message
  alert('Thank you for your report! We will look into this issue.');
  
  // Reset the form and close the menu
  form.reset();
  hideErrorSubmissionMenu();
});
```

## Styling

The error submission menu is styled using the `assets/css/error-submission.css` file. You can modify this file to change the appearance of the menu, including colors, sizes, and animations.

## Browser Compatibility

The error submission menu uses modern JavaScript and CSS features that are supported by all modern browsers (Chrome, Firefox, Safari, Edge).