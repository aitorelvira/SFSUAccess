# Credentials Folder

## The purpose of this folder is to store all credentials needed to log into your server and databases. This is important for many reasons. But the two most important reasons is
    1. Grading , servers and databases will be logged into to check code and functionality of application. Not changes will be unless directed and coordinated with the team.
    2. Help. If a class TA or class CTO needs to help a team with an issue, this folder will help facilitate this giving the TA or CTO all needed info AND instructions for logging into your team's server. 


# Below is a list of items required. Missing items will causes points to be deducted from multiple milestone submissions.

1. Server URL or IP
## http://52.53.184.216/
2. SSH username
## ubuntu
3. SSH password or key.
## password: csc648 or use SSH key.
4. Database URL or IP and port used.
csc648.cxyapjc8a04v.us-west-1.rds.amazonaws.com  PORT 3306
    <br><strong> NOTE THIS DOES NOT MEAN YOUR DATABASE NEEDS A PUBLIC FACING PORT.</strong> But knowing the IP and port number will help with SSH tunneling into the database. The default port is more than sufficient for this class.
5. Database username
## admin
6. Database password
## rdsmysql
7. Database name (basically the name that contains all your tables)
## proddb and testdb
8. Instructions on how to use the above information.
# Instructions
## To log into remote server on AWS
Create terminal window and change directories to your directory containing our SSH key
<br>chmod 400 csc648team02.pem
<br>ssh -i "csc648team02.pem" ubuntu@ec2-52-53-184-216.us-west-1.compute.amazonaws.com;
## To log into mysql database
### Via ec2 ssh session
sudo mysql -u admin -p
<br>enter rdsmysql for password.

### Via mysql client application
Fill out connection screen using the given URL, PORT. <br>user:admin and password: rdsmysql
## to view live website
Visit http://52.53.184.216/

# Most important things to Remember
## These values need to kept update to date throughout the semester. <br>
## <strong>Failure to do so will result it points be deducted from milestone submissions.</strong><br>
## You may store the most of the above in this README.md file. DO NOT Store the SSH key or any keys in this README.md file.
