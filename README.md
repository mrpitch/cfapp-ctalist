# Contentful App - Sortable CTA List

This Contentful App adds a custom UI that represents a sortable list of ctas (label & urls)

![](./contentful-app_cctalist.avif)

Inspired by [this video](https://www.youtube.com/watch?v=OtmV3TPTbRs) and bootstrapped with [Create Contentful App](https://github.com/contentful/create-contentful-app).

## Functionality overview

- Can be used on JSON Object fields
- Adds a sortable list-like UI
- Produces data in the form of an array of JSON objects
- Each object represents a tuple of
  - a label (string)
  - a url (string)
- Items can be sorted via drag and drop
- data Input is validated (label: max char 45, url: must start with https://)
- The following things can be configured:
  - number of max items

## Example Data structure

The data produced by the reference matrix field type looks something like this:

```json
[
  {
    "id": 1701962906057,
    "label": "Click me",
    "url": "https://#",
    "edit": false
  },
  {
    "id": 1702039169841,
    "label": "Read more",
    "url": "https://#",
    "edit": true
  },
  {
    "id": 1702047112520,
    "label": "Buy now",
    "url": "http://#"
  }
]
```

## Setup for Usage in Contentful

(1) Build your app with `$ pnpm build` and host the files found in `./build/` somewhere statically.

(2) In your Contentful account, create a new private app. Give it a name and enter the URL that points to the hosted version of your `./build/` directory.

(3) Under "Location", check "Entry field" and "JSON Object"

(4) Under "Instance Parameter Defintions":

- `maxItems` (number)

(5) Save the app and install it to the space(s) you like.

(6) When you add or edit a JSON Object field in your content model, you should now see your app in the "Appearance" tab, along with fields for the instance parameters you configured. Fill them out as follows:

## Development

In the project directory, you can run:

#### `pnpm start`

Creates or updates your app definition in contentful, and runs the app in development mode.
Open your app to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

#### `pnpm build`

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

## More about Contentful Apps

[Read more](https://www.contentful.com/developers/docs/extensibility/app-framework/create-contentful-app/) and check out the video on how to use the CLI.

Create Contentful App uses [Create React App](https://create-react-app.dev/). You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started) and how to further customize your app.
