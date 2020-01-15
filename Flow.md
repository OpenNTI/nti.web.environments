# LMS Onboarding Flow

## Views

### Initial Form

**Path:** `/`

- Checks [`/me/`](#me)
- If Authenticated
	- Redirect to [`/sites/`](#sites)
- If Not Authenticated
	- Show a form to collect
		- `email`
		- `name`
		- `username`
	- Show a link [recover any active trails](#recover)
	- On Submit:
		- Submits to [`/send-verification/`](#send-verification)
		- Puts info into session storage
		- Redirects to [verify email](#verify-email)

### Recover

**Path:** `/recover/`

- Checks [`/me/`](#me)
- If Authenticated
	- Redirect to [`/sites/`](#sites)
- If not Authenticated
	- Show a form to collect
		- `email`
	- On Submit:
		- Submits to [`/send-verification/`](#send-verification)
		- Puts info into session storage
			- `email` and the first half of the `verification-code`
		- Redirects to [verify email](#verify-email)

### Verify Email

**Path:** `/verify/`

- Check session storage or query-params for the email the verification code was sent.
- If No email
	- Redirect to [`/`](#initial-form)
- If Email
	- Show a form to collect
		- `verification-code`
	- On Submit
		- Submits `email` and `verification-code` to [`/verify/`](#verify)
		- Puts into into session storage
		- Redirects to [`/sites/`](#sites)

### Sites

**Path:** `/sites/`

- Checks [`/me/`](#me) or session storage for user
- If Not Authenticated
	- Redirect to [`/`](#initial-form)
- If Authenticated
	- If there's only one site and you can't create more, redirect to the site
	- Show a list of any existing sites
	- If Available show a "create new site"
		- Show a form to collect
			- `domain-name`
				- If the user is required to have random gibberish at the end compute some
				- Preflight the domains availability at [`{user}/new-site-preflight/`](#usernew-site-preflight)
		- Submits `domain-name` and `license=Trial` to [`{user}/new-site`](#usernew-site)
		- Redirects to [`/sites/{site-id}`](#site)

### Site

**Path:** `/sites/{site-id}`

- Checks [`/me/`](#me) or session storage for user
- If not Authenticated
	- Redirect to [`/`](#initial-form)
- If Authenticated
	- Look up the site for {site-id} in the user's sites list
	- If no site found
		- Redirect to [`/sites/`](#sites)
	- If site found
		- If the site is `Pending` show a spinner page
			- Poll the site to see when its set up
			- When its set up Redirect to `setup-admin-account` in the site
		- If the site is `Failed` show the error and a link to contact support
		- If the site is `Success` show info about the site

*************************

## API

### Objects

#### User

Properties:

- **sitesRequireGUID** *String*: whether or not we should append a random number to domains for this user
- **sites** *Array*: a list of sites for this user

Links:

- **create-site-preflight**: check whether the given payload would work for `create-site`
	- Payload:
		- **domain-name** *String*
		- **license** *Enum*
	- Responses:
		- 200: payload is okay
		- 422: the problem with the payload
- **create-site**: kick off the black magic rube goldberg machine to spin up a new site
	- Payload:
		- **domain-name** *String*
		- **license** *Enum*
	- Responses:
		- 200: the site that was created
		- etc


#### Site

Properties:

- **url** *String*: url to the site
- **started** *Date*: date the site was created
- **expires** *Date*: date the site expires
- **license** *Enum*: currently has to be "Trial"
- **status** *Enum*: "Pending", "Failed", or "Success"

Links:

- **delete**: delete the site

### Endpoints

#### `/me/`

Returns the currently authenticated user if there is one, 401s if not

#### `/send-verification/`

Sends a verification code to the email

Payload:

- **email** *String*
- **firstName** *String*
- **lastName** *String*
- **userName** *String*

Response:

- ????

#### `/verify/`

Verifies the code was given to an email

Payload:

- **email** *String*
- **code** *String*

Response:

- ????
