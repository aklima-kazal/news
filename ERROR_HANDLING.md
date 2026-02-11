# Error Handling & User-Friendly Messages

This document outlines the improved error handling system implemented across the News Dashboard frontend.

## Overview

The frontend now provides clear, user-friendly error messages across all pages and API interactions. This improves user experience and helps users understand what went wrong and how to fix it.

## Key Improvements

### 1. **Enhanced API Layer** (`lib/api.js`)

The API service layer now includes:
- Custom `ApiError` class for structured error handling
- HTTP status-specific error messages
- Network connectivity error detection
- Clear error messages for different scenarios:
  - **401 Unauthorized**: "Your session has expired. Please login again."
  - **400 Bad Request**: "Invalid input. Please check your entries."
  - **404 Not Found**: "The item you're looking for was not found."
  - **500+ Server Errors**: "Server error. Please try again later."
  - **Network Errors**: "Unable to connect to the server. Please check your connection."

### 2. **Error Handler Utility** (`lib/errorHandler.js`)

Reusable error formatting functions:
- `getErrorMessage(error)` - Extract user-friendly message from error object
- `getNetworkError()` - Network connectivity messages
- `getAuthError()` - Authentication failure messages
- `getValidationError(field)` - Field validation messages
- `getServerError()` - Server error messages
- `getNotFoundError(item)` - Item not found messages

### 3. **Alert Components** (`components/AlertComponents.jsx`)

Pre-built, styled components for consistent UI:
- `ErrorAlert` - Display errors with optional retry button
- `LoadingSpinner` - Show loading state
- `SuccessAlert` - Show success messages with dismiss option

### 4. **Page-Level Improvements**

All pages now have improved error handling:

#### Login Page (`app/login/page.jsx`)
- Better error feedback on login failure
- Specific session expiration messages
- Visual feedback with emojis

#### News Page (`app/dashboard/news/page.jsx`)
- Proper error display with styled alert
- Loading state with spinner
- Allows user to understand fetch failures

#### Add News Page (`app/dashboard/news/add/page.jsx`)
- Validation error messages
- Network error handling
- Success confirmation with navigation

#### Categories Page (`app/dashboard/categories/page.jsx`)
- Error handling similar to News Page
- Clear loading and error states

#### Add Category Page (`app/dashboard/categories/add/page.jsx`)
- Field validation messages
- Creation error handling
- Success feedback

#### Register Page (`app/register/page.jsx`)
- Improved registration error messages
- Better user guidance

## Usage Examples

### In API-based pages:

```jsx
const [error, setError] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchData = async () => {
    try {
      const data = await api.getNews();
      setNews(data);
    } catch (err) {
      setError(err.message); // Already user-friendly
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);

if (loading) return <LoadingSpinner />;
if (error) return <ErrorAlert error={error} onRetry={() => window.location.reload()} />;
```

### Using toast notifications:

```jsx
try {
  await api.createNews(title, content, category);
  toast.success("✨ News published successfully!", { duration: 2000 });
} catch (error) {
  toast.error(error.message, { duration: 3000 });
}
```

### Custom error messages:

```jsx
import { getErrorMessage, getValidationError } from "@/lib/errorHandler";

try {
  // ... operation
} catch (error) {
  const message = getErrorMessage(error);
  toast.error(message);
}
```

## Error Message Features

1. **Emojis for Visual Clarity**
   - ⚠️ Warnings/Errors
   - ✨ Success messages
   - 📝 Validation errors
   - ⏳ Loading states

2. **Toast Duration**
   - Success: 2000ms (quick confirmation)
   - Errors: 3000ms (gives user time to read)

3. **Structured Approach**
   - Generic errors → tailored messages
   - Backend validation → frontend feedback
   - Network issues → clear connectivity messages

## Best Practices

1. **Always include error messages** in catch blocks
2. **Use toast for temporary messages** (notifications)
3. **Use ErrorAlert for persistent errors** (form/fetch failures)
4. **Provide retry options** when appropriate
5. **Log errors to console** for debugging (in catch blocks)
6. **Test error scenarios** (offline mode, server down, etc.)

## Testing Error Scenarios

To test error handling:

1. **Network Errors**: Disconnect from internet or disable backend
2. **Validation Errors**: Submit forms with invalid data
3. **Authentication Errors**: Clear localStorage and try accessing protected routes
4. **Server Errors**: Simulate server errors in the backend

## Future Improvements

- Create an error boundary component for React error catching
- Add detailed error logging to a service
- Implement error recovery strategies
- Add accessibility improvements to error messages
- Create a centralized error notification system
