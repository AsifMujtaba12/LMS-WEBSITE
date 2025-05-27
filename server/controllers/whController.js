import {Webhook}  from 'svix'; 

import User from '../models/User.js'


//Api controller function to manage clerk user with data base
export const clerkWebhooks = async (req, res) => {
    try {
         console.log("🔥 Clerk webhook route hit");
        const whook= new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        await whook.verify(JSON.stringify(req.body), {
            "svix-id": req.headers['svix-id'],
            "svix-timestamp": req.headers['svix-timestamp'],
            "svix-signature": req.headers['svix-signature'],
        })
        console.log("Webhook verified");
        // req.body se type aur data extract karke Clerk ke events handle karna.
        const {data, type} = req.body;
        console.log('data and type :', data, type);
        switch (type) {
            case "user.created": {
                const userData = {
                    _id: data.id,
                    name: data.first_name + " " + data.last_name,
                    email: data.email_addresses[0].email_address,
                    imageUrl: data.image_url,
                }
                await User.create(userData);// Yeh line User model ka use karke naya user document MongoDB mein save karti hai.
                res.status(200).json({message: "User created successfully"});
                break;
                }
                case "user.updated":{
                    const userData = {
                        email: data.email_addresses[0].email_address,
                        name: data.first_name + " " + data.last_name,
                        imageUrl: data.image_url,
                    }
                    await User.findByIdAndUpdate(data.id, userData);
                    res.status(200).json({message: "User updated successfully"});
                    break;
                }
                case "user.deleted" : {
                await UserClerk.findByIdAndDelete(data.id);
                res.status(200).json({message: "User deleted successfully"});
                break;
                }
                default:
                    break;
            
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

// Jab Clerk mein koi user create/update/delete hota hai, Clerk ek webhook bhejta hai.

// Yeh webhook clerkWebhooks function ke through aata hai.

// Webhook ko verify kiya jaata hai (security check) using svix (Clerk ke webhooks ka tool).

// Phir webhook ke data ko padke, database mein user create/update/delete kiya jaata hai.