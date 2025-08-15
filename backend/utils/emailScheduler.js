import cron from "node-cron";
import nodemailer from "nodemailer";
import Receipt from "../models/Receipt.js";
import User from "../models/User.js";

// --- 1. Configure Nodemailer Transporter ---
// This transporter uses your Gmail credentials from the .env file to send emails.
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS, // Use the App Password here
  },
});

// --- 2. Logic to Find Expiring Warranties and Send Emails ---
const checkWarrantiesAndSendEmails = async () => {
  console.log("Running daily warranty check...");
  try {
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    // Find receipts with a warranty ending in the next 30 days
    const expiringReceipts = await Receipt.find({
      warrantyEndDate: {
        $gte: today,
        $lte: thirtyDaysFromNow,
      },
    }).populate("user", "name email"); // Populate user details

    if (expiringReceipts.length === 0) {
      console.log("No expiring warranties found today.");
      return;
    }

    // Group receipts by user
    const receiptsByUser = {};
    expiringReceipts.forEach((receipt) => {
      if (!receiptsByUser[receipt.user.email]) {
        receiptsByUser[receipt.user.email] = {
          name: receipt.user.name,
          receipts: [],
        };
      }
      receiptsByUser[receipt.user.email].receipts.push(receipt);
    });

    // Send an email to each user with their expiring items
    for (const email in receiptsByUser) {
      const userData = receiptsByUser[email];
      const receiptListHtml = userData.receipts
        .map(
          (r) =>
            `<li><b>${r.title}</b> - Expires on ${new Date(
              r.warrantyEndDate
            ).toLocaleDateString()}</li>`
        )
        .join("");

      const mailOptions = {
        from: `"Vaultify" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: "You have warranties expiring soon!",
        html: `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <h2>Hi ${userData.name},</h2>
            <p>This is a friendly reminder from Vaultify that the following items have warranties expiring within the next 30 days:</p>
            <ul>
              ${receiptListHtml}
            </ul>
            <p>You can view more details by logging into your Vaultify account.</p>
            <p>Best,</p>
            <p>The Vaultify Team</p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log(`Reminder email sent to ${email}`);
    }
  } catch (error) {
    console.error("Error in warranty check scheduler:", error);
  }
};

// --- 3. Schedule the Cron Job ---
const startWarrantyScheduler = () => {
  // This schedule runs the function at 9:00 AM every day.
  // The format is: 'minute hour * * *'
  // cron.schedule("0 9 * * *", checkWarrantiesAndSendEmails, {
  //   scheduled: true,
  //   timezone: "Asia/Kolkata", // Example: Indian Standard Time
  // });
  // This schedule runs every minute
     cron.schedule("* * * * *", checkWarrantiesAndSendEmails, {
       scheduled: true,
       timezone: "Asia/Kolkata", // Example: Indian Standard Time
  
      });
  console.log(
    "✅ Warranty reminder scheduler started. Will run every day at 9:00 AM."
  );
};

export default startWarrantyScheduler;

