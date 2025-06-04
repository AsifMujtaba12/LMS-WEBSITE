import { clerkClient } from "@clerk/express";

// Middleware to protect educator routes
export const protectEducator = async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    console.log("userId", userId);

    // Get user data from Clerk
    const response = await clerkClient.users.getUser(userId);

    // Check if user role is 'educator'
    if (response.publicMetadata.role !== 'educator') {
      return res.json({ success: false, message: 'Unauthorized Access' });
    }

    // User is educator, continue to next
    next();
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
