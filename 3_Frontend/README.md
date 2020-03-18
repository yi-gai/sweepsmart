# Assignment 2
## Your first complex React app

Your task is to take the website you created in Assignment 1 and turn it into a React App.

## Set up your environment
 - This lab already contains the configuration files (package.json, webpack.config.js) that was created [in this guide](https://github.com/kayashaolu/webarch/blob/master/md/w-setup-react-environment.md)
 - The src/index.js and src/index.html files have already been created
 - In order to activate this environment, you will need to redownload the node_modules from the package.json file
 - Run `npm install` to install the node packages
 - Run `npm start` to start your webserver
 - This should be it: you can make all of your changes in the src/index.js file and your main 

## Requirements

1. Your webpage should have all of the functionality of your assignment 1 site, including
	1. Header and footer
	2. Blog posts
	3. Other content pages (e.g. About Us)
	4. Links that open blog posts
	5. Validations in the contact us form
	6. Comments (extra credit)
2. You will also have to create a new page that contains all of the information people fill out when someone submits the contact us page. In short, in addition to all of the validations that you have done for the contact us page, on submit the website should go to the home page, and a link on the footer should lead to a page that displays all of the contact us submissions.

## Things to consider
1. Think about the different React Components that will  be a part of your app. For example, a header and a footer would make great React Components. Check the starter code for suggestions on where to go with this.
2. Think about how you are going to display a new page/blog post via a link. You will need to capture a click event for a link and use that to modify the state of the component you have that contains your content.
3. Think about how to design the component that will contain all of the contact us form submissions. This component will have state that is being added to every time someone successfully submits a contact us form. Also consider the contact us form as it’s own react component
4. Think about where you are going to contain the data from the blog posts and the rest of the pages. For this assignment containing each blog post in its own component and then creating a component that switches between those components would be great. Check the starter code for some ideas with this.
