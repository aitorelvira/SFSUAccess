# Application Folder

## Purpose
The purpose of this folder is to store all the source code and related files for your team's application. Source code MUST NOT be in any of folder. <strong>YOU HAVE BEEN WARNED</strong>

You are free to organize the contents of the folder as you see fit. But remember your team is graded on how you use Git. This does include the structure of your application. Points will be deducted from poorly structured application folders.

## Please use the rest of the README.md to store important information for your team's application.


# ---------------------------------------------
# How to run M2
# installation
Open up the SFSUAccess folder as it's own project directory.
cd into flask-backend and run py main.py
cd into react-frontend and run yarn start


#to build for production
yarn build
copy the build folder onto the server. rename build to html and place inside /var/www/ 

#notes to development team
any calls to the flask api will be done by appending /api/ to the call.
For example calling /search app-route of flask, within React you will call it as /api/search
