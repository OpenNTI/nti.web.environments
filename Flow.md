# LMS Onboarding flow

1. Initial Form
	- Collect `email`, `name`, and `username`
	- The values can be prefilled from query-params
	- If all the values are provided and there is an `auto-submit` query-param the provided values will be automatically submitted
2. Generate and send *Verification Token* email
3. Collect *Verification Token*
4. Based on the *Verification Token* look up trial information
	- Any existing trial sites associated with that email
	- A link to create a new trial site
5. Create a trial site at a given subdomain
	- Pass the username from the initial form as the site admin
	- Get a link to finish setting their password
6. Poll the trial site to see when it comes up, and redirect to the password setup page
	- If enough time as passed and they haven't finished setting up their password. Send a "You Site is Ready" email with the link, to remind them

We might want to have an option to "recover" a trial, where we only take an email, verify they own it, and list the trials associated with that email

