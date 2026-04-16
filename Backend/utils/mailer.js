const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_URL);

const DEFAULT_EMAIL = process.env.DEFAULT_EMAIL;
const FROM_ADDRESS = process.env.FROM_ADDRESS;

/**
 * Sends an order confirmation email with item details.
 * @param {string|null} toEmail — recipient; falls back to DEFAULT_EMAIL
 * @param {object}      order  — the order object returned by createOrder()
 */
async function sendOrderConfirmationEmail(toEmail, order) {
    const recipient = toEmail && toEmail.trim() ? toEmail.trim() : DEFAULT_EMAIL;

    // Build the items table rows
    const itemRows = (order.items || [])
        .map(
            (item) => `
        <tr>
            <td style="padding:12px 16px; border-bottom:1px solid #f0f0f0;">
                <div style="display:flex; align-items:center; gap:12px;">
                    ${item.image
                    ? `<img src="${item.image}" alt="${item.title}" width="56" height="56"
                            style="border-radius:4px; object-fit:cover; border:1px solid #e0e0e0;" />`
                    : ''
                }
                    <div>
                        <p style="margin:0; font-weight:600; color:#212121; font-size:14px;">${item.title}</p>
                        ${item.brand ? `<p style="margin:2px 0 0; color:#878787; font-size:12px;">${item.brand}</p>` : ''}
                    </div>
                </div>
            </td>
            <td style="padding:12px 16px; border-bottom:1px solid #f0f0f0; text-align:center; color:#212121; font-size:14px;">
                ${item.quantity}
            </td>
            <td style="padding:12px 16px; border-bottom:1px solid #f0f0f0; text-align:right; color:#212121; font-weight:600; font-size:14px;">
                ₹${(item.price * item.quantity).toLocaleString('en-IN')}
            </td>
        </tr>`
        )
        .join('');

    const htmlBody = `
    <!DOCTYPE html>
    <html lang="en">
    <head><meta charset="UTF-8" /></head>
    <body style="margin:0; padding:0; background:#f1f3f6; font-family:'Segoe UI',Roboto,Arial,sans-serif;">
        <div style="max-width:600px; margin:0 auto; background:#ffffff;">

            <!-- Header -->
            <div style="background:linear-gradient(135deg, #2874f0 0%, #1a5dc8 100%); padding:28px 32px; text-align:center;">
                <h1 style="margin:0; color:#ffffff; font-size:22px; letter-spacing:0.5px;">
                    ✅ Order Placed Successfully!
                </h1>
                <p style="margin:8px 0 0; color:rgba(255,255,255,0.85); font-size:14px;">
                    Thank you for shopping with us
                </p>
            </div>

            <!-- Order Info -->
            <div style="padding:24px 32px; border-bottom:1px solid #f0f0f0;">
                <table width="100%" cellpadding="0" cellspacing="0" style="font-size:13px; color:#212121;">
                    <tr>
                        <td style="padding:4px 0;">
                            <span style="color:#878787;">Order ID:</span>
                            <strong style="margin-left:8px;">${order.orderId}</strong>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:4px 0;">
                            <span style="color:#878787;">Order Date:</span>
                            <span style="margin-left:8px;">${new Date(order.orderDate).toLocaleDateString('en-IN', {
        weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
    })}</span>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:4px 0;">
                            <span style="color:#878787;">Estimated Delivery:</span>
                            <span style="margin-left:8px; color:#388e3c; font-weight:600;">${order.estimatedDelivery}</span>
                        </td>
                    </tr>
                </table>
            </div>

            <!-- Items -->
            <div style="padding:0 32px 16px;">
                <h2 style="font-size:15px; color:#212121; margin:20px 0 12px; text-transform:uppercase; letter-spacing:0.5px;">
                    Order Items
                </h2>
                <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f0f0f0; border-radius:4px;">
                    <thead>
                        <tr style="background:#f5f5f5;">
                            <th style="padding:10px 16px; text-align:left; font-size:12px; color:#878787; font-weight:600; text-transform:uppercase;">Product</th>
                            <th style="padding:10px 16px; text-align:center; font-size:12px; color:#878787; font-weight:600; text-transform:uppercase;">Qty</th>
                            <th style="padding:10px 16px; text-align:right; font-size:12px; color:#878787; font-weight:600; text-transform:uppercase;">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemRows}
                    </tbody>
                </table>
            </div>

            <!-- Price Summary -->
            <div style="padding:16px 32px 24px; background:#fafafa; border-top:1px solid #f0f0f0;">
                <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px; color:#212121;">
                    <tr>
                        <td style="padding:6px 0; color:#878787;">Subtotal</td>
                        <td style="padding:6px 0; text-align:right;">₹${order.subtotal.toLocaleString('en-IN')}</td>
                    </tr>
                    <tr>
                        <td style="padding:6px 0; color:#388e3c;">Discount</td>
                        <td style="padding:6px 0; text-align:right; color:#388e3c;">−₹${order.discount.toLocaleString('en-IN')}</td>
                    </tr>
                    <tr>
                        <td style="padding:6px 0; color:#878787;">Delivery</td>
                        <td style="padding:6px 0; text-align:right;">
                            ${order.deliveryCharge === 0
            ? '<span style="color:#388e3c; font-weight:600;">FREE</span>'
            : '₹' + order.deliveryCharge.toLocaleString('en-IN')
        }
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" style="padding:8px 0 0;">
                            <hr style="border:none; border-top:1px dashed #e0e0e0;" />
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:8px 0; font-weight:700; font-size:16px;">Total Amount</td>
                        <td style="padding:8px 0; text-align:right; font-weight:700; font-size:16px;">₹${order.total.toLocaleString('en-IN')}</td>
                    </tr>
                </table>
            </div>

            <!-- Footer -->
            <div style="padding:20px 32px; text-align:center; border-top:1px solid #f0f0f0;">
                <p style="margin:0; color:#878787; font-size:12px;">
                    This is an automated email from Flipkart Clone. Please do not reply.
                </p>
                <p style="margin:6px 0 0; color:#b0b0b0; font-size:11px;">
                    © ${new Date().getFullYear()} Jeevan · jeevan.engineer
                </p>
            </div>
        </div>
    </body>
    </html>`;

    try {
        const { data, error } = await resend.emails.send({
            from: FROM_ADDRESS,
            to: [recipient],
            subject: `✅ Order Placed Successfully — ${order.orderId}`,
            html: htmlBody,
        });

        if (error) {
            console.error('Resend email error:', error);
            return { success: false, error };
        }

        console.log(`📧 Order confirmation sent to ${recipient} (Resend ID: ${data.id})`);
        return { success: true, id: data.id };
    } catch (err) {
        console.error('Failed to send order email:', err.message);
        return { success: false, error: err.message };
    }
}

module.exports = { sendOrderConfirmationEmail };
