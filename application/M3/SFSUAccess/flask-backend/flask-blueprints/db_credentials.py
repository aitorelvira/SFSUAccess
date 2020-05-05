import pymysql as pymysql

connection = pymysql.connect(host='csc648.cxyapjc8a04v.us-west-1.rds.amazonaws.com',
                             user='admin',
                             password='rdsmysql',
                             db='testdbkevin',
                             cursorclass=pymysql.cursors.DictCursor)
cur = connection.cursor()