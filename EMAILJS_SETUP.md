# EmailJS setup for the booking form

The booking form on `index.html` sends booking requests directly to
`balineaholidayhome@gmail.com` using [EmailJS](https://www.emailjs.com) — no
page redirect, no guest email client required. Before it will actually send
mail, someone needs to create a free EmailJS account and plug three IDs into
the site. None of these three values are secret; EmailJS's "public key"
model is designed to sit in client-side code.

## 1. Create an EmailJS account

Go to <https://www.emailjs.com> and sign up (the free plan covers 200
emails/month, which is plenty for a booking enquiry form).

## 2. Connect the Gmail inbox

1. In the EmailJS dashboard, go to **Email Services → Add New Service**.
2. Choose **Gmail** and connect `balineaholidayhome@gmail.com`.
3. Copy the **Service ID** it generates (looks like `service_abc1234`).

## 3. Create the email template

1. Go to **Email Templates → Create New Template**.
2. Set the **To email** field to `balineaholidayhome@gmail.com`.
3. Set **Reply To** to `{{from_email}}` so the owner can hit "reply" and
   email the guest directly.
4. Use these template variables in the subject/body — they match exactly
   what `index.html` sends:

   | Variable          | Example value      |
   |--------------------|--------------------|
   | `{{from_name}}`    | Jane Smith         |
   | `{{from_email}}`   | jane@example.com   |
   | `{{phone}}`        | +62 812 3456 7890  |
   | `{{room}}`         | Suite with Jacuzzi |
   | `{{checkin}}`      | 12.10.2026         |
   | `{{checkout}}`     | 15.10.2026         |

   Example template body:

   ```
   New booking request from the website:

   Name: {{from_name}}
   Email: {{from_email}}
   Phone: {{phone}}
   Room: {{room}}
   Check-in: {{checkin}}
   Check-out: {{checkout}}
   ```

5. Save the template and copy its **Template ID** (looks like
   `template_xyz789`).

## 4. Get the public key

Go to **Account → General** and copy the **Public Key**.

## 5. Plug the three values into `index.html`

Open `index.html` and find the `EMAILJS CONFIGURATION` comment block near
the top of the closing `<script>` section (search for `EMAILJS_PUBLIC_KEY`).
Replace the three placeholders:

```js
const EMAILJS_PUBLIC_KEY  = 'YOUR_EMAILJS_PUBLIC_KEY';
const EMAILJS_SERVICE_ID  = 'YOUR_EMAILJS_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_EMAILJS_TEMPLATE_ID';
```

with the real values from steps 2–4, e.g.:

```js
const EMAILJS_PUBLIC_KEY  = 'AbCdEfGhIjKlMnOp';
const EMAILJS_SERVICE_ID  = 'service_abc1234';
const EMAILJS_TEMPLATE_ID = 'template_xyz789';
```

Save and reload the page. The booking form will now send a real email the
moment a guest clicks **Confirm Booking**.

## Until it's configured

If the placeholders are still in place, submitting the form shows a friendly
error message telling the guest to call or WhatsApp instead — it will not
silently fail or throw a console error a guest can see.

## Testing

1. Open `index.html` locally (or via a local server) and click **Book Now**.
2. Fill in the form with a check-out date before check-in — you should see
   an inline error and the two date fields highlighted.
3. Fill in the form correctly and submit — you should see a "Sending…"
   state, then a green success message, and a real email should land in
   `balineaholidayhome@gmail.com` within a few seconds.
4. Try disconnecting from the internet and submitting again — you should
   see a red error message with the phone/WhatsApp fallback, and the form's
   data should stay intact so the guest doesn't have to retype it.
