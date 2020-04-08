# ART SPREAD

#### A webapp for artists looking to consistently upload to all social media platforms

## Important Links
* [MeisterTask](https://www.meistertask.com/app/project/88Cw0S4I/art-spread)
* [DB Designer](https://app.dbdesigner.net/designer/schema/312566)
![db deigner preview](./images/db-designer-preview.png)
* [Figma](https://www.figma.com/file/Uwm1qMrq7DO536Nzz4XoFT/Art-Spread?node-id=0%3A1)
![art spread figma preview](./images/figma-preview.png)

## Project Goals
* Simultaneous photo uploading
* Convenient account management
* Friendly UI/UX

## Technologies Used
* React.js
* Webpack 4
* Bootstrap 4
* Node.js
* PostgreSQL
* HTML5
* CSS3
* AWS EC2

## Live Demo
Try the application live at https://art-spread.jwenning.digital/

## Features
* User can login.
* User can view created posts and pending posts.
* User can create posts and delete posts.
* User can publish posts to reddit.
* User can link social media accounts.

## Preview
![alt text](./images/art-spread.gif)

## Development
### System Requirements
* Node.js 10 or higher
* NPM 6 or higher
* Postgre 10 or higher

### Getting Started
1. Clone the repository.

`git clone https://github.com/j-wenning/art-spread`

`cd art-spread`

2. Install all dependencies with NPM.

`npm install`

3. Import the example database to PostgreSQL.

`npm run db:import`

4. Start the project. Once started you can view the application by opening http://localhost:3000 in your browser.

`npm run dev`
