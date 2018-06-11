# MileStoneBlog
Everyone has a blog page, but if you think regular blog systems are complicated to introduce yourself and your achievements, you're on the right place. 
This is the new way to introduce yourself and your achievements.
Live demo: [Hasbi Sevinç](http://www.hasbisevinc.com)

# How to Use:
### 1) Installing MongoDB
If you have a mongodb running on your server, you can skip this section.
To install mongoDB into centos: https://www.digitalocean.com/community/tutorials/how-to-install-mongodb-on-centos-7
### 2) Clonning/Downloading Project
> git clone https://github.com/hasbisevinc/MileStoneBlog.git

or download it with **Download** button on github page.

Now, you will have backend and frontend folders. Backend contains our api functions that connect to mongoDB. Frontend folder contains blog and admin page ui with required JS files.

### 3) Edit Files
#### cross-origin settings
- Go to MileStoneBlog/backend directory and open server.js with your favorite text editor.
- Change urls in the origin section on line 12.
> If your website and backend urls are stored in different domains, make sure, you have write all combination of your web site url. Otherwise, you cannot connect backend from your website.

#### DB URL
- Go to MileStoneBlog/backend/app/routes and open index.js with your favorite text editor.
- Change **url** variable with your mongoDB url. 
> default url usually 
> const  url  =  "mongodb://127.0.0.1:27017"

#### API URL
- Go to MileStoneBlog/frontend/js and open config.js with your favorite text editor.
- Change **API_URL** variable with url that will be indicate your backend.
> for example:  
> var  API_URL  =  "http://YOUR_SERVER_IP:8000/"

### 4)Upload Backend Files Into Your Server
- Upload backend files into your server. Go to root directory of backend (/MileStoneBlog/backend)
- Start backend script
> npm start

### 5)Upload Frontend Files Into Your Server
- Upload frontend files via FTP
- Go to your website
- You should see an empty blog page with header
- Go to admin page
> http://YOUR_WEB_SITE.com/admin
- Login with
> username:admin
> password:admin
- Go to settings tab and change your password!!!
