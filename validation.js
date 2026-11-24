export function validateForm(data) {
    console.log("Validating...");
    console.log(data);

    // Store error messages in an array
    const errors = [];

    // Validate method (Pickup or Delivery)
    const validMethods = ['pickup', 'delivery'];
    if (!validMethods.includes(data.method)) {
        errors.push("Method must be pickup or delivery.");
    }

    // Validate Size
    const validSize = ['small', 'medium', 'large'];
    if (!validSize.includes(data.size)) {
        errors.push("Size must be small, medium, or large.");
    }
    
    // Return result
    console.log(errors);
    return {
        isValid: errors.length === 0,
        errors
    };
}